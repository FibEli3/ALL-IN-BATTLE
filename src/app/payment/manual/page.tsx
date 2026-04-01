"use client";

import { MANUAL_PAYMENT_DRAFT_KEY, type PaymentDraft } from "@/lib/payment-draft";
import { calculateSelection, EVENT_OPTIONS } from "@/lib/event-options";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Не удалось прочитать файл"));
        return;
      }
      const [, base64 = ""] = result.split(",");
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)}₽`;
}

export default function ManualPaymentPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<PaymentDraft | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(MANUAL_PAYMENT_DRAFT_KEY);
    if (!raw) {
      setDraft(null);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as PaymentDraft;
      if (!parsed?.fullName || !Array.isArray(parsed.selectedOptionIds)) {
        setDraft(null);
        return;
      }
      setDraft(parsed);
    } catch {
      setDraft(null);
    }
  }, []);

  const selection = useMemo(
    () => calculateSelection(draft?.selectedOptionIds ?? []),
    [draft?.selectedOptionIds],
  );

  const selectedTitles = useMemo(() => {
    if (!draft) {
      return [];
    }

    return draft.selectedOptionIds.map(
      (id) => EVENT_OPTIONS.find((option) => option.id === id)?.title ?? id,
    );
  }, [draft]);

  const submitRegistration = async () => {
    if (!draft || !receiptFile || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const base64 = await fileToBase64(receiptFile);

      const response = await fetch("/api/registrations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          receiptFileName: receiptFile.name,
          receiptFileMimeType: receiptFile.type || "application/octet-stream",
          receiptFileBase64: base64,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message ?? "Не удалось отправить регистрацию");
      }

      sessionStorage.removeItem(MANUAL_PAYMENT_DRAFT_KEY);
      router.replace("/payment/success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось отправить регистрацию",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!draft) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[820px] flex-col items-center justify-center px-5 py-12 text-center md:px-8">
        <h1 className="font-display text-[44px] font-black uppercase tracking-tight md:text-[72px]">
          Оплата
        </h1>
        <p className="mt-4 text-[20px] font-medium md:text-[26px]">
          Данные формы не найдены. Вернитесь к регистрации и заполните форму заново.
        </p>
        <Link
          href="/#registration"
          className="mt-8 rounded-full bg-[#2a6a34] px-7 py-3 text-[16px] font-semibold text-white transition hover:bg-[#21562a]"
        >
          Вернуться к регистрации
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[980px] px-5 py-10 text-[#151515] md:px-8 md:py-14">
      <h1 className="font-display text-[44px] font-black uppercase leading-none tracking-tight text-[#174b24] md:text-[74px]">
        Оплата
      </h1>

      <section className="relative mt-6 overflow-hidden rounded-[30px] border border-[#cdcdcd] bg-[#fafafa] px-5 py-8 md:mt-8 md:px-10 md:py-10">
        <Image
          src="/decor/flower-side-left.png"
          alt=""
          width={120}
          height={120}
          className="pointer-events-none absolute -bottom-2 -left-2 w-[86px] opacity-80 md:w-[116px]"
        />
        <Image
          src="/decor/flower-side-right.png"
          alt=""
          width={120}
          height={120}
          className="pointer-events-none absolute right-0 top-0 w-[86px] opacity-80 md:w-[116px]"
        />

        <div className="relative z-10">
          <div className="rounded-2xl border border-[#d8d8d8] bg-white/65 p-4 md:p-6">
            <p className="text-[18px] font-semibold md:text-[24px]">Сбербанк:</p>
            <p className="mt-3 text-[24px] font-bold tracking-[0.02em] md:text-[36px]">
              4276 3000 6626 9609
            </p>
            <p className="mt-2 text-[16px] font-medium md:text-[22px]">
              89186765222, Эдуард М.
            </p>
            <p className="mt-4 text-[16px] font-semibold text-[#174b24] md:text-[22px]">
              Сумма к оплате: {formatRub(selection.totalRub)}
            </p>
          </div>

          <p className="mt-7 text-[15px] font-semibold leading-[1.25] md:text-[20px]">
            После перевода прикрепите чек об успешной операции ниже
          </p>

          <label
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const file = event.dataTransfer.files?.[0] ?? null;
              setReceiptFile(file);
            }}
            className={`mt-4 flex min-h-[150px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition ${
              isDragging ? "border-[#2a6a34] bg-[#edf6ef]" : "border-[#c9c9c9] bg-white"
            }`}
          >
            <input
              type="file"
              accept="image/*,.pdf,.heic,.HEIC"
              className="hidden"
              onChange={(event) => setReceiptFile(event.target.files?.[0] ?? null)}
            />
            <span className="text-[14px] font-medium text-[#545454] md:text-[18px]">
              {receiptFile
                ? `Файл: ${receiptFile.name}`
                : "Перетащите чек сюда или нажмите, чтобы выбрать файл с телефона/ПК"}
            </span>
          </label>

          {selectedTitles.length > 0 ? (
            <div className="mt-4 rounded-xl border border-[#d9d9d9] bg-white/70 p-3 md:p-4">
              <p className="text-[14px] font-semibold text-[#383838] md:text-[16px]">
                Выбранные номинации:
              </p>
              <p className="mt-2 text-[13px] leading-[1.25] text-[#4f4f4f] md:text-[15px]">
                {selectedTitles.join(", ")}
              </p>
            </div>
          ) : null}

          {errorMessage ? (
            <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700 md:text-[15px]">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="button"
            disabled={!receiptFile || isSubmitting}
            onClick={submitRegistration}
            className="mt-6 h-[50px] w-full rounded-full bg-[#2a6a34] px-8 text-[15px] font-semibold leading-none text-white transition hover:bg-[#21562a] disabled:cursor-not-allowed disabled:bg-[#8ead93]"
          >
            {isSubmitting ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </section>
    </main>
  );
}

