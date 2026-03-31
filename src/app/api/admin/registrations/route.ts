import { listRegistrations } from "@/lib/db";
import { NextResponse } from "next/server";

const allowedStatuses = new Set(["pending", "created", "paid"]);

function checkAccess(request: Request) {
  const adminToken = process.env.ADMIN_DASHBOARD_TOKEN;
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
  const providedToken = tokenFromHeader ?? tokenFromQuery;

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
    const statusParam = url.searchParams.get("status");
    const status =
      statusParam && allowedStatuses.has(statusParam)
        ? (statusParam as "pending" | "created" | "paid")
        : undefined;

    const registrations = await listRegistrations(status);

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

