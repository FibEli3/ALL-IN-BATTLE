import { attachPaymentToRegistration, getRegistrationById } from "@/lib/db";
import { createRobokassaPaymentUrl } from "@/lib/robokassa";
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
      return NextResponse.json({ ok: false, message: "Заявка не найдена" }, { status: 404 });
    }

    if (registration.amountRub <= 0) {
      return NextResponse.json(
        { ok: false, message: "Сумма оплаты не рассчитана" },
        { status: 400 },
      );
    }

    const invoiceId = `${Date.now()}${registration.id.slice(0, 4).replace(/\D/g, "9")}`;
    const payment = createRobokassaPaymentUrl({
      amountRub: registration.amountRub,
      invoiceId,
      description: `ALL IN BATTLE - ${registration.nickname}`,
      email: registration.email ?? "",
    });

    await attachPaymentToRegistration({
      registrationId: registration.id,
      orderId: invoiceId,
      paymentId: invoiceId,
    });

    return NextResponse.json({
      ok: true,
      paymentUrl: payment.paymentUrl,
      orderId: invoiceId,
      amountRub: registration.amountRub,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Не удалось инициализировать оплату",
      },
      { status: 400 },
    );
  }
}

