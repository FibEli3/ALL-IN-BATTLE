import { createHash } from "node:crypto";

type Primitive = string | number | boolean | null | undefined;

type TbankInitPayload = {
  Amount: number;
  OrderId: string;
  Description: string;
  SuccessURL: string;
  FailURL: string;
  NotificationURL: string;
  DATA?: {
    registrationId: string;
    fullName: string;
    email: string;
    phone: string;
  };
};

type TbankInitResponse = {
  Success: boolean;
  ErrorCode: string;
  Message?: string;
  Details?: string;
  PaymentId?: string | number;
  PaymentURL?: string;
};

function getConfig() {
  const terminalKey = process.env.TINKOFF_TERMINAL_KEY;
  const password = process.env.TINKOFF_PASSWORD;
  const successUrl = process.env.TINKOFF_SUCCESS_URL;
  const failUrl = process.env.TINKOFF_FAIL_URL;
  const notificationUrl = process.env.TINKOFF_NOTIFICATION_URL;

  if (!terminalKey || !password || !successUrl || !failUrl || !notificationUrl) {
    throw new Error("T-Bank env vars are missing");
  }

  return { terminalKey, password, successUrl, failUrl, notificationUrl };
}

function normalizeValue(value: Primitive): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

export function makeTbankToken(payload: Record<string, Primitive>, password: string) {
  const sortedKeys = Object.keys(payload)
    .filter((key) => key !== "Token")
    .sort((a, b) => a.localeCompare(b));

  const raw = sortedKeys.map((key) => normalizeValue(payload[key])).join("") + password;

  return createHash("sha256").update(raw).digest("hex");
}

export function verifyTbankToken(payload: Record<string, Primitive>) {
  const password = process.env.TINKOFF_PASSWORD;
  const incomingToken = payload.Token;

  if (!password || typeof incomingToken !== "string") {
    return false;
  }

  const expected = makeTbankToken(payload, password);
  return expected.toLowerCase() === incomingToken.toLowerCase();
}

export async function initTbankPayment(params: {
  amountRub: number;
  orderId: string;
  description: string;
  registrationId: string;
  fullName: string;
  email: string;
  phone: string;
}) {
  const { terminalKey, password, successUrl, failUrl, notificationUrl } = getConfig();
  const amountKopecks = Math.round(params.amountRub * 100);

  const payload: TbankInitPayload & { TerminalKey: string; Token: string } = {
    TerminalKey: terminalKey,
    Amount: amountKopecks,
    OrderId: params.orderId,
    Description: params.description,
    SuccessURL: successUrl,
    FailURL: failUrl,
    NotificationURL: notificationUrl,
    DATA: {
      registrationId: params.registrationId,
      fullName: params.fullName,
      email: params.email,
      phone: params.phone,
    },
    Token: "",
  };

  const tokenPayload: Record<string, Primitive> = {
    TerminalKey: payload.TerminalKey,
    Amount: payload.Amount,
    OrderId: payload.OrderId,
    Description: payload.Description,
    SuccessURL: payload.SuccessURL,
    FailURL: payload.FailURL,
    NotificationURL: payload.NotificationURL,
  };

  payload.Token = makeTbankToken(tokenPayload, password);

  const response = await fetch("https://securepay.tinkoff.ru/v2/Init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as TbankInitResponse;

  if (!response.ok || !result.Success || !result.PaymentId || !result.PaymentURL) {
    throw new Error(result.Message ?? result.Details ?? "T-Bank Init failed");
  }

  return {
    paymentId: String(result.PaymentId),
    paymentUrl: result.PaymentURL,
    amountKopecks,
  };
}
