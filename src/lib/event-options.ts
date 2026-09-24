export type EventOption = {
  id: string;
  day: "day1" | "day2";
  title: string;
  subtitle?: string;
  kind: "fixed" | "contest" | "competitive" | "spectator";
  priceRub?: number;
  hidden?: boolean;
};

export const CONTEST_OPTION_IDS = [
  "day1-contest-under-18",
  "day1-contest-pro",
] as const;

export const JAM_OPTION_ID = "day1-option-3";

export function isContestOptionId(id: string) {
  return CONTEST_OPTION_IDS.some((contestId) => contestId === id);
}

export const EVENT_OPTIONS: EventOption[] = [
  {
    id: "day1-option-1",
    day: "day1",
    title: "Мастер-класс PRADAZOMBIE",
    kind: "fixed",
    priceRub: 3200,
  },
  {
    id: "day1-option-2",
    day: "day1",
    title: "Contest 3×3 (старая заявка)",
    kind: "contest",
    priceRub: 3000,
    hidden: true,
  },
  {
    id: "day1-contest-under-18",
    day: "day1",
    title: "Contest 3×3 — до 18 лет",
    subtitle: "Команда · только одна категория контеста",
    kind: "contest",
    priceRub: 3000,
  },
  {
    id: "day1-contest-pro",
    day: "day1",
    title: "Contest 3×3 — PRO",
    subtitle: "Без ограничений по возрасту · только одна категория контеста",
    kind: "contest",
    priceRub: 3000,
  },
  {
    id: "day1-option-3",
    day: "day1",
    title: "JAM",
    subtitle: "Бесплатно при участии в Contest 3×3",
    kind: "fixed",
    priceRub: 800,
  },
  {
    id: "day1-option-4",
    day: "day1",
    title: "Зрительский билет — день 1",
    kind: "fixed",
    priceRub: 800,
  },
  {
    id: "day2-baby",
    day: "day2",
    title: "BABY",
    subtitle: "(до 7 лет)",
    kind: "competitive",
  },
  {
    id: "day2-jun-pro",
    day: "day2",
    title: "JUN PRO",
    subtitle: "(12-15 лет, опыт 3+ года)",
    kind: "competitive",
  },
  {
    id: "day2-kids-beg",
    day: "day2",
    title: "KIDS BEG",
    subtitle: "(7-11 лет, до 3 лет обучения)",
    kind: "competitive",
  },
  {
    id: "day2-beg-16-plus",
    day: "day2",
    title: "BEG 16+",
    subtitle: "(до 3-х лет обучения)",
    kind: "competitive",
  },
  {
    id: "day2-kids-pro",
    day: "day2",
    title: "KIDS PRO",
    subtitle: "(7-11 лет, опыт 3+ года)",
    kind: "competitive",
  },
  {
    id: "day2-pro-16-plus",
    day: "day2",
    title: "PRO",
    subtitle: "(опыт 3+ года)",
    kind: "competitive",
  },
  {
    id: "day2-jun-beg",
    day: "day2",
    title: "JUN BEG",
    subtitle: "(12-15 лет, до 3-х лет обучения)",
    kind: "competitive",
  },
  {
    id: "day2-spectator",
    day: "day2",
    title: "Зрительский билет",
    kind: "spectator",
    priceRub: 800,
  },
];

export function getOptionsByDay(day: EventOption["day"], includeHidden = false) {
  return EVENT_OPTIONS.filter(
    (option) => option.day === day && (includeHidden || !option.hidden),
  );
}

export function getOptionDisplayPrice(option: EventOption) {
  if (option.kind === "fixed" || option.kind === "contest" || option.kind === "spectator") {
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

  const contestSelectionCount = selected.filter((option) => option.kind === "contest").length;
  const hasContest = contestSelectionCount > 0;
  const day1Total = selected
    .filter((option) => option.day === "day1" && (option.kind === "fixed" || option.kind === "contest"))
    .reduce(
      (sum, option) => sum + (option.id === JAM_OPTION_ID && hasContest ? 0 : (option.priceRub ?? 0)),
      0,
    );

  const day2SpectatorTotal = selected
    .filter((option) => option.day === "day2" && option.kind === "spectator")
    .reduce((sum, option) => sum + (option.priceRub ?? 0), 0);

  const day2CompetitiveCount = selected.filter(
    (option) => option.day === "day2" && option.kind === "competitive",
  ).length;

  const day2CompetitiveTotal =
    day2CompetitiveCount > 0 ? 1900 + (day2CompetitiveCount - 1) * 900 : 0;

  return {
    selected,
    unknownIds,
    hasContest,
    contestSelectionCount,
    totalRub: day1Total + day2SpectatorTotal + day2CompetitiveTotal,
  };
}
