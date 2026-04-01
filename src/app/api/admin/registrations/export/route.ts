import { listRegistrations } from "@/lib/db";
import { EVENT_OPTIONS, getOptionsByDay } from "@/lib/event-options";

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

function escapeCsv(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const access = checkAccess(request);
  if (!access.ok) {
    return new Response(access.message, { status: access.status });
  }

  const all = await listRegistrations();
  const day1Options = getOptionsByDay("day1");
  const day2Options = getOptionsByDay("day2");
  const url = new URL(request.url);
  const token = access.token ?? url.searchParams.get("token") ?? "";

  const header = [
    "id",
    "createdAt",
    "paymentStatus",
    "amountRub",
    "fullName",
    "nickname",
    "phone",
    "age",
    "participationType",
    "selectedOptions",
    "paymentOrderId",
    "hasReceipt",
    "receiptFileName",
    "receiptDownloadUrl",
  ];

  const dataRows = all.map((item) => {
    const options = mapOptionIdsToTitles(parseOptions(item.selectedOptionIds));
    const hasReceipt = Boolean(item.receiptFileName && item.receiptFileBase64);
    const receiptDownloadUrl = hasReceipt
      ? `${url.origin}/api/admin/registrations/receipt?token=${encodeURIComponent(token)}&id=${encodeURIComponent(item.id)}`
      : "";

    return [
      item.id,
      item.createdAt,
      item.paymentStatus,
      item.amountRub,
      item.fullName,
      item.nickname ?? "",
      item.phone,
      item.age ?? "",
      item.participationType,
      options.join(", "),
      item.paymentOrderId ?? "",
      hasReceipt ? "yes" : "no",
      item.receiptFileName ?? "",
      receiptDownloadUrl,
    ];
  });

  const blankSummaryRow = new Array(header.length).fill("");
  const summaryRows: Array<string[]> = [];

  summaryRows.push(["Summary Day 1", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
  summaryRows.push(["nomination", "registered", "paid", "", "", "", "", "", "", "", "", "", "", ""]);

  for (const option of day1Options) {
    const registered = all.filter((item) => parseOptions(item.selectedOptionIds).includes(option.id)).length;
    const paid = all.filter(
      (item) => item.paymentStatus === "paid" && parseOptions(item.selectedOptionIds).includes(option.id),
    ).length;

    summaryRows.push([
      option.title,
      String(registered),
      String(paid),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
  }

  summaryRows.push(blankSummaryRow);
  summaryRows.push(["Summary Day 2", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
  summaryRows.push(["nomination", "registered", "paid", "", "", "", "", "", "", "", "", "", "", ""]);

  for (const option of day2Options) {
    const registered = all.filter((item) => parseOptions(item.selectedOptionIds).includes(option.id)).length;
    const paid = all.filter(
      (item) => item.paymentStatus === "paid" && parseOptions(item.selectedOptionIds).includes(option.id),
    ).length;

    summaryRows.push([
      option.title,
      String(registered),
      String(paid),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
  }

  const csv = [
    header.map(escapeCsv).join(";"),
    ...dataRows.map((row) => row.map(escapeCsv).join(";")),
    "",
    ...summaryRows.map((row) => row.map(escapeCsv).join(";")),
  ].join("\n");

  const bom = "\uFEFF";
  return new Response(`${bom}${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="all-in-battle-registrations.csv"',
      "Cache-Control": "no-store",
    },
  });
}
