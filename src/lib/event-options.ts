export type EventOption = {
  id: string;
  day: "day1" | "day2";
  title: string;
  priceRub: number;
};

export const EVENT_OPTIONS: EventOption[] = [
  { id: "day1-beginner", day: "day1", title: "1 день — Beginner", priceRub: 1200 },
  { id: "day1-pro", day: "day1", title: "1 день — Pro", priceRub: 1800 },
  { id: "day2-beginner", day: "day2", title: "2 день — Beginner", priceRub: 1200 },
  { id: "day2-pro", day: "day2", title: "2 день — Pro", priceRub: 1800 },
];

export function getOptionsByDay(day: EventOption["day"]) {
  return EVENT_OPTIONS.filter((option) => option.day === day);
}

export function calculateSelection(optionIds: string[]) {
  const uniqueIds = [...new Set(optionIds)];
  const selected = uniqueIds
    .map((id) => EVENT_OPTIONS.find((option) => option.id === id))
    .filter((option): option is EventOption => Boolean(option));

  const unknownIds = uniqueIds.filter(
    (id) => !selected.some((option) => option.id === id),
  );

  return {
    selected,
    unknownIds,
    totalRub: selected.reduce((sum, item) => sum + item.priceRub, 0),
  };
}
