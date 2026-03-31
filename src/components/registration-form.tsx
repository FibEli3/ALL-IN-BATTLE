"use client";

import {
  calculateSelection,
  getOptionDisplayPrice,
  getOptionsByDay,
} from "@/lib/event-options";
import Image from "next/image";
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

function checkboxClasses() {
  return "h-8 w-8 shrink-0 appearance-none rounded-[8px] border-2 border-[#d3d3d3] bg-transparent transition checked:border-[#2a6a34] checked:bg-[#2a6a34]";
}

function Field(props: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-3">
      <span className="text-[44px] font-semibold leading-none tracking-[-0.02em] text-[#131417] md:text-[22px]">
        {props.label}
        {props.required ? <span className="text-[#bd2d2d]">*</span> : null}
      </span>
      <input
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange(event.target.value)}
        className="h-[62px] border-b border-[rgba(0,0,0,0.38)] bg-transparent px-[12px] text-[40px] font-medium leading-none text-[rgba(0,0,0,0.58)] outline-none placeholder:text-[rgba(0,0,0,0.48)] md:h-[56px] md:text-[38px] lg:text-[22px]"
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
        setSuccessMessage("Заявка сохранена. Проверь настройки оплаты T-Банк в Vercel.");
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
    <div className="w-full text-[#131417]">
      <h3 className="font-display text-[64px] font-black uppercase leading-none tracking-tight md:text-[72px]">
        РЕГИСТРАЦИЯ
      </h3>

      <form
        className="relative mt-8 overflow-hidden rounded-[34px] border border-[#d7d7d7] bg-[#f1f1f1] px-6 py-10 md:px-14 md:py-12"
        onSubmit={onSubmit}
      >
        <Image
          src="/decor/flower-side-left.png"
          alt=""
          width={130}
          height={130}
          className="pointer-events-none absolute -left-2 top-[230px] w-[110px] opacity-80 md:w-[122px]"
        />
        <Image
          src="/decor/flower-side-right.png"
          alt=""
          width={130}
          height={130}
          className="pointer-events-none absolute right-0 top-0 w-[122px] opacity-80"
        />
        <Image
          src="/decor/flower-side-left.png"
          alt=""
          width={168}
          height={168}
          className="pointer-events-none absolute bottom-[-58px] left-1/2 w-[168px] -translate-x-1/2 opacity-80"
        />

        <section className="relative z-10 grid gap-8">
          <h4 className="text-[56px] font-semibold leading-none md:text-[52px] lg:text-[48px]">
            Укажите данные
          </h4>

          <div className="grid gap-7 md:grid-cols-2 md:gap-x-8 md:gap-y-9">
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

        <section className="relative z-10 mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="grid gap-8">
            <h4 className="text-[54px] font-bold leading-none md:text-[50px] lg:text-[46px]">ALL IN DAY 1</h4>
            <div className="grid gap-5">
              {day1Options.map((option) => (
                <label key={option.id} className="flex items-center justify-between gap-4">
                  <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
                    <span className="text-[42px] font-medium leading-[1.04] md:text-[36px] lg:text-[40px]">
                      {option.title}
                    </span>
                    <span className="text-[42px] font-medium leading-none md:text-[36px] lg:text-[40px]">
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

          <div className="grid gap-8">
            <h4 className="text-[54px] font-bold leading-none md:text-[50px] lg:text-[46px]">ALL IN BATTLE</h4>
            <div className="grid gap-7">
              {day2Options.map((option) => (
                <label
                  key={option.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5"
                >
                  <div className="grid gap-2">
                    <span className="text-[42px] font-semibold leading-[1.02] md:text-[34px] lg:text-[40px]">
                      {option.title}
                    </span>
                    {option.subtitle ? (
                      <span className="text-[30px] leading-[1.08] text-[rgba(0,0,0,0.55)] md:text-[26px] lg:text-[30px]">
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
            <p className="justify-self-end text-right text-[30px] leading-[1.1] text-[rgba(0,0,0,0.55)] md:text-[24px] lg:text-[36px]">
              Первая номинация - 1700₽, каждая следующая - 800₽,
              <br />
              зрительский билет - 600₽
            </p>
          </div>
        </section>

        <div className="relative z-10 mt-10 h-px w-full bg-[#d2d2d2]" />

        <section className="relative z-10 mt-8 grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <p className="text-[52px] font-semibold leading-none md:text-[44px] lg:text-[46px]">
            Итого: <span className="font-bold text-[#19411f]">{formatRub(totalRub)}</span>
          </p>
          <button
            type="submit"
            disabled={isSubmitting || totalRub <= 0}
            className="h-[78px] min-w-[392px] rounded-full bg-[#7da57f] px-10 text-[40px] font-medium leading-none text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 md:h-[70px] md:min-w-[382px] md:text-[34px] lg:text-[36px]"
          >
            {isSubmitting ? "Отправка..." : "Перейти к оплате"}
          </button>
        </section>

        {errorMessage ? (
          <p className="relative z-10 mt-6 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="relative z-10 mt-6 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}
