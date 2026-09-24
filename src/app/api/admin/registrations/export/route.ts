import { listRegistrations } from "@/lib/db";
import { getOptionsByDay } from "@/lib/event-options";
import {
  mapOptionIdsToTitles,
  parseSelectedOptionIds,
} from "@/lib/registration-admin";
import ExcelJS from "exceljs";

export const runtime = "nodejs";

const day2SummaryOrder = [
  "day2-baby",
  "day2-kids-beg",
  "day2-kids-pro",
  "day2-jun-beg",
  "day2-jun-pro",
  "day2-beg-16-plus",
  "day2-pro-16-plus",
  "day2-spectator",
] as const;

function checkAccess(request: Request) {
  const adminToken = process.env.ADMIN_DASHBOARD_TOKEN?.trim();
  if (!adminToken) {
    return {
      ok: false,
      message: "ADMIN_DASHBOARD_TOKEN is not set",
      status: 500,
    };
  }

  const url = new URL(request.url);
  const tokenFromQuery = url.searchParams.get("token");
  const tokenFromHeader = request.headers.get("x-admin-token");
  const providedToken = (tokenFromHeader ?? tokenFromQuery ?? "").trim();

  if (providedToken !== adminToken) {
    return { ok: false, message: "Unauthorized", status: 401 };
  }

  return { ok: true, status: 200 };
}

function styleHeader(row: ExcelJS.Row) {
  row.height = 28;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2A6A34" },
    };
    cell.alignment = { vertical: "middle" };
  });
}

export async function GET(request: Request) {
  const access = checkAccess(request);
  if (!access.ok) {
    return new Response(access.message, { status: access.status });
  }

  const all = await listRegistrations();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ALL IN BATTLE";
  workbook.created = new Date();

  const registrationsSheet = workbook.addWorksheet("Заявки", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  registrationsSheet.columns = [
    { header: "ID", key: "id", width: 38 },
    { header: "Дата", key: "createdAt", width: 20 },
    { header: "Сумма (₽)", key: "amountRub", width: 15 },
    { header: "ФИО", key: "fullName", width: 28 },
    { header: "Ник", key: "nickname", width: 22 },
    { header: "Телефон", key: "phone", width: 20 },
    { header: "Возраст", key: "age", width: 12 },
    { header: "Тип участия", key: "participationType", width: 18 },
    { header: "Опции", key: "options", width: 48 },
    { header: "Есть чек", key: "hasReceipt", width: 13 },
    { header: "Имя файла чека", key: "receiptFileName", width: 32 },
  ];

  for (const registration of all) {
    const optionTitles = mapOptionIdsToTitles(
      parseSelectedOptionIds(registration.selectedOptionIds),
    );

    registrationsSheet.addRow({
      id: registration.id,
      createdAt: new Date(registration.createdAt),
      amountRub: registration.amountRub,
      fullName: registration.fullName,
      nickname: registration.nickname ?? "",
      phone: registration.phone,
      age: registration.age ?? "",
      participationType:
        registration.participationType === "spectator" ? "Зритель" : "Участник",
      options: optionTitles.join(", "),
      hasReceipt: registration.hasReceipt ? "Да" : "Нет",
      receiptFileName: registration.receiptFileName ?? "",
    });
  }

  styleHeader(registrationsSheet.getRow(1));
  registrationsSheet.autoFilter = "A1:K1";
  registrationsSheet.getColumn("createdAt").numFmt = "dd.mm.yyyy hh:mm";
  registrationsSheet.getColumn("amountRub").numFmt = '#,##0 "₽"';
  registrationsSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.alignment = { vertical: "top", wrapText: true };
    }
  });

  const summaryHeaders = ["Номинация", "Зарегистрировано", "С чеком"];
  const summarySheets = [
    { name: "Сводка День 1", options: getOptionsByDay("day1") },
    {
      name: "Сводка День 2",
      options: day2SummaryOrder
        .map((id) => getOptionsByDay("day2").find((option) => option.id === id))
        .filter((option): option is ReturnType<typeof getOptionsByDay>[number] => Boolean(option)),
    },
  ];

  for (const summary of summarySheets) {
    const sheet = workbook.addWorksheet(summary.name, {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    sheet.columns = [
      { header: summaryHeaders[0], key: "title", width: 42 },
      { header: summaryHeaders[1], key: "registered", width: 22 },
      { header: summaryHeaders[2], key: "paid", width: 16 },
    ];

    for (const option of summary.options) {
      const matching = all.filter((registration) =>
        parseSelectedOptionIds(registration.selectedOptionIds).includes(option.id),
      );
      sheet.addRow({
        title: option.title,
        registered: matching.length,
        paid: matching.filter((registration) => registration.hasReceipt).length,
      });
    }

    styleHeader(sheet.getRow(1));
    sheet.autoFilter = "A1:C1";
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(Buffer.from(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="all-in-battle-registrations.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
