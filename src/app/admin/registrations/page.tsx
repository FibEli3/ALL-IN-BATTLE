import { listRegistrations } from "@/lib/db";
import Link from "next/link";

type AdminPageProps = {
  searchParams: Promise<{
    token?: string;
    status?: string;
  }>;
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

export default async function AdminRegistrationsPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";
  const statusParam = params.status;
  const activeStatus =
    statusParam === "pending" || statusParam === "created" || statusParam === "paid"
      ? statusParam
      : undefined;

  const expectedToken = process.env.ADMIN_DASHBOARD_TOKEN;
  const isAuthorized = Boolean(expectedToken) && token === expectedToken;

  if (!expectedToken) {
    return (
      <main className="mx-auto w-full max-w-[900px] px-5 py-10 md:px-8">
        <h1 className="font-display text-[44px] font-black uppercase">Admin Registrations</h1>
        <p className="mt-6 text-lg">
          Установи <code>ADMIN_DASHBOARD_TOKEN</code> в Vercel, чтобы открыть доступ.
        </p>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="mx-auto w-full max-w-[900px] px-5 py-10 md:px-8">
        <h1 className="font-display text-[44px] font-black uppercase">Admin Registrations</h1>
        <p className="mt-6 text-lg">
          Нет доступа. Открой страницу с <code>?token=ТВОЙ_ТОКЕН</code>.
        </p>
      </main>
    );
  }

  const registrations = await listRegistrations(activeStatus);

  const statuses: Array<{ id: "all" | "pending" | "created" | "paid"; label: string }> = [
    { id: "all", label: "Все" },
    { id: "pending", label: "Pending" },
    { id: "created", label: "Created" },
    { id: "paid", label: "Paid" },
  ];

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8">
      <h1 className="font-display text-[44px] font-black uppercase tracking-tight md:text-[62px]">
        Registrations Admin
      </h1>
      <p className="mt-3 text-lg text-[#575757]">Всего записей: {registrations.length}</p>

      <div className="mt-6 flex flex-wrap gap-3">
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
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#dadada] bg-white">
        <table className="min-w-[1280px] border-collapse text-left text-sm">
          <thead className="bg-[#f4f4f4] text-[#303030]">
            <tr>
              <th className="px-4 py-3 font-semibold">Дата</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
              <th className="px-4 py-3 font-semibold">Сумма</th>
              <th className="px-4 py-3 font-semibold">ФИО</th>
              <th className="px-4 py-3 font-semibold">Ник</th>
              <th className="px-4 py-3 font-semibold">Телефон</th>
              <th className="px-4 py-3 font-semibold">Возраст</th>
              <th className="px-4 py-3 font-semibold">Тип</th>
              <th className="px-4 py-3 font-semibold">Опции</th>
              <th className="px-4 py-3 font-semibold">Order ID</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((item) => {
              const options = parseOptions(item.selectedOptionIds);

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
                  <td className="px-4 py-3">{item.participationType}</td>
                  <td className="px-4 py-3">
                    {options.length > 0 ? options.join(", ") : "-"}
                  </td>
                  <td className="px-4 py-3">{item.paymentOrderId ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

