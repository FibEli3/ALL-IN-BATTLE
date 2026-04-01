import { getRegistrationReceiptById } from "@/lib/db";

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

function safeFilename(name: string) {
  return name.replace(/[^\w.\-()\u0400-\u04FF ]+/g, "_");
}

export async function GET(request: Request) {
  const access = checkAccess(request);
  if (!access.ok) {
    return new Response(access.message, { status: access.status });
  }

  const url = new URL(request.url);
  const id = (url.searchParams.get("id") ?? "").trim();

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const receipt = await getRegistrationReceiptById(id);
  if (!receipt) {
    return new Response("Registration not found", { status: 404 });
  }

  if (!receipt.receiptFileBase64) {
    return new Response("Receipt not found", { status: 404 });
  }

  const buffer = Buffer.from(receipt.receiptFileBase64, "base64");
  const fileName = safeFilename(receipt.receiptFileName ?? `receipt-${id}.bin`);
  const contentType = receipt.receiptFileMimeType || "application/octet-stream";

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}

