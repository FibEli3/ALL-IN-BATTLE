import { createRegistration } from "@/lib/db";
import { calculateSelection } from "@/lib/event-options";
import { NextResponse } from "next/server";
import { z } from "zod";

const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Укажи имя и фамилию"),
  nickname: z.string().trim().min(2, "Укажи никнейм"),
  age: z.string().trim().max(20).optional().or(z.literal("")),
  phone: z.string().trim().min(8, "Проверь номер телефона"),
  email: z.string().trim().email("Проверь email").optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  danceExperience: z.string().trim().max(300).optional().or(z.literal("")),
  participationType: z.enum(["participant", "spectator"]),
  comment: z.string().trim().max(500).optional().or(z.literal("")),
  selectedOptionIds: z.array(z.string()).min(1, "Выбери хотя бы один вариант"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = registrationSchema.parse(body);
    const selection = calculateSelection(payload.selectedOptionIds);

    if (selection.unknownIds.length > 0) {
      return NextResponse.json(
        { ok: false, message: "Некоторые выбранные опции не поддерживаются" },
        { status: 400 },
      );
    }

    const created = await createRegistration({
      fullName: payload.fullName,
      nickname: payload.nickname,
      age: payload.age || null,
      phone: payload.phone,
      email: payload.email || null,
      city: payload.city || null,
      danceExperience: payload.danceExperience || null,
      participationType: payload.participationType,
      comment: payload.comment || null,
      selectedOptionIds: selection.selected.map((item) => item.id),
      amountRub: selection.totalRub,
    });

    return NextResponse.json({ ok: true, registration: created }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: "Проверь данные формы",
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Не удалось отправить заявку. Попробуй ещё раз.",
      },
      { status: 500 },
    );
  }
}
