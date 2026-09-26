"use client";

import { MANUAL_PAYMENT_DRAFT_KEY, type PaymentDraft } from "@/lib/payment-draft";
import {
  calculateSelection,
  CONTEST_OPTION_IDS,
  getOptionDisplayPrice,
  getOptionsByDay,
  JAM_OPTION_ID,
  type EventOption,
} from "@/lib/event-options";
import { useRouter, useSearchParams } from "next/navigation";
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
type Day2BaseGroup = "baby" | "beg16" | "kids" | "jun" | null;

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
const day1OptionIdSet = new Set(day1Options.map((option) => option.id));
const day2OptionIdSet = new Set(day2Options.map((option) => option.id));
const contestOptionIdSet = new Set<string>(CONTEST_OPTION_IDS);
const day2DisplayOrder = [
  "day2-baby", "day2-kids-beg", "day2-kids-pro", "day2-jun-beg",
  "day2-jun-pro", "day2-beg-16-plus", "day2-pro-16-plus", "day2-spectator",
] as const;

const day2SpectatorId = "day2-spectator";
const day2ProId = "day2-pro-16-plus";
const requiredFieldOrder: Array<{ key: RequiredFieldKey; selector: string }> = [
  { key: "fullName", selector: "#registration-full-name" },
  { key: "nickname", selector: "#registration-nickname" },
  { key: "phone", selector: "#registration-phone" },
];

function getDay2BaseGroup(id: string): Day2BaseGroup {
  if (id === "day2-baby") return "baby";
  if (id === "day2-beg-16-plus") return "beg16";
  if (id === "day2-kids-beg" || id === "day2-kids-pro") return "kids";
  if (id === "day2-jun-beg" || id === "day2-jun-pro") return "jun";
  return null;
}

function normalizeSelectedOptionIds(optionIds: string[], preferredId?: string) {
  const rawDay1Selected = optionIds.filter((id) => day1OptionIdSet.has(id));
  const selectedContestId = preferredId && contestOptionIdSet.has(preferredId)
    ? preferredId
    : rawDay1Selected.find((id) => contestOptionIdSet.has(id));
  const day1Selected = rawDay1Selected.filter((id) => !contestOptionIdSet.has(id));
  if (selectedContestId) day1Selected.push(selectedContestId);
  const day2Selected = optionIds.filter((id) => day2OptionIdSet.has(id));
  const baseSelections = day2Selected.filter((id) => id !== day2SpectatorId && id !== day2ProId);
  const activeGroup = (preferredId ? getDay2BaseGroup(preferredId) : null) ??
    (baseSelections[0] ? getDay2BaseGroup(baseSelections[0]) : null);

  const normalizedDay2: string[] = [];
  if (day2Selected.includes(day2SpectatorId)) normalizedDay2.push(day2SpectatorId);
  if (day2Selected.includes(day2ProId)) normalizedDay2.push(day2ProId);

  day2DisplayOrder.forEach((id) => {
    if (id === day2SpectatorId || id === day2ProId) return;
    if (baseSelections.includes(id) && getDay2BaseGroup(id) === activeGroup) normalizedDay2.push(id);
  });

  return [...day1Selected, ...normalizedDay2];
}

function getDay2DisabledIds(selectedOptionIds: string[]) {
  const base = selectedOptionIds.find((id) => day2OptionIdSet.has(id) && id !== day2SpectatorId && id !== day2ProId);
  const activeGroup = base ? getDay2BaseGroup(base) : null;
  if (!activeGroup) return new Set<string>();

  return new Set(
    day2DisplayOrder.filter((id) => {
      if (id === day2SpectatorId || id === day2ProId) return false;
      return getDay2BaseGroup(id) !== activeGroup;
    }),
  );
}

function getContestDisabledIds(selectedOptionIds: string[]) {
  const selectedContestId = selectedOptionIds.find((id) => contestOptionIdSet.has(id));
  if (!selectedContestId) return new Set<string>();
  return new Set<string>(CONTEST_OPTION_IDS.filter((id) => id !== selectedContestId));
}

