export const MANUAL_PAYMENT_DRAFT_KEY = "all-in-battle-manual-payment-draft";

export type PaymentDraft = {
  fullName: string;
  nickname: string;
  age: string;
  phone: string;
  participationType: "participant" | "spectator";
  selectedOptionIds: string[];
};

