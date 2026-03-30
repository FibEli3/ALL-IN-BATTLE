import { attachPaymentToRegistration, getRegistrationById } from "@/lib/db";
import { initTbankPayment } from "@/lib/tbank";
import { NextResponse } from "next/server";
import { z } from "zod";

const initSchema = z.object({
  registrationId: z.string().uuid().or(z.string().min(10)),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = initSchema.parse(body);
    const registration = await getRegistrationById(payload.registrationId);

    if (!registration) {
      return NextResponse.json(
        { ok: false, message: "Заявка не найдена" },
        { status: 404 },
      );
    }

    if (registration.amountRub <= 0) {
      return NextResponse.json(
        { ok: false, message: "Сумма оплаты не рассчитана" },
        { status: 400 },
      );
    }

    const orderId = `AIB-${Date.now()}-${registration.id.slice(0, 8)}`;
    const payment = await initTbankPayment({
      amountRub: registration.amountRub,
      orderId,
      description: `ALL IN BATTLE - ${registration.nickname}`,
      registrationId: registration.id,
      fullName: registration.fullName,
      email: registration.email ?? "",
      phone: registration.phone,
    });

    await attachPaymentToRegistration({
      registrationId: registration.id,
      orderId,
      paymentId: payment.paymentId,
    });

    return NextResponse.json({
      ok: true,
      paymentUrl: payment.paymentUrl,
      orderId,
      amountRub: registration.amountRub,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Не удалось инициализировать оплату",
      },
      { status: 400 },
    );
  }
}
