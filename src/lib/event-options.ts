export type EventOption = {
  id: string;
  day: "day1" | "day2";
  title: string;
  kind: "fixed" | "competitive" | "spectator";
  priceRub?: number;
};

export const EVENT_OPTIONS: EventOption[] = [
  {
    id: "day1-option-1",
    day: "day1",
    title: "Мастер-Класс от RASH THE FLOW",
    kind: "fixed",
    priceRub: 2900,
  },
  { id: "day1-option-2", day: "day1", title: "Contest 3x3", kind: "fixed", priceRub: 900 },
  { id: "day1-option-3", day: "day1", title: "JAM", kind: "fixed", priceRub: 600 },
  {
    id: "day1-option-4",
    day: "day1",
    title: "Зрительский билет (contest + jam)",
    kind: "fixed",
    priceRub: 600,
  },
  { id: "day2-baby", day: "day2", title: "BABY", kind: "competitive" },
  { id: "day2-beg-16-plus", day: "day2", title: "BEG 16+", kind: "competitive" },
  { id: "day2-jun-beg", day: "day2", title: "JUN BEG", kind: "competitive" },
  { id: "day2-spectator", day: "day2", title: "Зрительский билет", kind: "spectator", priceRub: 600 },
];

export function getOptionsByDay(day: EventOption["day"]) {
  return EVENT_OPTIONS.filter((option) => option.day === day);
}

export function getOptionDisplayPrice(option: EventOption) {
  if (option.kind === "fixed" || option.kind === "spectator") {
    return option.priceRub ?? 0;
  }

  return null;
}

export function calculateSelection(optionIds: string[]) {
  const uniqueIds = [...new Set(optionIds)];
  const selected = uniqueIds
    .map((id) => EVENT_OPTIONS.find((option) => option.id === id))
    .filter((option): option is EventOption => Boolean(option));

  const unknownIds = uniqueIds.filter(
    (id) => !selected.some((option) => option.id === id),
  );

  const day1Total = selected
    .filter((option) => option.day === "day1" && option.kind === "fixed")
    .reduce((sum, option) => sum + (option.priceRub ?? 0), 0);

  const day2SpectatorTotal = selected
    .filter((option) => option.day === "day2" && option.kind === "spectator")
    .reduce((sum, option) => sum + (option.priceRub ?? 0), 0);

  const day2CompetitiveCount = selected.filter(
    (option) => option.day === "day2" && option.kind === "competitive",
  ).length;

  const day2CompetitiveTotal =
    day2CompetitiveCount > 0 ? 1700 + (day2CompetitiveCount - 1) * 800 : 0;

  return {
    selected,
    unknownIds,
    totalRub: day1Total + day2SpectatorTotal + day2CompetitiveTotal,
  };
}
