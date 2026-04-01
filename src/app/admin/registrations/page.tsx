import type { RegistrationAdminRecord } from "@/lib/db";
import { listRegistrations } from "@/lib/db";
import { EVENT_OPTIONS, getOptionsByDay } from "@/lib/event-options";
import Link from "next/link";

type AdminPageProps = {
  searchParams: Promise<{
    token?: string;
    status?: string;
  }>;
};

type OptionStat = {
  id: string;
  title: string;
  registered: number;
  paid: number;
};

function rub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function parseOptions(raw: string | null) {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapOptionIdsToTitles(optionIds: string[]) {
  return optionIds.map((id) => EVENT_OPTIONS.find((item) => item.id === id)?.title ?? id);
}

function buildStats(registrations: RegistrationAdminRecord[], day: "day1" | "day2"): OptionStat[] {
  const options = getOptionsByDay(day);

  return options.map((option) => {
    let registered = 0;
    let paid = 0;

    for (const record of registrations) {
      const selected = parseOptions(record.selectedOptionIds);
      if (!selected.includes(option.id)) {
        continue;
      }

      registered += 1;
      if (record.paymentStatus === "paid") {
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
  const statusParam = params.status;
  const activeStatus = statusParam === "pending" || statusParam === "paid" ? statusParam : undefined;

  const expectedToken = process.env.ADMIN_DASHBOARD_TOKEN?.trim();
  const isAuthorized = Boolean(expectedToken) && token === expectedToken;

  if (!expectedToken) {
    return (
      <main className="mx-auto w-full max-w-[900px] px-5 py-10 md:px-8">
        <h1 className="font-display text-[44px] font-black uppercase">Админка регистраций</h1>
        <p className="mt-6 text-lg">
          Установите <code>ADMIN_DASHBOARD_TOKEN</code> в Vercel, чтобы открыть доступ.
        </p>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="mx-auto w-full max-w-[900px] px-5 py-10 md:px-8">
        <h1 className="font-display text-[44px] font-black uppercase">Админка регистраций</h1>
        <p className="mt-6 text-lg">
          Нет доступа. Откройте страницу с <code>?token=ВАШ_ТОКЕН</code>.
        </p>
      </main>
    );
  }

  const allRegistrations = await listRegistrations();
  const registrations = activeStatus
    ? allRegistrations.filter((item) => item.paymentStatus === activeStatus)
    : allRegistrations;
  const day1Stats = buildStats(allRegistrations, "day1");
  const day2Stats = buildStats(allRegistrations, "day2");

  const statuses: Array<{ id: "all" | "pending" | "paid"; label: string }> = [
    { id: "all", label: "Все" },
    { id: "pending", label: "Pending" },
    { id: "paid", label: "Paid" },
  ];

  const exportHref = `/api/admin/registrations/export?token=${encodeURIComponent(token)}`;

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8">
      <h1 className="font-display text-[44px] font-black uppercase tracking-tight md:text-[62px]">
        Регистрации
      </h1>
      <p className="mt-3 text-lg text-[#575757]">Всего заявок: {allRegistrations.length}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {statuses.map((item) => {
          const href =
            item.id === "all"
              ? `/admin/registrations?token=${encodeURIComponent(token)}`
              : `/admin/registrations?token=${encodeURIComponent(token)}&status=${item.id}`;
          const active =
            (item.id === "all" && !activeStatus) || (item.id !== "all" && activeStatus === item.id);

          return (
            <Link
              key={item.id}
              href={href}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-[#2a6a34] bg-[#2a6a34] text-white"
                  : "border-[#cfcfcf] bg-white text-[#1b1b1b]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <a
          href={exportHref}
          className="rounded-full border border-[#2a6a34] bg-white px-4 py-2 text-sm font-semibold text-[#2a6a34] transition hover:bg-[#2a6a34] hover:text-white"
        >
          Скачать Excel
        </a>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#dadada] bg-white p-4 md:p-6">
          <h2 className="text-xl font-bold">День 1 — номинации</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
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

        <div className="rounded-2xl border border-[#dadada] bg-white p-4 md:p-6">
          <h2 className="text-xl font-bold">День 2 — номинации</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
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

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#dadada] bg-white">
        <table className="min-w-[1320px] border-collapse text-left text-sm">
          <thead className="bg-[#f4f4f4] text-[#303030]">
            <tr>
              <th className="px-4 py-3 font-semibold">Дата</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
              <th className="px-4 py-3 font-semibold">Сумма</th>
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
              const optionTitles = mapOptionIdsToTitles(parseOptions(item.selectedOptionIds));

              return (
                <tr key={item.id} className="border-t border-[#ececec] align-top">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                  </td>
                  <td className="px-4 py-3 font-semibold">{item.paymentStatus}</td>
                  <td className="px-4 py-3 font-semibold">{rub(item.amountRub)}</td>
                  <td className="px-4 py-3">{item.fullName}</td>
                  <td className="px-4 py-3">{item.nickname ?? "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.phone}</td>
                  <td className="px-4 py-3">{item.age ?? "-"}</td>
                  <td className="px-4 py-3">{optionTitles.length > 0 ? optionTitles.join(", ") : "-"}</td>
                  <td className="px-4 py-3">
                    {item.receiptFileName || item.receiptFileBase64 ? (
                      <a
                        href={`/api/admin/registrations/receipt?token=${encodeURIComponent(token)}&id=${encodeURIComponent(item.id)}`}
                        className="inline-flex rounded-full border border-[#2a6a34] px-3 py-1 text-xs font-semibold text-[#2a6a34] transition hover:bg-[#2a6a34] hover:text-white"
                      >
                        Скачать чек
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
