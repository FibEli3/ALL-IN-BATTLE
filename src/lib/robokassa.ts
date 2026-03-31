import { createHash } from "node:crypto";

type RobokassaConfig = {
  merchantLogin: string;
  password1: string;
  password2: string;
  successUrl: string;
  failUrl: string;
  resultUrl: string;
  isTest: boolean;
};

type RobokassaInitParams = {
  amountRub: number;
  invoiceId: string;
  description: string;
  email?: string;
};

function md5(value: string) {
  return createHash("md5").update(value).digest("hex");
}

function getConfig(): RobokassaConfig {
  const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
  const password1 = process.env.ROBOKASSA_PASSWORD_1;
  const password2 = process.env.ROBOKASSA_PASSWORD_2;
  const successUrl = process.env.ROBOKASSA_SUCCESS_URL;
  const failUrl = process.env.ROBOKASSA_FAIL_URL;
  const resultUrl = process.env.ROBOKASSA_RESULT_URL;
  const isTest = process.env.ROBOKASSA_IS_TEST === "true";

  if (
    !merchantLogin ||
    !password1 ||
    !password2 ||
    !successUrl ||
    !failUrl ||
    !resultUrl
  ) {
    throw new Error("Robokassa env vars are missing");
  }

  return {
    merchantLogin,
    password1,
    password2,
    successUrl,
    failUrl,
    resultUrl,
    isTest,
  };
}

function toOutSum(amountRub: number) {
  return amountRub.toFixed(2);
}

export function makeRobokassaInitSignature(params: {
  merchantLogin: string;
  outSum: string;
  invoiceId: string;
  password1: string;
}) {
  return md5(
    `${params.merchantLogin}:${params.outSum}:${params.invoiceId}:${params.password1}`,
  );
}

export function verifyRobokassaResultSignature(params: {
  outSum: string;
  invoiceId: string;
  signature: string;
}) {
  const { password2 } = getConfig();
  const expected = md5(`${params.outSum}:${params.invoiceId}:${password2}`);
  return expected.toLowerCase() === params.signature.toLowerCase();
}

export function createRobokassaPaymentUrl(params: RobokassaInitParams) {
  const config = getConfig();
  const outSum = toOutSum(params.amountRub);
  const signature = makeRobokassaInitSignature({
    merchantLogin: config.merchantLogin,
    outSum,
    invoiceId: params.invoiceId,
    password1: config.password1,
  });

  const url = new URL("https://auth.robokassa.ru/Merchant/Index.aspx");
  url.searchParams.set("MerchantLogin", config.merchantLogin);
  url.searchParams.set("OutSum", outSum);
  url.searchParams.set("InvId", params.invoiceId);
  url.searchParams.set("Description", params.description);
  url.searchParams.set("SignatureValue", signature);
  url.searchParams.set("SuccessURL", config.successUrl);
  url.searchParams.set("FailURL", config.failUrl);
  url.searchParams.set("ResultURL", config.resultUrl);
  if (params.email) {
    url.searchParams.set("Email", params.email);
  }
  if (config.isTest) {
    url.searchParams.set("IsTest", "1");
  }

  return { paymentUrl: url.toString(), outSum };
}

