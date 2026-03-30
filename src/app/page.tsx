import { RegistrationForm } from "@/components/registration-form";

const judges = [
  {
    name: "KATYA BLAZE",
    role: "Судья / Hip-Hop Freestyle",
    description:
      "Финалистка международных баттлов, преподаватель с акцентом на музыкальность и импровизацию.",
  },
  {
    name: "D-MOTION",
    role: "MC / Host",
    description:
      "Ведущий и организатор городских хип-хоп ивентов, отвечает за энергию и темп площадки.",
  },
  {
    name: "SLAVA RAW",
    role: "DJ",
    description:
      "Подготовил сет из funk, boom bap и fresh hip-hop для живой импровизации в кругах.",
  },
];

const schedule = [
  "12:00 — Регистрация участников",
  "13:00 — Отборочные круги",
  "16:00 — Топ-16 / Баттл сетка",
  "19:00 — Финалы и награждение",
];

export default function Home() {
  return (
    <main className="relative isolate overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_42%),radial-gradient(circle_at_80%_20%,_rgba(239,68,68,0.12),_transparent_35%)]" />

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16">
        <p className="fade-up text-xs uppercase tracking-[0.32em] text-amber-200/90 md:text-sm">
          Краснодар • 2026 • Hip-Hop Improvisation Event
        </p>
        <h1 className="fade-up mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
          ALL IN BATTLE
        </h1>
        <p className="fade-up mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
          Большой ивент по хип-хоп импровизации в Краснодаре: баттлы, круги, живой
          DJ-сет и атмосфера уличной культуры.
        </p>

        <div className="fade-up mt-8 flex flex-wrap gap-3">
          <a
            href="#registration"
            className="rounded-full bg-amber-300 px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-amber-200"
          >
            Зарегистрироваться
          </a>
          <a
            href="#lineup"
            className="rounded-full border border-zinc-400/30 px-6 py-3 text-sm font-bold uppercase tracking-wider transition hover:border-amber-200"
          >
            Кто будет
          </a>
        </div>
      </section>

      <section className="border-y border-zinc-700/40 bg-zinc-900/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-4 md:px-8">
          {schedule.map((item) => (
            <article
              key={item}
              className="fade-up rounded-2xl border border-zinc-700/50 bg-zinc-900/70 p-4"
            >
              <p className="text-sm leading-relaxed text-zinc-200">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="lineup" className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <h2 className="fade-up text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
          Специальные гости
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {judges.map((person) => (
            <article
              key={person.name}
              className="fade-up rounded-2xl border border-zinc-700/50 bg-zinc-900/50 p-6"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-amber-200">
                {person.role}
              </p>
              <h3 className="mt-3 text-2xl font-black leading-none">{person.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                {person.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="registration" className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-24">
        <div className="grid gap-8 rounded-3xl border border-zinc-700/50 bg-zinc-900/60 p-6 md:grid-cols-5 md:p-10">
          <div className="fade-up md:col-span-2">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight md:text-4xl">
              Регистрация
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              Заполни форму, мы сохраним заявку в базе и на следующем этапе подключим
              оплату через Т-Банк с автоматическим обновлением статуса платежа.
            </p>
            <div className="mt-6 rounded-2xl border border-amber-200/30 bg-amber-200/10 p-4 text-sm text-amber-100">
              После внедрения Т-Банк:
              <ul className="mt-2 list-disc pl-5 text-amber-50/90">
                <li>создаём заказ в API банка;</li>
                <li>перенаправляем на оплату;</li>
                <li>фиксируем webhook и меняем статус в БД.</li>
              </ul>
            </div>
          </div>
          <div className="fade-up md:col-span-3">
            <RegistrationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
