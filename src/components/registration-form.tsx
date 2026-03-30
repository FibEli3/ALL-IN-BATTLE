"use client";

import { EVENT_OPTIONS, getOptionsByDay } from "@/lib/event-options";
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

export function RegistrationForm() {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedTotalRub = useMemo(() => {
    const selectedSet = new Set(values.selectedOptionIds);
    return EVENT_OPTIONS.filter((option) => selectedSet.has(option.id)).reduce(
      (sum, option) => sum + option.priceRub,
      0,
    );
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
          : "Не удалось отправить форму. Попробуй ещё раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm">
        ФИО *
        <input
          required
          value={values.fullName}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, fullName: event.target.value }))
          }
          className="rounded-xl border border-stone-500/40 bg-black/10 px-4 py-3 outline-none transition focus:border-amber-300"
          placeholder="Имя Фамилия"
        />
      </label>

      <label className="grid gap-2 text-sm">
        Никнейм *
        <input
          required
          value={values.nickname}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, nickname: event.target.value }))
          }
          className="rounded-xl border border-stone-500/40 bg-black/10 px-4 py-3 outline-none transition focus:border-amber-300"
          placeholder="@nickname"
        />
      </label>

      <label className="grid gap-2 text-sm">
        Телефон *
        <input
          required
          value={values.phone}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, phone: event.target.value }))
          }
          className="rounded-xl border border-stone-500/40 bg-black/10 px-4 py-3 outline-none transition focus:border-amber-300"
          placeholder="+7 ..."
        />
      </label>

      <label className="grid gap-2 text-sm">
        Email
        <input
          type="email"
          value={values.email}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
          className="rounded-xl border border-stone-500/40 bg-black/10 px-4 py-3 outline-none transition focus:border-amber-300"
          placeholder="name@email.com"
        />
      </label>

      <label className="grid gap-2 text-sm">
        Город
        <input
          value={values.city}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, city: event.target.value }))
          }
          className="rounded-xl border border-stone-500/40 bg-black/10 px-4 py-3 outline-none transition focus:border-amber-300"
          placeholder="Краснодар"
        />
      </label>

      <label className="grid gap-2 text-sm">
        Формат участия
        <select
          value={values.participationType}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              participationType: event.target.value as FormValues["participationType"],
            }))
          }
          className="rounded-xl border border-stone-500/40 bg-black/10 px-4 py-3 outline-none transition focus:border-amber-300"
        >
          <option value="participant">Участник</option>
          <option value="spectator">Зритель</option>
        </select>
      </label>

      <fieldset className="grid gap-3 rounded-xl border border-stone-500/40 p-4">
        <legend className="px-1 text-sm font-semibold">1 день</legend>
        {day1Options.map((option) => (
          <label key={option.id} className="flex items-center justify-between gap-3">
            <span className="text-sm">{option.title}</span>
            <span className="flex items-center gap-3">
              <span className="text-sm text-amber-200">{formatRub(option.priceRub)}</span>
              <input
                type="checkbox"
                checked={values.selectedOptionIds.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="h-4 w-4 accent-amber-300"
              />
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="grid gap-3 rounded-xl border border-stone-500/40 p-4">
        <legend className="px-1 text-sm font-semibold">2 день</legend>
        {day2Options.map((option) => (
          <label key={option.id} className="flex items-center justify-between gap-3">
            <span className="text-sm">{option.title}</span>
            <span className="flex items-center gap-3">
              <span className="text-sm text-amber-200">{formatRub(option.priceRub)}</span>
              <input
                type="checkbox"
                checked={values.selectedOptionIds.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="h-4 w-4 accent-amber-300"
              />
            </span>
          </label>
        ))}
      </fieldset>

      <p className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm">
        Итого: <strong>{formatRub(selectedTotalRub)}</strong>
      </p>

      <label className="grid gap-2 text-sm">
        Опыт в танцах
        <input
          value={values.danceExperience}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, danceExperience: event.target.value }))
          }
          className="rounded-xl border border-stone-500/40 bg-black/10 px-4 py-3 outline-none transition focus:border-amber-300"
          placeholder="например: 3 года"
        />
      </label>

      <label className="grid gap-2 text-sm">
        Комментарий
        <textarea
          rows={4}
          value={values.comment}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, comment: event.target.value }))
          }
          className="rounded-xl border border-stone-500/40 bg-black/10 px-4 py-3 outline-none transition focus:border-amber-300"
          placeholder="Дополнительная информация"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-xl bg-amber-300 px-4 py-3 font-semibold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-amber-100"
      >
        {isSubmitting ? "Отправка..." : "Перейти к оплате"}
      </button>

      {errorMessage ? (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {successMessage}
        </p>
      ) : null}
    </form>
  );
}
