import { RegistrationForm } from "@/components/registration-form";

const judges = [
  {
    name: "RASH THE FLOW",
    city: "г. Санкт-Петербург",
    role: "JUDGE",
  },
  {
    name: "ASHPI",
    city: "г. Донецк",
    role: "JUDGE",
  },
  {
    name: "RUBA",
    city: "г. Москва",
    role: "JUDGE",
  },
];

const dayOneCards = [
  {
    title: "Мастер-Класс от RASH THE FLOW",
    price: "2900₽",
    points: ["Длительность: 1,5 часа"],
    cta: "Зарегистрироваться на МК",
    featured: false,
  },
  {
    title: "Contest 3x3",
    price: "900₽",
    points: [
      "Судит: RASH",
      "Играют: BAMBOOK / WHYDEAP",
      "Номинации: KIDS, JUN, OLD",
      "Зрительский билет: 600₽",
    ],
    cta: "Зарегистрироваться на контест",
    featured: true,
  },
  {
    title: "JAM",
    price: "600₽",
    points: [
      "Играют: BAMBOOK / WHYDEAP",
      "Участникам МК / Contest 3x3 — джем бесплатный",
    ],
    cta: "Зарегистрироваться на джем",
    featured: false,
  },
];

const dayTwoColumns = [
  {
    title: "Номинации",
    items: [
      "BABY (до 7 лет)",
      "JUN PRO (12-15 лет, опыт 3+ года)",
      "KIDS BEG (7-11 лет, до 3 лет обучения)",
      "BEG 16+ (до 3-х лет обучения)",
      "KIDS PRO (7-11 лет, опыт 3+ года)",
      "PRO 16+ (опыт 3+ года)",
      "JUN BEG (12-15 лет, до 3-х лет обучения)",
    ],
    cta: "",
    featured: false,
  },
  {
    title: "Стоимость",
    items: [
      "Первая номинация: 1700₽",
      "Каждая следующая: 800₽",
      "Зрительский билет: 600₽",
    ],
    cta: "Зарегистрироваться на баттл",
    featured: true,
  },
  {
    title: "Важно",
    items: [
      "Место проведения: скоро появится",
      "Категории BEG и PRO определяют по опыту, организаторы могут скорректировать уровень.",
      "После отправки заявки номинацию изменить нельзя.",
      "Возврат денежных средств возможен до 17.04.26 включительно.",
    ],
    cta: "",
    featured: false,
  },
];

const mobileRules = [
  "Первая номинация - 1700₽",
  "Каждая следующая - 800₽",
  "Зрительский билет - 600₽",
];

