"use client";

import { FormEvent, useState } from "react";

type FormValues = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  danceExperience: string;
  participationType: "participant" | "spectator";
  comment: string;
};

const initialForm: FormValues = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  danceExperience: "",
  participationType: "participant",
  comment: "",
};

export function RegistrationForm() {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message ?? "Ошибка отправки");
      }

      setSuccessMessage(
        "Заявка принята. Следующим шагом подключим оплату через Т-Банк и перенаправление на платёжную страницу.",
      );
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
        ФИО
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
        Телефон
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
          required
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
          <option value="participant">Участник баттла</option>
          <option value="spectator">Зритель</option>
        </select>
      </label>

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
        {isSubmitting ? "Отправка..." : "Оставить заявку"}
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
