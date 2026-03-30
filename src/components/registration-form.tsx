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
  phone: string;
  email: string;
  city: string;
  danceExperience: string;
  participationType: "participant" | "spectator";
  comment: string;
  selectedOptionIds: string[];
};

const initialForm: FormValues = {
  fullName: "",
  nickname: "",
  phone: "",
  email: "",
  city: "",
  danceExperience: "",
  participationType: "participant",
  comment: "",
  selectedOptionIds: [],
};

const day1Options = getOptionsByDay("day1");
const day2Options = getOptionsByDay("day2");

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function getOptionPriceHint(optionId: string) {
  if (optionId === "day2-spectator") {
    return "600 ₽";
  }

  if (optionId.startsWith("day2-")) {
    return "1-й: 1700 ₽, далее: 800 ₽";
  }

  return null;
}

export function RegistrationForm() {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedTotalRub = useMemo(() => {
    return calculateSelection(values.selectedOptionIds).totalRub;
  }, [values.selectedOptionIds]);

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
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message ?? "Ошибка отправки");
      }

      const registrationId = payload?.registration?.id;
      if (!registrationId) {
        throw new Error("Заявка создана, но id не получен");
      }

      const paymentResponse = await fetch("/api/payments/tbank/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      const paymentPayload = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentPayload?.ok) {
        setSuccessMessage(
          "Заявка сохранена. Оплата пока недоступна, проверь настройки T-Банк в Vercel.",
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
        error instanceof Error
          ? error.message
          : "Не удалось отправить форму. Попробуй еще раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-6 text-zinc-900" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
          ФИО *
          <input
            required
            value={values.fullName}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, fullName: event.target.value }))
            }
            className="h-12 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
            placeholder="Имя Фамилия"
          />
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
          Никнейм *
          <input
            required
            value={values.nickname}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, nickname: event.target.value }))
            }
            className="h-12 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
            placeholder="@nickname"
          />
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
          Телефон *
          <input
            required
            value={values.phone}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, phone: event.target.value }))
            }
            className="h-12 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
            placeholder="+7 ..."
          />
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
          Email
          <input
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            className="h-12 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
            placeholder="name@email.com"
          />
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
          Город
          <input
            value={values.city}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, city: event.target.value }))
            }
            className="h-12 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
            placeholder="Краснодар"
          />
        </label>

        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
          Формат участия
          <select
            value={values.participationType}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                participationType: event.target.value as FormValues["participationType"],
              }))
            }
            className="h-12 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
          >
            <option value="participant">Участник</option>
            <option value="spectator">Зритель</option>
          </select>
        </label>
      </div>

      <fieldset className="grid gap-2 rounded-2xl bg-zinc-200/80 p-5">
        <legend className="px-1 text-sm font-semibold text-zinc-800">1 день</legend>
        {day1Options.map((option) => (
          <label
            key={option.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-100/80"
          >
            <span className="text-sm font-medium">{option.title}</span>
            <span className="text-sm font-semibold text-zinc-700">
              {formatRub(getOptionDisplayPrice(option) ?? 0)}
            </span>
            <input
              type="checkbox"
              checked={values.selectedOptionIds.includes(option.id)}
              onChange={() => toggleOption(option.id)}
              className="h-8 w-8 appearance-none rounded-lg border-2 border-zinc-300 bg-zinc-100 transition checked:border-zinc-900 checked:bg-zinc-900 checked:bg-[linear-gradient(135deg,#111,#333)]"
            />
          </label>
        ))}
      </fieldset>

      <fieldset className="grid gap-5 rounded-2xl bg-zinc-200/80 p-5">
        <legend className="px-1 text-sm font-semibold text-zinc-800">2 день</legend>
        <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          {day2Options.map((option) => (
            <label
              key={option.id}
              className="grid min-h-[86px] grid-cols-[1fr_auto] items-start gap-3"
            >
              <span className="grid gap-1">
                <span className="text-[1.8rem] leading-none md:text-[2.1rem]">{option.title}</span>
                {option.subtitle ? (
                  <span className="text-[15px] leading-tight text-zinc-600">{option.subtitle}</span>
                ) : null}
              </span>
              <span className="grid justify-items-end gap-2">
                <input
                  type="checkbox"
                  checked={values.selectedOptionIds.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className="h-8 w-8 appearance-none rounded-lg border-2 border-zinc-300 bg-zinc-100 transition checked:border-zinc-900 checked:bg-zinc-900 checked:bg-[linear-gradient(135deg,#111,#333)]"
                />
                <span className="text-right text-[11px] text-zinc-500">
                  {getOptionPriceHint(option.id)}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="rounded-xl bg-zinc-900 px-4 py-3 text-base font-semibold text-white">
        Итого: {formatRub(selectedTotalRub)}
      </p>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
        Опыт в танцах
        <input
          value={values.danceExperience}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, danceExperience: event.target.value }))
          }
          className="h-12 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
          placeholder="например: 3 года"
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
        Комментарий
        <textarea
          rows={4}
          value={values.comment}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, comment: event.target.value }))
          }
          className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
          placeholder="Дополнительная информация"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-12 rounded-xl bg-zinc-900 px-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isSubmitting ? "Отправка..." : "Перейти к оплате"}
      </button>

      {errorMessage ? (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}
    </form>
  );
}
