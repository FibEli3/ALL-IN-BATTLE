"use client";

import { MANUAL_PAYMENT_DRAFT_KEY, type PaymentDraft } from "@/lib/payment-draft";
import { calculateSelection, EVENT_OPTIONS } from "@/lib/event-options";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const MAX_RECEIPT_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_FILE_BYTES = 2.5 * 1024 * 1024;
const MAX_RECEIPT_IMAGE_EDGE = 2200;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return reject(new Error("Не удалось прочитать файл"));
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Не удалось обработать изображение. Попробуйте сделать скриншот чека и загрузить его."));
    };
    image.src = objectUrl;
  });
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Не удалось подготовить изображение к отправке")),
      "image/jpeg",
      quality,
    );
  });
}

async function prepareReceiptForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= MAX_REQUEST_FILE_BYTES) return file;

  const image = await loadImage(file);
  const initialScale = Math.min(1, MAX_RECEIPT_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  let width = Math.max(1, Math.round(image.naturalWidth * initialScale));
  let height = Math.max(1, Math.round(image.naturalHeight * initialScale));
  let lastBlob: Blob | null = null;

  for (let resizePass = 0; resizePass < 4; resizePass += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Браузер не смог подготовить изображение к отправке");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    for (const quality of [0.86, 0.74, 0.62, 0.5]) {
      lastBlob = await canvasToJpeg(canvas, quality);
      if (lastBlob.size <= MAX_REQUEST_FILE_BYTES) {
        const safeName = file.name.replace(/\.[^.]+$/, "") || "receipt";
        return new File([lastBlob], `${safeName}.jpg`, { type: "image/jpeg" });
      }
    }

    width = Math.max(1, Math.round(width * 0.8));
    height = Math.max(1, Math.round(height * 0.8));
  }

  if (!lastBlob || lastBlob.size > MAX_REQUEST_FILE_BYTES) {
    throw new Error("Не удалось уменьшить изображение. Сделайте скриншот чека и загрузите его снова.");
  }

  const safeName = file.name.replace(/\.[^.]+$/, "") || "receipt";
  return new File([lastBlob], `${safeName}.jpg`, { type: "image/jpeg" });
}

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

export default function ManualPaymentPage() {
  const router = useRouter();
  const cardNumber = "5469 3003 0678 7307";
  const [draft, setDraft] = useState<PaymentDraft | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(MANUAL_PAYMENT_DRAFT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PaymentDraft;
      if (parsed.fullName && Array.isArray(parsed.selectedOptionIds)) setDraft(parsed);
    } catch { setDraft(null); }
  }, []);

  const selection = useMemo(() => calculateSelection(draft?.selectedOptionIds ?? []), [draft?.selectedOptionIds]);
  const selectedTitles = useMemo(
    () => draft?.selectedOptionIds.map((id) => EVENT_OPTIONS.find((option) => option.id === id)?.title ?? id) ?? [],
    [draft],
  );

  const selectReceipt = (file: File | null) => {
    setErrorMessage("");
    if (file && file.size > MAX_RECEIPT_SOURCE_BYTES) {
      setReceiptFile(null);
      setErrorMessage("Файл больше 10 МБ. Выберите изображение или PDF меньшего размера.");
      return;
    }
    if (file && file.type === "application/pdf" && file.size > MAX_REQUEST_FILE_BYTES) {
      setReceiptFile(null);
      setErrorMessage("PDF больше 2,5 МБ. Уменьшите файл или загрузите скриншот чека.");
      return;
    }
    setReceiptFile(file);
  };

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(cardNumber.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch { setErrorMessage("Не удалось скопировать номер карты."); }
  };

  const submitRegistration = async () => {
    if (!draft || !receiptFile || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const preparedReceipt = await prepareReceiptForUpload(receiptFile);
      const response = await fetch("/api/registrations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          receiptFileName: preparedReceipt.name,
          receiptFileMimeType: preparedReceipt.type || "application/octet-stream",
          receiptFileBase64: await fileToBase64(preparedReceipt),
        }),
      });
      const responseText = await response.text();
      let payload: { ok?: boolean; message?: string } | null = null;
      try {
        payload = responseText ? JSON.parse(responseText) as { ok?: boolean; message?: string } : null;
      } catch {
        payload = null;
      }

      if (!response.ok || !payload?.ok) {
        if (response.status === 413 || /request entity too large/i.test(responseText)) {
          throw new Error("Файл не удалось отправить из-за его размера. Загрузите скриншот чека или файл меньшего размера.");
        }
        throw new Error(payload?.message ?? "Не удалось отправить заявку. Попробуйте ещё раз.");
      }
      sessionStorage.removeItem(MANUAL_PAYMENT_DRAFT_KEY);
      router.replace("/payment/success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось отправить регистрацию");
      setIsSubmitting(false);
    }
  };

  if (!draft) {
    return (
      <main className="payment-empty">
        <Image src="/event/logo.png" alt="ALL IN BATTLE" width={1920} height={1920} />
        <p>Данные формы не найдены.</p>
        <h1>Вернитесь к регистрации и заполните её заново.</h1>
        <Link href="/#registration">Вернуться к регистрации ↙</Link>
      </main>
    );
  }

  return (
    <main className="payment-page">
      <header className="payment-header">
        <Link href="/" aria-label="На главную"><Image src="/event/logo.png" alt="" width={1920} height={1920} /></Link>
        <Link href="/#registration">← Изменить выбор</Link>
      </header>

      <div className="payment-title">
        <p>Шаг 2 из 2</p>
        <h1>Оплата<br />и чек</h1>
      </div>

      <div className="payment-layout">
        <section className="payment-details">
          <p className="payment-label">Перевод на карту Сбербанка</p>
          <button type="button" className="card-number" onClick={copyCard}>
            <span>{cardNumber}</span><small>{copied ? "Скопировано" : "Копировать"}</small>
          </button>
          <div className="payment-total"><span>Сумма</span><strong>{formatRub(selection.totalRub)}</strong></div>
          <div className="payment-selection">
            <span>Ваш выбор</span>
            <ul>{selectedTitles.map((title) => <li key={title}>{title}</li>)}</ul>
          </div>
        </section>

        <section className="receipt-section">
          <p className="payment-label">Прикрепите чек после перевода</p>
          <label
            className={`receipt-dropzone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => { event.preventDefault(); setIsDragging(false); selectReceipt(event.dataTransfer.files?.[0] ?? null); }}
          >
            <input type="file" accept="image/*,.pdf,.heic,.HEIC" onChange={(event) => selectReceipt(event.target.files?.[0] ?? null)} />
            <span>{receiptFile ? receiptFile.name : "Нажмите или перетащите сюда изображение / PDF"}</span>
            <small>Изображения до 10 МБ · PDF до 2,5 МБ</small>
          </label>
          {errorMessage ? <p className="form-error" role="alert">{errorMessage}</p> : null}
          <button type="button" className="submit-button payment-submit" disabled={!receiptFile || isSubmitting} onClick={submitRegistration}>
            {isSubmitting ? "Отправляем…" : "Отправить заявку"}
          </button>
        </section>
      </div>
    </main>
  );
}
