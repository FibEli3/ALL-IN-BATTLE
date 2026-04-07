import { listRegistrations } from "@/lib/db";
import { EVENT_OPTIONS, getOptionsByDay } from "@/lib/event-options";

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

  return { ok: true, status: 200, token: providedToken };
}

function parseOptions(raw: string | null) {
  if (!raw) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapOptionIdsToTitles(optionIds: string[]) {
  return optionIds.map((id) => EVENT_OPTIONS.find((item) => item.id === id)?.title ?? id);
}

function xmlEscape(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cell(value: string | number | null | undefined) {
  return `<Cell><Data ss:Type="String">${xmlEscape(value)}</Data></Cell>`;
}

function worksheet(name: string, headers: string[], rows: Array<Array<string | number | null | undefined>>) {
  const headerRow = `<Row>${headers.map((h) => cell(h)).join("")}</Row>`;
  const bodyRows = rows.map((row) => `<Row>${row.map((v) => cell(v)).join("")}</Row>`).join("");

  return `
    <Worksheet ss:Name="${xmlEscape(name)}">
      <Table>
        ${headerRow}
        ${bodyRows}
      </Table>
    </Worksheet>
  `;
}

function formatDateTimeRu(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export async function GET(request: Request) {
  const access = checkAccess(request);
  if (!access.ok) {
    return new Response(access.message, { status: access.status });
  }

  const all = await listRegistrations();
  const day1Options = getOptionsByDay("day1");
  const day2Options = day2SummaryOrder
    .map((id) => getOptionsByDay("day2").find((option) => option.id === id))
    .filter((option): option is ReturnType<typeof getOptionsByDay>[number] => Boolean(option));
  const url = new URL(request.url);
  const token = access.token ?? url.searchParams.get("token") ?? "";

  const registrationsHeaders = [
    "ID",
    "Дата",
    "Сумма (₽)",
    "ФИО",
    "Ник",
    "Телефон",
    "Возраст",
    "Опции",
    "Есть чек",
    "Имя файла чека",
    "Ссылка на чек",
  ];

  const registrationRows = all.map((item) => {
    const options = mapOptionIdsToTitles(parseOptions(item.selectedOptionIds));
    const hasReceipt = Boolean(item.receiptFileBase64);
    const receiptDownloadUrl = hasReceipt
      ? `${url.origin}/api/admin/registrations/receipt?token=${encodeURIComponent(token)}&id=${encodeURIComponent(item.id)}`
      : "";

    return [
      item.id,
      formatDateTimeRu(item.createdAt),
      item.amountRub,
      item.fullName,
      item.nickname ?? "",
      item.phone,
      item.age ?? "",
      options.join(", "),
      hasReceipt ? "Да" : "Нет",
      item.receiptFileName ?? "",
      receiptDownloadUrl,
    ];
  });

  const summaryHeaders = ["Номинация", "Зарегистрировано", "Оплачено"];

  const day1Rows = day1Options.map((option) => {
    const registered = all.filter((item) => parseOptions(item.selectedOptionIds).includes(option.id)).length;
    const paid = all.filter(
      (item) => parseOptions(item.selectedOptionIds).includes(option.id),
    ).length;

    return [option.title, registered, paid];
  });

  const day2Rows = day2Options.map((option) => {
    const registered = all.filter((item) => parseOptions(item.selectedOptionIds).includes(option.id)).length;
    const paid = all.filter(
      (item) => parseOptions(item.selectedOptionIds).includes(option.id),
    ).length;

    return [option.title, registered, paid];
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  ${worksheet("Заявки", registrationsHeaders, registrationRows)}
  ${worksheet("Сводка День 1", summaryHeaders, day1Rows)}
  ${worksheet("Сводка День 2", summaryHeaders, day2Rows)}
</Workbook>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": 'attachment; filename="all-in-battle-registrations.xls"',
      "Cache-Control": "no-store",
    },
  });
}
