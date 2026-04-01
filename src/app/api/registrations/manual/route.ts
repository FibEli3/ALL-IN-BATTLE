import { createRegistration } from "@/lib/db";
import { calculateSelection } from "@/lib/event-options";
import { NextResponse } from "next/server";
import { z } from "zod";

const manualRegistrationSchema = z.object({
  fullName: z.string().trim().min(2, "Укажите имя и фамилию"),
  nickname: z.string().trim().min(2, "Укажите никнейм"),
  age: z.string().trim().max(20).optional().or(z.literal("")),
  phone: z.string().trim().min(8, "Проверьте номер телефона"),
  participationType: z.enum(["participant", "spectator"]),
  selectedOptionIds: z.array(z.string()).min(1, "Выберите хотя бы одну номинацию"),
  receiptFileName: z.string().trim().min(1, "Добавьте файл чека"),
  receiptFileMimeType: z.string().trim().min(1, "Некорректный тип файла"),
  receiptFileBase64: z.string().trim().min(1, "Файл чека не прочитан"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = manualRegistrationSchema.parse(body);
    const selection = calculateSelection(payload.selectedOptionIds);

    if (selection.unknownIds.length > 0) {
      return NextResponse.json(
        { ok: false, message: "Некоторые выбранные опции не поддерживаются" },
        { status: 400 },
      );
    }

    if (selection.totalRub <= 0) {
      return NextResponse.json(
        { ok: false, message: "Сумма оплаты должна быть больше нуля" },
        { status: 400 },
      );
    }

    if (payload.receiptFileBase64.length > 14_000_000) {
      return NextResponse.json(
        { ok: false, message: "Файл чека слишком большой. Загрузите файл до 10 МБ." },
        { status: 400 },
      );
    }

    const created = await createRegistration({
      fullName: payload.fullName,
      nickname: payload.nickname,
      age: payload.age || null,
      phone: payload.phone,
      email: null,
      city: null,
      danceExperience: null,
      participationType: payload.participationType,
      comment: null,
      selectedOptionIds: selection.selected.map((item) => item.id),
      amountRub: selection.totalRub,
      paymentStatus: "paid",
      receiptFileName: payload.receiptFileName,
      receiptFileMimeType: payload.receiptFileMimeType,
      receiptFileBase64: payload.receiptFileBase64,
    });

    return NextResponse.json({ ok: true, registration: created }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "Проверьте данные формы", details: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { ok: false, message: "Не удалось отправить заявку. Попробуйте ещё раз." },
      { status: 500 },
    );
  }
}

