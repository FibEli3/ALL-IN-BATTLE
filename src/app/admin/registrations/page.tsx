import type { RegistrationAdminRecord } from "@/lib/db";
import { listRegistrations } from "@/lib/db";
import { EVENT_OPTIONS, getOptionsByDay } from "@/lib/event-options";
import {
  filterRegistrations,
  mapOptionIdsToTitles,
  parseSelectedOptionIds,
} from "@/lib/registration-admin";
import Link from "next/link";
import "./admin.css";

type AdminPageProps = {
  searchParams: Promise<{
    token?: string;
    day?: string;
    option?: string;
    q?: string;
    receipt?: string;
  }>;
};

type OptionStat = {
  id: string;
  title: string;
  registered: number;
  paid: number;
};

const day2SummaryOrder = [
  "day2-baby",
  "day2-kids-beg",
  "day2-kids-pro",
  "day2-jun-beg",
  "day2-jun-pro",
  "day2-beg-16-plus",
  "day2-pro-16-plus",
  "day2-spectator",
] as const;

function rub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function formatDateTimeRu(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function buildStats(registrations: RegistrationAdminRecord[], day: "day1" | "day2"): OptionStat[] {
  const options =
    day === "day2"
      ? day2SummaryOrder
          .map((id) => getOptionsByDay("day2").find((option) => option.id === id))
          .filter((option): option is ReturnType<typeof getOptionsByDay>[number] => Boolean(option))
      : getOptionsByDay(day, true);

  return options.map((option) => {
    let registered = 0;
    let paid = 0;

    for (const record of registrations) {
      const selected = parseSelectedOptionIds(record.selectedOptionIds);
      if (!selected.includes(option.id)) {
        continue;
      }

      registered += 1;
      if (record.hasReceipt) {
        paid += 1;
      }
    }

    return {
      id: option.id,
      title: option.title,
      registered,
      paid,
    };
  });
}

export default async function AdminRegistrationsPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const token = (params.token ?? "").trim();
  const dayParam = params.day;
  const activeDay = dayParam === "day1" || dayParam === "day2" ? dayParam : undefined;
  const query = (params.q ?? "").trim();
  const receiptParam = params.receipt;
  const receipt = receiptParam === "yes" || receiptParam === "no" ? receiptParam : undefined;
  const optionParam = (params.option ?? "").trim();
  const optionId = EVENT_OPTIONS.some((option) => option.id === optionParam)
    ? optionParam
    : undefined;

  const expectedToken = process.env.ADMIN_DASHBOARD_TOKEN?.trim();
  const isAuthorized = Boolean(expectedToken) && token === expectedToken;

  if (!expectedToken) {
    return (
      <main className="admin-page admin-access-page mx-auto w-full max-w-[900px] px-5 py-10 md:px-8">
        <h1 className="font-display text-[44px] font-black uppercase">Админка регистраций</h1>
        <p className="mt-6 text-lg">
          Установите <code>ADMIN_DASHBOARD_TOKEN</code> в Vercel, чтобы открыть доступ.
        </p>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="admin-page admin-access-page mx-auto w-full max-w-[900px] px-5 py-10 md:px-8">
        <h1 className="font-display text-[44px] font-black uppercase">Админка регистраций</h1>
        <p className="mt-6 text-lg">
          Нет доступа. Откройте страницу с <code>?token=ВАШ_ТОКЕН</code>.
        </p>
      </main>
    );
  }

  const allRegistrations = await listRegistrations();
  const registrations = filterRegistrations(allRegistrations, {
    day: activeDay,
    optionId,
    query,
    receipt,
  });
  const day1Stats = buildStats(allRegistrations, "day1");
  const day2Stats = buildStats(allRegistrations, "day2");

  const filters: Array<{ id: "all" | "day1" | "day2"; label: string }> = [
    { id: "all", label: "Все" },
    { id: "day1", label: "1 день" },
    { id: "day2", label: "2 день" },
  ];

  const exportHref = `/api/admin/registrations/export?token=${encodeURIComponent(token)}`;

  return (
    <main className="admin-page mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8">
      <header className="admin-header">
      <h1 className="font-display text-[44px] font-black uppercase tracking-tight md:text-[62px]">
        Регистрации
      </h1>
      <p className="admin-total mt-3 text-lg text-[#575757]">Всего заявок: {allRegistrations.length}</p>
      </header>

      <div className="admin-actions mt-6 flex flex-wrap items-center gap-3">
        {filters.map((item) => {
          const href =
            item.id === "all"
              ? `/admin/registrations?token=${encodeURIComponent(token)}`
              : `/admin/registrations?token=${encodeURIComponent(token)}&day=${item.id}`;
          const active =
            (item.id === "all" && !activeDay) || (item.id !== "all" && activeDay === item.id);

          return (
            <Link
              key={item.id}
              href={href}
              className={`admin-tab rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "admin-tab-active border-[#2a6a34] bg-[#2a6a34] text-white"
                  : "border-[#cfcfcf] bg-white text-[#1b1b1b]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <a
          href={exportHref}
          className="admin-export rounded-full border border-[#2a6a34] bg-white px-4 py-2 text-sm font-semibold text-[#2a6a34] transition hover:bg-[#2a6a34] hover:text-white"
        >
          Скачать Excel
        </a>
      </div>

      <form
        action="/admin/registrations"
        className="admin-filter-panel mt-5 grid gap-3 rounded-2xl border border-[#dadada] bg-white p-4 md:grid-cols-[minmax(220px,1fr)_minmax(210px,0.8fr)_minmax(170px,0.55fr)_auto] md:items-end"
      >
        <input type="hidden" name="token" value={token} />
        {activeDay ? <input type="hidden" name="day" value={activeDay} /> : null}

        <label className="grid gap-1.5 text-sm font-semibold text-[#303030]">
          Поиск
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="ФИО, ник или телефон"
            className="h-11 rounded-xl border border-[#cfcfcf] bg-white px-3 font-normal outline-none transition focus:border-[#2a6a34]"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-[#303030]">
          Номинация
          <select
            name="option"
            defaultValue={optionId ?? ""}
            className="h-11 rounded-xl border border-[#cfcfcf] bg-white px-3 font-normal outline-none transition focus:border-[#2a6a34]"
          >
            <option value="">Все номинации</option>
            {EVENT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-semibold text-[#303030]">
          Чек
          <select
            name="receipt"
            defaultValue={receipt ?? ""}
            className="h-11 rounded-xl border border-[#cfcfcf] bg-white px-3 font-normal outline-none transition focus:border-[#2a6a34]"
          >
            <option value="">Любой статус</option>
            <option value="yes">Есть чек</option>
            <option value="no">Без чека</option>
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="admin-apply h-11 rounded-full bg-[#2a6a34] px-5 text-sm font-semibold text-white transition hover:bg-[#214f29]"
          >
            Применить
          </button>
          <Link
            href={`/admin/registrations?token=${encodeURIComponent(token)}`}
            className="admin-reset inline-flex h-11 items-center rounded-full border border-[#cfcfcf] px-4 text-sm font-semibold text-[#303030] transition hover:border-[#2a6a34] hover:text-[#2a6a34]"
          >
            Сбросить
          </Link>
        </div>
      </form>

      <p className="admin-result-count mt-4 text-sm text-[#575757]">
        Показано: {registrations.length} из {allRegistrations.length}
      </p>

      <section className="admin-summary-grid mt-8 grid gap-6 md:grid-cols-2">
        <div className="admin-summary-card rounded-2xl border border-[#dadada] bg-white p-4 md:p-6">
          <h2 className="text-xl font-bold">День 1 — номинации</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="admin-summary-table min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#ececec] text-left">
                  <th className="py-2 pr-3">Номинация</th>
                  <th className="py-2 pr-3">Зарегистрировано</th>
                  <th className="py-2">Оплачено</th>
                </tr>
              </thead>
              <tbody>
                {day1Stats.map((item) => (
                  <tr key={item.id} className="border-b border-[#f3f3f3]">
                    <td className="py-2 pr-3">{item.title}</td>
                    <td className="py-2 pr-3 font-semibold">{item.registered}</td>
                    <td className="py-2 font-semibold text-[#2a6a34]">{item.paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-summary-card rounded-2xl border border-[#dadada] bg-white p-4 md:p-6">
          <h2 className="text-xl font-bold">День 2 — номинации</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="admin-summary-table min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#ececec] text-left">
                  <th className="py-2 pr-3">Номинация</th>
                  <th className="py-2 pr-3">Зарегистрировано</th>
                  <th className="py-2">Оплачено</th>
                </tr>
              </thead>
              <tbody>
                {day2Stats.map((item) => (
                  <tr key={item.id} className="border-b border-[#f3f3f3]">
                    <td className="py-2 pr-3">{item.title}</td>
                    <td className="py-2 pr-3 font-semibold">{item.registered}</td>
                    <td className="py-2 font-semibold text-[#2a6a34]">{item.paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="admin-data-panel mt-8 overflow-x-auto rounded-2xl border border-[#dadada] bg-white">
        <table className="admin-data-table min-w-[1320px] border-collapse text-left text-sm">
          <thead className="bg-[#f4f4f4] text-[#303030]">
            <tr>
              <th className="px-4 py-3 font-semibold">Дата</th>
              <th className="w-[140px] px-4 py-3 font-semibold whitespace-nowrap">Сумма</th>
              <th className="px-4 py-3 font-semibold">ФИО</th>
              <th className="px-4 py-3 font-semibold">Ник</th>
              <th className="px-4 py-3 font-semibold">Телефон</th>
              <th className="px-4 py-3 font-semibold">Возраст</th>
              <th className="px-4 py-3 font-semibold">Опции</th>
              <th className="px-4 py-3 font-semibold">Чек</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((item) => {
              const optionTitles = mapOptionIdsToTitles(
                parseSelectedOptionIds(item.selectedOptionIds),
              );

              return (
                <tr key={item.id} className="border-t border-[#ececec] align-top">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTimeRu(item.createdAt)}
                  </td>
                  <td className="w-[140px] px-4 py-3 font-semibold whitespace-nowrap">{rub(item.amountRub)}</td>
                  <td className="px-4 py-3">{item.fullName}</td>
                  <td className="px-4 py-3">{item.nickname ?? "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.phone}</td>
                  <td className="px-4 py-3">{item.age ?? "-"}</td>
                  <td className="px-4 py-3">{optionTitles.length > 0 ? optionTitles.join(", ") : "-"}</td>
                  <td className="px-4 py-3">
                    {item.hasReceipt ? (
                      <a
                        href={`/api/admin/registrations/receipt?token=${encodeURIComponent(token)}&id=${encodeURIComponent(item.id)}`}
                        className="admin-receipt inline-flex rounded-full border border-[#2a6a34] px-3 py-1 text-xs font-semibold text-[#2a6a34] transition hover:bg-[#2a6a34] hover:text-white"
                      >
                        Скачать
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
            {registrations.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#575757]" colSpan={8}>
                  По выбранным фильтрам заявок нет.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