function maskPhoneInput(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  const normalized = digitsOnly.startsWith("8") ? `7${digitsOnly.slice(1)}` : digitsOnly;
  const local = normalized.startsWith("7") ? normalized.slice(1, 11) : normalized.slice(0, 10);
  let result = "+7";
  if (local.length > 0) result += `(${local.slice(0, 3)}`;
  if (local.length >= 3) result += ")";
  if (local.length > 3) result += local.slice(3, 6);
  if (local.length > 6) result += `-${local.slice(6, 8)}`;
  if (local.length > 8) result += `-${local.slice(8, 10)}`;
  return result;
}

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function focusValidationTarget(selector: string) {
  window.requestAnimationFrame(() => {
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function Field(props: {
  label: string;
  value: string;
  placeholder: string;
  inputId?: string;
  inputMode?: "text" | "numeric" | "tel";
  hasError?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const isRequired = props.required !== false;
  return (
    <label className="field">
      <span className={props.hasError ? "is-error" : ""}>{props.label}{isRequired ? " *" : ""}</span>
      <input
        id={props.inputId}
        value={props.value}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        required={isRequired}
        aria-required={isRequired}
        aria-invalid={props.hasError || undefined}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </label>
  );
}

function OptionRow({
  option,
  checked,
  disabled,
  complimentary,
  onToggle,
}: {
  option: EventOption;
  checked: boolean;
  disabled: boolean;
  complimentary?: boolean;
  onToggle: () => void;
}) {
  const fixedPrice = getOptionDisplayPrice(option);
  return (
    <label className={`option-row ${disabled ? "is-disabled" : ""}`}>
      <span className="option-copy">
        <strong>{option.title}</strong>
        {option.subtitle ? <small>{option.subtitle}</small> : null}
      </span>
      <span className="option-price">
        {complimentary ? "Бесплатно" : fixedPrice !== null ? formatRub(fixedPrice) : "по тарифу"}
      </span>
      <input
        type="checkbox"
        className="checkbox-mark"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
      />
    </label>
  );
}

export function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<FormValues>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<RequiredFieldKey, boolean>>({
    fullName: false, nickname: false, phone: false,
  });

  const selection = useMemo(() => calculateSelection(values.selectedOptionIds), [values.selectedOptionIds]);
  const orderedDay2Options = day2DisplayOrder
    .map((id) => day2Options.find((option) => option.id === id))
    .filter((option): option is EventOption => Boolean(option));
  const day2DisabledIds = useMemo(() => getDay2DisabledIds(values.selectedOptionIds), [values.selectedOptionIds]);
  const contestDisabledIds = useMemo(() => getContestDisabledIds(values.selectedOptionIds), [values.selectedOptionIds]);
  const registerPreset = searchParams.get("register");
  const focusPreset = searchParams.get("focus");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (registerPreset && day1OptionIdSet.has(registerPreset)) {
        setValues((previous) => ({ ...previous, selectedOptionIds: [registerPreset] }));
      }
      if (registerPreset !== null || focusPreset === "fullName") {
        document.getElementById("registration-full-name")?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [registerPreset, focusPreset]);

  useEffect(() => {
    const handlePreset = (event: Event) => {
      const detail = (event as CustomEvent<{ presetId?: string | null; clearSelection?: boolean }>).detail;
      const presetId = detail?.presetId ?? null;
      setValues((previous) => ({
        ...previous,
        selectedOptionIds: presetId && day1OptionIdSet.has(presetId)
          ? [presetId]
          : detail?.clearSelection ? [] : previous.selectedOptionIds,
      }));
    };
    window.addEventListener("program-registration-preset", handlePreset as EventListener);
    return () => window.removeEventListener("program-registration-preset", handlePreset as EventListener);
  }, []);

  const clearError = (key: RequiredFieldKey) => setFieldErrors((previous) => ({ ...previous, [key]: false }));

  const toggleOption = (optionId: string) => {
    setValues((previous) => {
      if (day2DisabledIds.has(optionId) || contestDisabledIds.has(optionId)) return previous;
      const exists = previous.selectedOptionIds.includes(optionId);
      const next = exists
        ? previous.selectedOptionIds.filter((id) => id !== optionId)
        : [...previous.selectedOptionIds, optionId];
      return { ...previous, selectedOptionIds: normalizeSelectedOptionIds(next, exists ? undefined : optionId) };
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const nextErrors: Record<RequiredFieldKey, boolean> = {
      fullName: values.fullName.trim().length < 2,
      nickname: values.nickname.trim().length < 2,
      phone: values.phone.replace(/\D/g, "").length < 11,
    };
    setFieldErrors(nextErrors);

    const firstInvalidField = requiredFieldOrder.find(({ key }) => nextErrors[key]);
    if (firstInvalidField) {
      setErrorMessage("Проверьте обязательные поля.");
      focusValidationTarget(firstInvalidField.selector);
      return;
    }
    if (selection.selected.length < 1) {
      setErrorMessage("Выберите хотя бы одну позицию программы.");
      focusValidationTarget(".option-row input:not(:disabled)");
      return;
    }

    setIsSubmitting(true);
    try {
      const draft: PaymentDraft = {
        fullName: values.fullName.trim(),
        nickname: values.nickname.trim(),
        age: values.age.trim(),
        phone: values.phone.trim(),
        participationType: values.participationType,
        selectedOptionIds: selection.selected.map((item) => item.id),
      };
      sessionStorage.setItem(MANUAL_PAYMENT_DRAFT_KEY, JSON.stringify(draft));
      router.push("/payment/manual");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось перейти к оплате.");
      setIsSubmitting(false);
    }
  };

  return (
    <form className="registration-form" onSubmit={onSubmit} noValidate>
      <section className="registration-form-section">
        <div className="registration-form-title"><span>01 / Данные</span><h3>Расскажите о себе</h3></div>
        <div className="registration-fields">
          <Field label="ФИО" value={values.fullName} placeholder="Иванов Иван Иванович" inputId="registration-full-name" hasError={fieldErrors.fullName} onChange={(fullName) => { clearError("fullName"); setValues((previous) => ({ ...previous, fullName })); }} />
          <Field label="Никнейм" value={values.nickname} placeholder="Ваш танцевальный ник" inputId="registration-nickname" hasError={fieldErrors.nickname} onChange={(nickname) => { clearError("nickname"); setValues((previous) => ({ ...previous, nickname })); }} />
          <Field label="Возраст" value={values.age} placeholder="14" inputMode="numeric" required={false} onChange={(age) => setValues((previous) => ({ ...previous, age: age.replace(/\D/g, "").slice(0, 2) }))} />
          <Field label="Телефон" value={values.phone} placeholder="+7 (999) 000-00-00" inputId="registration-phone" inputMode="tel" hasError={fieldErrors.phone} onChange={(phone) => { clearError("phone"); setValues((previous) => ({ ...previous, phone: maskPhoneInput(phone) })); }} />
        </div>
      </section>

      <section className="registration-form-section">
        <div className="registration-form-title"><span>02 / Программа</span><h3>Выберите участие</h3></div>
        <div className="options-layout">
          <div className="option-group">
            <h4>24 октября · День 1</h4>
            <div className="option-list">
              {day1Options.map((option) => (
                <OptionRow
                  key={option.id}
                  option={option}
                  checked={values.selectedOptionIds.includes(option.id)}
                  disabled={contestDisabledIds.has(option.id)}
                  complimentary={option.id === JAM_OPTION_ID && selection.hasContest}
                  onToggle={() => toggleOption(option.id)}
                />
              ))}
            </div>
          </div>
          <div className="option-group">
            <h4>25 октября · День 2</h4>
            <div className="option-list">
              {orderedDay2Options.map((option) => (
                <OptionRow key={option.id} option={option} checked={values.selectedOptionIds.includes(option.id)} disabled={day2DisabledIds.has(option.id)} onToggle={() => toggleOption(option.id)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="form-summary">
        <p className="form-total">Итого к оплате<strong>{formatRub(selection.totalRub)}</strong></p>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Переходим…" : "Перейти к оплате"}
        </button>
      </div>
      {errorMessage ? <p className="form-error" role="alert">{errorMessage}</p> : null}
      <p className="refund-notice">Возврат денежных средств возможен до 10 октября</p>
      <p className="form-footnote">Нажимая кнопку, вы соглашаетесь на обработку данных для регистрации на мероприятие. Для несовершеннолетних согласие подтверждает законный представитель.</p>
    </form>
  );
}
