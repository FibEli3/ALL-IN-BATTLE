import { createRegistration, prepareDatabase } from "@/lib/db";
import { calculateSelection } from "@/lib/event-options";
import { NextResponse } from "next/server";
import { z } from "zod";

const manualRegistrationSchema = z.object({
  fullName: z.string().trim().min(2, "Укажите имя и фамилию"),
  nickname: z.string().trim().min(2, "Укажите никнейм"),
  age: z.string().trim().max(3).optional().or(z.literal("")),
  phone: z.string().trim().min(8, "Проверьте номер телефона"),
  participationType: z.enum(["participant", "spectator"]),
  selectedOptionIds: z.array(z.string()).min(1, "Выберите хотя бы одну номинацию"),
});

const legacyManualRegistrationSchema = manualRegistrationSchema.extend({
  receiptFileName: z.string().trim().min(1, "Добавьте файл чека"),
  receiptFileMimeType: z.string().trim().min(1, "Некорректный тип файла"),
  receiptFileBase64: z.string().trim().min(1, "Файл чека не прочитан"),
});

const MAX_RECEIPT_BYTES = 1.5 * 1024 * 1024;
const MAX_LEGACY_RECEIPT_BYTES = 2.5 * 1024 * 1024;
type ManualRegistrationPayload = z.infer<typeof manualRegistrationSchema>;

export async function POST(request: Request) {
  const startedAt = performance.now();

  try {
    let payload: ManualRegistrationPayload;
    let receiptFileName: string;
    let receiptFileMimeType: string;
    let receiptFileBytes: Uint8Array;
    let maxReceiptBytes = MAX_RECEIPT_BYTES;

    if (request.headers.get("content-type")?.includes("application/json")) {
      const [body] = await Promise.all([request.json(), prepareDatabase()]);
      const legacyPayload = legacyManualRegistrationSchema.parse(body);
      payload = legacyPayload;
      receiptFileName = legacyPayload.receiptFileName;
      receiptFileMimeType = legacyPayload.receiptFileMimeType;
      receiptFileBytes = new Uint8Array(Buffer.from(legacyPayload.receiptFileBase64, "base64"));
      maxReceiptBytes = MAX_LEGACY_RECEIPT_BYTES;
    } else {
      const [formData] = await Promise.all([request.formData(), prepareDatabase()]);
      const rawPayload = formData.get("payload");
      const receipt = formData.get("receipt");

      if (typeof rawPayload !== "string" || !(receipt instanceof File)) {
        return NextResponse.json(
          { ok: false, message: "Не удалось прочитать данные заявки или файл чека" },
          { status: 400 },
        );
      }

      let decodedPayload: unknown;
      try {
        decodedPayload = JSON.parse(rawPayload);
      } catch {
        return NextResponse.json(
          { ok: false, message: "Данные заявки повреждены. Заполните форму ещё раз." },
          { status: 400 },
        );
      }

      payload = manualRegistrationSchema.parse(decodedPayload);
      receiptFileName = receipt.name;
      receiptFileMimeType = receipt.type || "application/octet-stream";
      receiptFileBytes = new Uint8Array(await receipt.arrayBuffer());
    }

    const selection = calculateSelection(payload.selectedOptionIds);

    if (selection.unknownIds.length > 0) {
      return NextResponse.json(
        { ok: false, message: "Некоторые выбранные опции не поддерживаются" },
        { status: 400 },
      );
    }

    if (selection.contestSelectionCount > 1) {
      return NextResponse.json(
        { ok: false, message: "Для Contest 3×3 можно выбрать только одну категорию" },
        { status: 400 },
      );
    }

    if (selection.totalRub <= 0) {
      return NextResponse.json(
        { ok: false, message: "Сумма оплаты должна быть больше нуля" },
        { status: 400 },
      );
    }

    if (receiptFileBytes.byteLength <= 0 || receiptFileBytes.byteLength > maxReceiptBytes) {
      return NextResponse.json(
        { ok: false, message: "Файл чека слишком большой. Загрузите скриншот или файл меньшего размера." },
        { status: 400 },
      );
    }

    const parsedAt = performance.now();
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
      receiptFileName,
      receiptFileMimeType,
      receiptFileBytes,
    });

    const completedAt = performance.now();
    return NextResponse.json(
      { ok: true, registration: created },
      {
        status: 201,
        headers: {
          "Server-Timing": `parse;dur=${(parsedAt - startedAt).toFixed(1)}, db;dur=${(completedAt - parsedAt).toFixed(1)}`,
        },
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "Проверьте данные формы", details: error.flatten() },
        { status: 400 },
      );
    }

    console.error("[api/registrations/manual] failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { ok: false, message: "Не удалось отправить заявку. Попробуйте ещё раз." },
      { status: 500 },
    );
  }
}
