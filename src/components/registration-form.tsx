"use client";

import {
  calculateSelection,
  getOptionDisplayPrice,
  getOptionsByDay,
} from "@/lib/event-options";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type FormValues = {
  fullName: string;
  nickname: string;
  age: string;
  phone: string;
  participationType: "participant" | "spectator";
  selectedOptionIds: string[];
};

type RequiredFieldKey = "fullName" | "nickname" | "phone";

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
const day2DisplayOrder = [
  "day2-baby",
  "day2-kids-beg",
  "day2-kids-pro",
  "day2-jun-beg",
  "day2-jun-pro",
  "day2-beg-16-plus",
  "day2-pro-16-plus",
  "day2-spectator",
] as const;

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
  return "checkbox-mark h-6 w-6 shrink-0 appearance-none rounded-[6px]";
}

function Field(props: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  inputId?: string;
  hasError?: boolean;
}) {
  return (
    <label className="grid gap-2 md:gap-3">
      <span
        className={`text-[16px] font-semibold leading-none md:text-[20px] ${
          props.hasError ? "text-[#bd2d2d]" : "text-[#131417]"
        }`}
      >
        {props.label}
        {props.required ? <span className="text-[#bd2d2d]">*</span> : null}
      </span>
      <input
        id={props.inputId}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange(event.target.value)}
        onFocus={props.onFocus}
        className={`h-[44px] bg-transparent px-[6px] text-[18px] font-semibold leading-none text-[#131417] outline-none placeholder:text-[rgba(0,0,0,0.48)] md:h-[56px] md:px-[10px] md:text-[22px] ${
          props.hasError
            ? "border-b-2 border-[#bd2d2d]"
            : "border-b border-[rgba(0,0,0,0.38)]"
        }`}
      />
    </label>
  );
}

