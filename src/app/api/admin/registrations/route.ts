import { listRegistrations } from "@/lib/db";
import { getOptionsByDay } from "@/lib/event-options";
import { NextResponse } from "next/server";

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

    const allRegistrations = await listRegistrations();
    const registrations = day
      ? allRegistrations.filter((item) => {
          const dayOptionIds = new Set(getOptionsByDay(day).map((option) => option.id));
          if (!item.selectedOptionIds) {
            return false;
          }

          try {
            const parsed = JSON.parse(item.selectedOptionIds) as string[];
            return Array.isArray(parsed) && parsed.some((id) => dayOptionIds.has(id));
          } catch {
            return false;
          }
        })
      : allRegistrations;

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
