"use client";

import {
  calculateSelection,
  getOptionDisplayPrice,
  getOptionsByDay,
} from "@/lib/event-options";
import { FormEvent, useMemo, useState } from "react";

type FormValues = {
  fullName: string;
  nickname: string;
  age: string;
  phone: string;
  participationType: "participant" | "spectator";
  selectedOptionIds: string[];
};

const initialForm: FormValues = {
  fullName: "",
  nickname: "",
  age: "",
  phone: "",
  participationType: "participant",
  selectedOptionIds: [],
};

const day1Options = getOptionsByDay("day1");
const day2Options = getOptionsByDay("day2");

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)}₽`;
}

function getDay2PriceHint(optionId: string) {
  if (optionId === "day2-spectator") {
    return "600₽";
  }

  return "";
}

function checkboxClasses() {
  return "size-6 appearance-none rounded-[5px] border-2 border-[#dcdcde] bg-white transition checked:border-[#2a6a34] checked:bg-[#2a6a34]";
}

function Field(props: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-base leading-[1.2] tracking-[-0.32px]">
        {props.label}
        {props.required ? <span className="text-[#bd2d2d]">*</span> : null}
      </span>
      <input
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange(event.target.value)}
        className="h-[37px] border-b border-[rgba(0,0,0,0.6)] bg-transparent px-[10px] text-sm text-[rgba(0,0,0,0.6)] outline-none"
      />
    </label>
  );
}

export function RegistrationForm() {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selection = useMemo(
    () => calculateSelection(values.selectedOptionIds),
    [values.selectedOptionIds],
  );
  const totalRub = selection.totalRub;

  const toggleOption = (optionId: string) => {
    setValues((prev) => {
      const exists = prev.selectedOptionIds.includes(optionId);
      return {
        ...prev,
        selectedOptionIds: exists
          ? prev.selectedOptionIds.filter((id) => id !== optionId)
          : [...prev.selectedOptionIds, optionId],
      };
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const registrationResponse = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          nickname: values.nickname,
          age: values.age,
          phone: values.phone,
          email: "",
          city: "",
          danceExperience: "",
          comment: "",
          participationType: values.participationType,
          selectedOptionIds: values.selectedOptionIds,
        }),
      });

      const registrationPayload = await registrationResponse.json();
      if (!registrationResponse.ok || !registrationPayload?.ok) {
        throw new Error(registrationPayload?.message ?? "Ошибка отправки");
      }

      const registrationId = registrationPayload?.registration?.id;
      if (!registrationId) {
        throw new Error("Не удалось получить id заявки");
      }

      const paymentResponse = await fetch("/api/payments/tbank/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      const paymentPayload = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentPayload?.ok) {
        setSuccessMessage(
          "Заявка сохранена. Проверь настройки оплаты T-Банк в Vercel.",
        );
        setValues(initialForm);
        return;
      }

      if (paymentPayload?.paymentUrl) {
        window.location.href = paymentPayload.paymentUrl as string;
        return;
      }

      setSuccessMessage("Заявка сохранена, но ссылка на оплату не получена.");
      setValues(initialForm);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось отправить форму.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-['Trebuchet_MS','Segoe_UI',sans-serif] text-black">
      <h3 className="text-2xl leading-[1.2] tracking-[-0.48px] lowercase">регистрация</h3>

      <form
        className="relative mt-8 grid gap-8 rounded-3xl border border-[rgba(213,213,213,0.6)] bg-[#fafafa] px-6 py-10 md:px-8"
        onSubmit={onSubmit}
      >
        <section className="grid gap-8">
          <h4 className="text-lg font-bold tracking-[-0.36px]">Укажите данные</h4>
          <div className="grid gap-5">
            <Field
              label="ФИО"
              required
              value={values.fullName}
              placeholder="Иванов Иван Иванович"
              onChange={(value) => setValues((prev) => ({ ...prev, fullName: value }))}
            />
            <Field
              label="Никнейм"
              required
              value={values.nickname}
              placeholder="Baban"
              onChange={(value) => setValues((prev) => ({ ...prev, nickname: value }))}
            />
            <Field
              label="Возраст"
              value={values.age}
              placeholder="14"
              onChange={(value) => setValues((prev) => ({ ...prev, age: value }))}
            />
            <Field
              label="Телефон"
              required
              value={values.phone}
              placeholder="+7 (918) 12-32-123"
              onChange={(value) => setValues((prev) => ({ ...prev, phone: value }))}
            />
          </div>
        </section>

        <section className="grid gap-[60px] lg:grid-cols-2 lg:gap-8">
          <div className="grid gap-12">
            <h4 className="text-lg font-bold tracking-[-0.36px]">ALL IN DAY 1</h4>
            <div className="grid gap-5">
              {day1Options.map((option) => (
                <label key={option.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-base tracking-[-0.32px]">
                    <span className="w-[156px] leading-[1.2]">{option.title}</span>
                    <span className="w-[62px] leading-[1.2]">
                      {formatRub(getOptionDisplayPrice(option) ?? 0)}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={values.selectedOptionIds.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className={checkboxClasses()}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-12">
            <h4 className="text-lg font-bold tracking-[-0.36px]">ALL IN BATTLE</h4>
            <div className="grid gap-8">
              {day2Options.map((option) => (
                <label key={option.id} className="flex items-center justify-between gap-3">
                  <div className="grid gap-1">
                    <span className="text-base leading-[1.2] tracking-[-0.32px]">
                      {option.title}
                    </span>
                    {option.subtitle ? (
                      <span className="text-xs leading-[1.2] tracking-[-0.24px] text-[rgba(0,0,0,0.6)]">
                        {option.subtitle}
                      </span>
                    ) : null}
                  </div>
                  <input
                    type="checkbox"
                    checked={values.selectedOptionIds.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className={checkboxClasses()}
                  />
                </label>
              ))}
            </div>
          </div>
        </section>

        <p className="text-sm leading-[1.2] tracking-[-0.28px] text-[rgba(0,0,0,0.6)]">
          Первая номинация - 1700₽
          <br />
          каждая следующая - 800₽
          <br />
          зрительский билет - {getDay2PriceHint("day2-spectator")}
        </p>

        <div className="h-px w-full bg-[#d9d9d9]" />

        <section className="grid gap-5">
          <p className="text-xl font-semibold tracking-[-0.36px]">
            Итого: <span className="font-bold text-[#19411f]">{formatRub(totalRub)}</span>
          </p>
          <button
            type="submit"
            disabled={isSubmitting || totalRub <= 0}
            className="h-10 rounded-[100px] bg-[#2a6a34] px-6 text-sm tracking-[-0.26px] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Отправка..." : "Перейти к оплате"}
          </button>
        </section>

        {errorMessage ? (
          <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}
