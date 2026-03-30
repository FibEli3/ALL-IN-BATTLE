import { setRegistrationPaidByOrderId } from "@/lib/db";
import { verifyTbankToken } from "@/lib/tbank";
import { NextResponse } from "next/server";

type TbankWebhookPayload = {
  OrderId?: string;
  Status?: string;
  Success?: boolean;
  Token?: string;
  [key: string]: string | number | boolean | null | undefined;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TbankWebhookPayload;

    if (!verifyTbankToken(payload)) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    if (payload.Success === true && payload.Status === "CONFIRMED" && payload.OrderId) {
      await setRegistrationPaidByOrderId(payload.OrderId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
