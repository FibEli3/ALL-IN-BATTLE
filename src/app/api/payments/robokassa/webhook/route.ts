import { setRegistrationPaidByOrderId } from "@/lib/db";
import { verifyRobokassaResultSignature } from "@/lib/robokassa";

function textResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let payload = new URLSearchParams();

    if (contentType.includes("application/x-www-form-urlencoded")) {
      payload = new URLSearchParams(await request.text());
    } else if (contentType.includes("application/json")) {
      const json = (await request.json()) as Record<string, string>;
      payload = new URLSearchParams();
      Object.entries(json).forEach(([key, value]) => {
        payload.set(key, String(value));
      });
    } else {
      payload = new URLSearchParams(await request.text());
    }

    const outSum = payload.get("OutSum") ?? "";
    const invoiceId = payload.get("InvId") ?? "";
    const signature = payload.get("SignatureValue") ?? "";

    if (!outSum || !invoiceId || !signature) {
      return textResponse("bad request", 400);
    }

    const valid = verifyRobokassaResultSignature({
      outSum,
      invoiceId,
      signature,
    });

    if (!valid) {
      return textResponse("bad sign", 403);
    }

    await setRegistrationPaidByOrderId(invoiceId);
    return textResponse(`OK${invoiceId}`);
  } catch {
    return textResponse("bad request", 400);
  }
}