export function RegistrationForm() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<FormValues>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requiredFieldErrors, setRequiredFieldErrors] = useState<
    Record<RequiredFieldKey, boolean>
  >({
    fullName: false,
    nickname: false,
    phone: false,
  });

  const selection = useMemo(
    () => calculateSelection(values.selectedOptionIds),
    [values.selectedOptionIds],
  );
  const totalRub = selection.totalRub;
  const orderedDay2Options = day2DisplayOrder
    .map((id) => day2Options.find((option) => option.id === id))
    .filter((option): option is (typeof day2Options)[number] => Boolean(option));
  const day2LeftOptions = orderedDay2Options.slice(0, 4);
  const day2RightOptions = orderedDay2Options.slice(4, 8);
  const registerPreset = searchParams.get("register");
  const focusPreset = searchParams.get("focus");

  useEffect(() => {
    const shouldFocus = registerPreset !== null || focusPreset === "fullName";

    if (registerPreset !== null) {
      const isSupported = day1Options.some((option) => option.id === registerPreset);
      setValues((prev) => ({
        ...prev,
        selectedOptionIds: isSupported ? [registerPreset] : [],
      }));
    }

    if (shouldFocus) {
      requestAnimationFrame(() => {
        const input = document.getElementById("registration-full-name");
        if (input instanceof HTMLInputElement) {
          try {
            input.focus({ preventScroll: true });
          } catch {
            input.focus();
          }
        }
      });
    }
  }, [registerPreset, focusPreset]);

  useEffect(() => {
    const handleProgramPreset = (event: Event) => {
      const customEvent = event as CustomEvent<{
        presetId?: string | null;
        clearSelection?: boolean;
      }>;
      const presetId = customEvent.detail?.presetId ?? null;
      const clearSelection = Boolean(customEvent.detail?.clearSelection);

      const isSupportedPreset = presetId
        ? day1Options.some((option) => option.id === presetId)
        : false;

      setValues((prev) => ({
        ...prev,
        selectedOptionIds: isSupportedPreset
          ? [presetId as string]
          : clearSelection
            ? []
            : prev.selectedOptionIds,
      }));

      requestAnimationFrame(() => {
        const input = document.getElementById("registration-full-name");
        if (input instanceof HTMLInputElement) {
          try {
            input.focus({ preventScroll: true });
          } catch {
            input.focus();
          }
        }
      });
    };

    window.addEventListener("program-registration-preset", handleProgramPreset as EventListener);

    return () => {
      window.removeEventListener(
        "program-registration-preset",
        handleProgramPreset as EventListener,
      );
    };
  }, []);

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

  const clearRequiredFieldError = (field: RequiredFieldKey) => {
    setRequiredFieldErrors((prev) => ({ ...prev, [field]: false }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const nextRequiredErrors: Record<RequiredFieldKey, boolean> = {
      fullName: values.fullName.trim().length === 0,
      nickname: values.nickname.trim().length === 0,
      phone: values.phone.replace(/\D/g, "").length < 11,
    };
    setRequiredFieldErrors(nextRequiredErrors);

    if (Object.values(nextRequiredErrors).some(Boolean)) {
      setErrorMessage("Заполните обязательные поля, выделенные красным.");
      return;
    }

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

      const paymentResponse = await fetch("/api/payments/robokassa/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      const paymentPayload = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentPayload?.ok) {
        setSuccessMessage("Заявка сохранена. Проверь настройки оплаты Robokassa в Vercel.");
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
        className="relative mt-6 overflow-hidden rounded-[30px] border border-[#cdcdcd] bg-[#fafafa] px-5 py-8 md:mt-8 md:rounded-[34px] md:px-[60px] md:py-[40px]"
        onSubmit={onSubmit}
      >
        <Image
          src="/decor/flower-side-left.png"
          alt=""
          width={130}
          height={130}
          className="pointer-events-none absolute -left-1 top-[240px] w-[84px] opacity-80 md:-left-2 md:top-[230px] md:w-[122px]"
        />
        <Image
          src="/decor/flower-side-right.png"
          alt=""
          width={130}
          height={130}
          className="pointer-events-none absolute right-0 top-0 w-[90px] opacity-80 md:w-[122px]"
        />
        <section className="relative z-10 grid gap-8">
          <h4 className="text-[24px] font-bold leading-none md:text-[28px]">
            Укажите данные
          </h4>

          <div className="grid gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-8">
            <Field
              label="ФИО"
              required
              value={values.fullName}
              placeholder="Иванов Иван Иванович"
              inputId="registration-full-name"
              onChange={(value) => setValues((prev) => ({ ...prev, fullName: value }))}
              onFocus={() => clearRequiredFieldError("fullName")}
              hasError={requiredFieldErrors.fullName}
            />
            <Field
              label="Никнейм"
              required
              value={values.nickname}
              placeholder="Baban"
              onChange={(value) => setValues((prev) => ({ ...prev, nickname: value }))}
              onFocus={() => clearRequiredFieldError("nickname")}
              hasError={requiredFieldErrors.nickname}
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
              onFocus={() => clearRequiredFieldError("phone")}
              hasError={requiredFieldErrors.phone}
            />
          </div>
        </section>

        <section className="relative z-10 mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="grid content-start gap-8">
            <h4 className="w-full text-center text-[38px] font-bold leading-none md:h-[34px] md:text-[28px] md:leading-[34px]">
              ALL IN DAY 1
            </h4>
            <div className="mx-auto grid w-full max-w-[320px] gap-6 md:max-w-none">
              {day1Options.map((option) => (
                <label
                  key={option.id}
                  className="grid min-h-[56px] grid-cols-[minmax(0,1fr)_72px_24px] items-center gap-x-3 md:h-[72px] md:grid-cols-[250px_84px_24px]"
                >
                  <span className="min-w-0 text-[16px] font-semibold leading-[1.15] md:text-[20px]">
                    {option.title}
                  </span>
                  <span className="text-right text-[16px] font-semibold leading-none md:text-[20px]">
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

          <div className="grid gap-8 md:gap-12">
            <h4 className="w-full text-center text-[38px] font-bold leading-none md:h-[34px] md:text-[28px] md:leading-[34px]">
              ALL IN BATTLE
            </h4>

            <div className="mx-auto grid w-full max-w-[320px] gap-6 md:hidden">
              {orderedDay2Options.map((option) => (
                <label
                  key={option.id}
                  className="grid min-h-[56px] grid-cols-[minmax(0,1fr)_24px] items-center gap-x-3"
                >
                  <div className="grid gap-[8px]">
                    <span className="text-[16px] font-semibold leading-none">{option.title}</span>
                    {option.subtitle ? (
                      <span className="text-[11px] font-semibold leading-none text-[rgba(0,0,0,0.55)]">
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

            <div className="hidden gap-x-8 gap-y-6 md:grid md:grid-cols-2">
              <div className="grid grid-rows-4 gap-6">
                {day2LeftOptions.map((option) => (
                  <label
                    key={option.id}
                    className="grid h-[72px] grid-cols-[184px_24px] items-center gap-x-3"
                  >
                    <div className="grid gap-[10px]">
                      <span className="text-[20px] font-semibold leading-none">{option.title}</span>
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
                      <span className="text-[20px] font-semibold leading-none">{option.title}</span>
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

            <p className="mx-auto w-full max-w-[320px] text-right text-[12px] font-medium leading-[1.2] text-[rgba(0,0,0,0.55)] md:justify-self-end md:max-w-none md:text-[16px]">
              Первая номинация - 1700₽, каждая следующая - 800₽,
              <br />
              зрительский билет - 700₽
            </p>
          </div>
        </section>

        <div className="relative z-10 mt-10 h-px w-full bg-[#d2d2d2]" />

        <section className="relative z-10 mt-8 grid items-center gap-4 md:gap-6 lg:grid-cols-[1fr_auto]">
          <p className="text-[18px] font-semibold leading-none md:text-[24px]">
            Итого:{" "}
            <span className="text-[22px] font-bold text-[#19411f] md:text-[28px]">
              {formatRub(totalRub)}
            </span>
          </p>
          <button
            type="submit"
            disabled={isSubmitting || totalRub <= 0}
            className="h-[46px] w-full rounded-full bg-[#2a6a34] px-8 text-[14px] font-semibold leading-none text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#7da57f] disabled:opacity-100 md:h-[56px] md:min-w-[382px] md:w-auto md:px-10 md:text-[18px]"
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

