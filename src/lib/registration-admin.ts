import type { RegistrationAdminRecord } from "@/lib/db";
import { EVENT_OPTIONS, getOptionsByDay } from "@/lib/event-options";

export type RegistrationFilters = {
  day?: "day1" | "day2";
  optionId?: string;
  query?: string;
  receipt?: "yes" | "no";
};

export function parseSelectedOptionIds(raw: string | null) {
  if (!raw) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function mapOptionIdsToTitles(optionIds: string[]) {
  return optionIds.map(
    (id) => EVENT_OPTIONS.find((item) => item.id === id)?.title ?? id,
  );
}

export function filterRegistrations(
  registrations: RegistrationAdminRecord[],
  filters: RegistrationFilters,
) {
  const normalizedQuery = filters.query?.trim().toLocaleLowerCase("ru-RU") ?? "";
  const dayOptionIds = filters.day
    ? new Set(getOptionsByDay(filters.day, true).map((item) => item.id))
    : null;

  return registrations.filter((registration) => {
    const optionIds = parseSelectedOptionIds(registration.selectedOptionIds);

    if (dayOptionIds && !optionIds.some((id) => dayOptionIds.has(id))) {
      return false;
    }

    if (filters.optionId && !optionIds.includes(filters.optionId)) {
      return false;
    }

    if (filters.receipt === "yes" && !registration.hasReceipt) {
      return false;
    }

    if (filters.receipt === "no" && registration.hasReceipt) {
      return false;
    }

    if (normalizedQuery) {
      const haystack = [
        registration.fullName,
        registration.nickname,
        registration.phone,
        registration.email,
        registration.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ru-RU");

      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}
