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

function maskPhoneInput(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  const normalized = digitsOnly.startsWith("8")
    ? `7${digitsOnly.slice(1)}`
    : digitsOnly;
  const local = normalized.startsWith("7")
    ? normalized.slice(1, 11)
    : normalized.slice(0, 10);

  let result = "+7";

  if (local.length > 0) {
    result += `(${local.slice(0, 3)}`;
  }
  if (local.length >= 3) {
    result += ")";
  }
  if (local.length > 3) {
    result += local.slice(3, 6);
  }
  if (local.length > 6) {
    result += `-${local.slice(6, 8)}`;
  }
  if (local.length > 8) {
    result += `-${local.slice(8, 10)}`;
  }

  return result;
}

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)}₽`;
}

function checkboxClasses() {
  return "h-6 w-6 shrink-0 appearance-none rounded-[6px] border-2 border-[#c9c9c9] bg-transparent transition checked:border-[#2a6a34] checked:bg-[#2a6a34]";
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
      <span className="text-[20px] font-semibold leading-none text-[#131417]">
        {props.label}
        {props.required ? <span className="text-[#bd2d2d]">*</span> : null}
      </span>
      <input
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange(event.target.value)}
        className="h-[56px] border-b border-[rgba(0,0,0,0.38)] bg-transparent px-[10px] text-[38px] font-semibold leading-none text-[#131417] outline-none placeholder:text-[rgba(0,0,0,0.48)] md:text-[22px]"
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
  const day2LeftOptions = day2Options.slice(0, 4);
  const day2RightOptions = day2Options.slice(4, 8);

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
    <div className="mx-auto w-full max-w-[1312px] text-[#131417]">
      <h3 className="font-display text-[30px] font-black uppercase leading-none tracking-tight">
        РЕГИСТРАЦИЯ
      </h3>

      <form
        className="relative mt-8 overflow-hidden rounded-[34px] border border-[#cdcdcd] bg-[#fafafa] px-6 py-10 md:px-[60px] md:py-[40px]"
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
        <section className="relative z-10 grid gap-8">
          <h4 className="text-[28px] font-bold leading-none">
            Укажите данные
          </h4>

          <div className="grid gap-7 md:grid-cols-2 md:gap-x-8 md:gap-y-8">
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
              placeholder="+7(***)***-**-**"
              onChange={(value) =>
                setValues((prev) => ({ ...prev, phone: maskPhoneInput(value) }))
              }
            />
          </div>
        </section>

        <section className="relative z-10 mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="grid gap-12 content-start">
            <h4 className="h-[34px] w-full text-center text-[28px] font-bold leading-[34px]">ALL IN DAY 1</h4>
            <div className="grid w-full grid-rows-4 gap-6">
              {day1Options.map((option) => (
                <label key={option.id} className="grid h-[72px] grid-cols-[250px_84px_24px] items-center gap-x-3">
                  <span className="text-[20px] font-semibold leading-[1.1]">
                    {option.title}
                  </span>
                  <span className="text-right text-[20px] font-semibold leading-none">
                    {formatRub(getOptionDisplayPrice(option) ?? 0)}
                  </span>
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
            <h4 className="h-[34px] text-center text-[28px] font-bold leading-[34px]">ALL IN BATTLE</h4>
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="grid grid-rows-4 gap-6">
                {day2LeftOptions.map((option) => (
                  <label
                    key={option.id}
                    className="grid h-[72px] grid-cols-[184px_24px] items-center gap-x-3"
                  >
                    <div className="grid gap-[10px]">
                      <span className="text-[20px] font-semibold leading-none">
                        {option.title}
                      </span>
                      {option.subtitle ? (
                        <span className="text-[12px] font-semibold leading-none text-[rgba(0,0,0,0.55)]">
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

              <div className="grid grid-rows-4 gap-6">
                {day2RightOptions.map((option) => (
                  <label
                    key={option.id}
                    className="grid h-[72px] grid-cols-[184px_24px] items-center gap-x-3"
                  >
                    <div className="grid gap-[10px]">
                      <span className="text-[20px] font-semibold leading-none">
                      {option.title}
                      </span>
                      {option.subtitle ? (
                        <span className="text-[12px] font-semibold leading-none text-[rgba(0,0,0,0.55)]">
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
            <p className="justify-self-end text-right text-[16px] font-medium leading-[1.2] text-[rgba(0,0,0,0.55)]">
              Первая номинация - 1700₽, каждая следующая - 800₽,
              <br />
              зрительский билет - 600₽
            </p>
          </div>
        </section>

        <div className="relative z-10 mt-10 h-px w-full bg-[#d2d2d2]" />

        <section className="relative z-10 mt-8 grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <p className="text-[24px] font-semibold leading-none">
            Итого: <span className="text-[28px] font-bold text-[#19411f]">{formatRub(totalRub)}</span>
          </p>
          <button
            type="submit"
            disabled={isSubmitting || totalRub <= 0}
            className="h-[56px] min-w-[382px] rounded-full bg-[#2a6a34] px-10 text-[18px] font-semibold leading-none text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#7da57f] disabled:opacity-100"
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
