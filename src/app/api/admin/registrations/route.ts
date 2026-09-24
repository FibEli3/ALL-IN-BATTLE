import { listRegistrations } from "@/lib/db";
import { EVENT_OPTIONS } from "@/lib/event-options";
import { filterRegistrations } from "@/lib/registration-admin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

export async function GET(request: Request) {
  const access = checkAccess(request);
  if (!access.ok) {
    return NextResponse.json(
      { ok: false, message: access.message },
      { status: access.status },
    );
  }

  try {
    const url = new URL(request.url);
    const dayParam = url.searchParams.get("day");
    const day = dayParam === "day1" || dayParam === "day2" ? dayParam : undefined;
    const receiptParam = url.searchParams.get("receipt");
    const receipt = receiptParam === "yes" || receiptParam === "no" ? receiptParam : undefined;
    const optionParam = (url.searchParams.get("option") ?? "").trim();
    const optionId = EVENT_OPTIONS.some((option) => option.id === optionParam)
      ? optionParam
      : undefined;
    const query = (url.searchParams.get("q") ?? "").trim();

    const allRegistrations = await listRegistrations();
    const registrations = filterRegistrations(allRegistrations, {
      day,
      optionId,
      query,
      receipt,
    });

    return NextResponse.json({
      ok: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch registrations",
      },
      { status: 500 },
    );
  }
}