export default function Home() {
  return (
    <main className="relative isolate overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_42%),radial-gradient(circle_at_80%_20%,_rgba(39,139,63,0.15),_transparent_35%)]" />

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16">
        <p className="fade-up text-xs uppercase tracking-[0.28em] text-amber-200/90 md:text-sm">
          Краснодар • 25-26 апреля • Hip-Hop Improvisation Event
        </p>
        <h1 className="fade-up mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
          ALL IN BATTLE
        </h1>
        <p className="fade-up mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
          Двухдневный ивент по хип-хоп импровизации: мастер-класс, contest, jam и
          основной баттл с категориями по возрасту и опыту.
        </p>
        <div className="fade-up mt-8 flex flex-wrap gap-3">
          <a
            href="#registration"
            className="rounded-full bg-[#2a6a34] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#22592b]"
          >
            Регистрация
          </a>
          <a
            href="#lineup"
            className="rounded-full border border-zinc-400/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:border-zinc-200"
          >
            Лайн-ап
          </a>
        </div>
      </section>

      <section
        id="lineup"
        className="mx-auto w-full max-w-6xl px-5 pb-16 pt-4 md:px-8 md:pb-20"
      >
        <h2 className="text-3xl font-extrabold uppercase tracking-tight md:text-4xl">JUDGES</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {judges.map((person) => (
            <article
              key={person.name}
              className="rounded-2xl border border-zinc-700/50 bg-zinc-900/50 p-6"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-amber-200">{person.role}</p>
              <h3 className="mt-2 text-3xl leading-none">{person.name}</h3>
              <p className="mt-3 text-sm text-zinc-300">{person.city}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-0 pb-16 md:px-6 md:pb-20">
        <div className="bg-[#e3e3e3] px-4 py-8 text-black md:rounded-3xl md:px-8 md:py-10">
          <header className="flex items-center justify-between text-[20px] font-bold uppercase tracking-tight md:text-[30px]">
            <h2>ДЕНЬ 1: WORKSHOP / JAM / CONTEST</h2>
            <p>25 апреля</p>
          </header>

          <div className="mt-7 grid gap-4 md:mt-10 md:grid-cols-3 md:items-start">
            {dayOneCards.map((card) => (
              <article
                key={card.title}
                className={`rounded-3xl border border-[rgba(213,213,213,0.6)] bg-[#fafafa] p-6 md:p-10 ${
                  card.featured
                    ? "md:-mt-4 md:shadow-[0_0_30px_3px_rgba(41,108,51,0.15)]"
                    : ""
                }`}
              >
                <h3 className="font-semibold text-[34px] leading-[1] tracking-tight md:text-[42px]">
                  {card.title}
                </h3>
                <p className="mt-4 text-[38px] font-bold leading-[1] text-[#014807] md:text-[52px]">
                  {card.price}
                </p>
                <ul className="mt-8 grid gap-3 text-[18px] leading-[1.25] text-zinc-800 md:text-[20px]">
                  {card.points.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <button className="mt-10 h-14 w-full rounded-full bg-[#2a6a34] px-5 text-lg font-semibold text-white transition hover:bg-[#22592b]">
                  {card.cta}
                </button>
              </article>
            ))}
          </div>

          <p className="mt-10 text-base font-semibold leading-[1.2] md:text-xl">
            Возврат денежных средств за участие в jam/contest/workshop возможен до
            17.04.2026 включительно
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-0 pb-16 md:px-6 md:pb-20">
        <div className="bg-[#e3e3e3] px-4 py-8 text-black md:rounded-3xl md:px-8 md:py-10">
          <header className="flex items-center justify-between text-[20px] font-bold uppercase tracking-tight md:text-[30px]">
            <h2>ДЕНЬ 2: ALL IN BATTLE</h2>
            <p>26 апреля</p>
          </header>

          <div className="mt-7 grid gap-4 md:mt-10 md:grid-cols-3">
            {dayTwoColumns.map((column) => (
              <article
                key={column.title}
                className={`rounded-3xl border border-[rgba(213,213,213,0.6)] bg-[#fafafa] p-6 md:min-h-[670px] md:p-10 ${
                  column.featured
                    ? "md:-mt-4 md:shadow-[0_0_30px_3px_rgba(41,108,51,0.15)] md:flex md:flex-col md:justify-between"
                    : ""
                }`}
              >
                <h3 className="text-[34px] font-semibold leading-[1] tracking-tight md:text-[42px]">
                  {column.title}
                </h3>
                <ul className="mt-8 grid gap-3 text-[18px] leading-[1.25] text-zinc-800 md:text-[20px]">
                  {column.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                {column.cta ? (
                  <button className="mt-10 h-14 w-full rounded-full bg-[#2a6a34] px-5 text-lg font-semibold text-white transition hover:bg-[#22592b]">
                    {column.cta}
                  </button>
                ) : null}
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-1 text-sm text-zinc-700 md:hidden">
            {mobileRules.map((rule) => (
              <p key={rule}>{rule}</p>
            ))}
          </div>
        </div>
      </section>

      <section
        id="registration"
        className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-24"
      >
        <RegistrationForm />
      </section>
    </main>
  );
}
