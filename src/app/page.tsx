import Image from "next/image";
import { RegistrationForm } from "@/components/registration-form";

const judges = [
  {
    name: "ASHPI",
    city: "г. Донецк",
    image: "/judges/ashpi.jpg",
    imageClass: "-rotate-[2deg]",
    orderClass: "md:order-1 md:pt-0",
  },
  {
    name: "RASH THE FLOW",
    city: "г. Санкт-Петербург",
    image: "/judges/rash-the-flow.jpg",
    imageClass: "rotate-0",
    orderClass: "md:order-2 md:pt-16",
  },
  {
    name: "RUBA",
    city: "г. Москва",
    image: "/judges/ruba.jpg",
    imageClass: "rotate-[2deg]",
    orderClass: "md:order-3 md:pt-0",
  },
];

const dayOneCards = [
  {
    title: "Мастер-Класс от RASH THE FLOW",
    price: "2900₽",
    points: ["Длительность: 1,5 часа"],
    button: "Зарегистрироваться на МК",
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
    button: "Зарегистрироваться на контест",
    featured: true,
  },
  {
    title: "JAM",
    price: "600₽",
    points: [
      "Играют: BAMBOOK / WHYDEAP",
      "Участникам МК / Contest 3x3 — джем бесплатный",
    ],
    button: "Зарегистрироваться на джем",
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
    button: "",
    featured: false,
  },
  {
    title: "Стоимость",
    items: [
      "Первая номинация: 1700₽",
      "Каждая следующая: 800₽",
      "Зрительский билет: 600₽",
    ],
    button: "Зарегистрироваться на баттл",
    featured: true,
  },
  {
    title: "Важно",
    items: [
      "Место проведения: скоро появится",
      "Категории BEG/PRO определяются по опыту, организаторы могут скорректировать уровень.",
      "После отправки заявки номинацию изменить нельзя.",
      "Возврат возможен до 17.04.26 включительно.",
    ],
    button: "",
    featured: false,
  },
];

const navItems = [
  { label: "Судьи", href: "#judges" },
  { label: "DJ", href: "#day-one" },
  { label: "MC", href: "#day-two" },
  { label: "Media", href: "#media" },
  { label: "Регистрация", href: "#registration" },
];

export default function Home() {
  return (
    <main className="bg-white font-body text-[#1b1b1b]">
      <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_#f7f7f7_42%,_#c3d4c6_76%,_#8aa58f_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0)_44%,_rgba(30,80,44,0.18)_100%)]" />

        <Image
          src="/hero/left-top.png"
          alt=""
          width={380}
          height={380}
          className="pointer-events-none absolute left-[-90px] top-[-56px] h-auto w-[34vw] min-w-[220px] max-w-[520px] opacity-95 mix-blend-multiply"
          priority
        />
        <Image
          src="/hero/right.png"
          alt=""
          width={380}
          height={380}
          className="pointer-events-none absolute right-[-150px] top-[-40px] h-auto w-[52vw] min-w-[360px] max-w-[900px] opacity-95 mix-blend-multiply"
          priority
        />
        <Image
          src="/hero/left-bot.png"
          alt=""
          width={360}
          height={360}
          className="pointer-events-none absolute bottom-[-72px] left-[-84px] h-auto w-[30vw] min-w-[220px] max-w-[430px] opacity-95 mix-blend-multiply"
          priority
        />
        <nav className="absolute left-1/2 top-[30px] z-20 flex w-fit -translate-x-1/2 items-center justify-center gap-5 whitespace-nowrap rounded-full bg-white px-7 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:gap-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xl font-semibold leading-none tracking-[-0.02em] text-[#174b24] transition hover:opacity-70"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 w-full max-w-[980px]">
          <div className="mt-24 text-center md:mt-28">
            <h1 className="font-display text-[78px] font-black uppercase leading-[0.94] tracking-[0.02em] text-[#174b24] md:text-[141px]">
              ALL IN
              <br />
              BATTLE
            </h1>
            <p className="mt-[30px] text-[32px] font-medium leading-none text-[#808286]">
              25-26 апреля &nbsp; г. Краснодар
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-[30px]">
              <a
                href="#day-one"
                className="rounded-full bg-[#2a6a34] px-[40px] py-[16px] text-[20px] font-medium leading-none text-white transition hover:bg-[#21562a]"
              >
                Первый день
              </a>
              <a
                href="#day-two"
                className="rounded-full bg-[#2a6a34] px-[40px] py-[16px] text-[20px] font-medium leading-none text-white transition hover:bg-[#21562a]"
              >
                Второй день
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="judges" className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
        <h2 className="text-center font-display text-[80px] font-black uppercase leading-none tracking-tight text-[#2a6a34]">
          JUDGES
        </h2>
        <div className="mx-auto mt-8 grid max-w-[1320px] gap-8 md:grid-cols-3 md:items-start">
          {judges.map((person) => (
            <article
              key={person.name}
              className={`text-center ${person.orderClass}`}
            >
              <div className={`overflow-hidden rounded-[28px] ${person.imageClass}`}>
                <Image
                  src={person.image}
                  alt={person.name}
                  width={420}
                  height={620}
                  className="h-auto w-full object-cover"
                />
              </div>
              <h3 className="mt-6 font-display text-[40px] font-semibold uppercase leading-[0.92] tracking-[-0.01em] text-[#111]">
                {person.name}
              </h3>
              <p className="mt-3 font-body text-[24px] font-bold leading-none text-[#242424]">
                {person.city}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="day-one" className="mx-auto w-full max-w-7xl px-0 pb-16 md:px-6 md:pb-20">
        <h2 className="px-4 pb-4 text-[80px] font-display font-black uppercase leading-none text-[#1b1b1b] md:px-2">
          DJ
        </h2>
        <div className="bg-[#e3e3e3] px-4 py-8 md:rounded-3xl md:px-8 md:py-10">
          <header className="flex items-center justify-between text-[20px] font-bold uppercase tracking-tight md:text-[30px]">
            <h2 className="font-display">ДЕНЬ 1: WORKSHOP / JAM / CONTEST</h2>
            <p>25 апреля</p>
          </header>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {dayOneCards.map((card) => (
              <article
                key={card.title}
                className={`rounded-3xl border border-[rgba(213,213,213,0.6)] bg-[#fafafa] p-6 md:min-h-[722px] md:p-10 ${
                  card.featured
                    ? "md:-mt-4 md:shadow-[0_0_30px_3px_rgba(41,108,51,0.15)]"
                    : ""
                }`}
              >
                <h3 className="font-display text-[42px] font-semibold leading-[1] tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-4 text-[56px] font-bold leading-none text-[#014807]">{card.price}</p>
                <ul className="mt-8 grid gap-3 text-[24px] leading-[1.22]">
                  {card.points.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <button className="mt-10 h-14 w-full rounded-full bg-[#2a6a34] px-5 text-[28px] font-semibold text-white transition hover:bg-[#21562a]">
                  {card.button}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="day-two" className="mx-auto w-full max-w-7xl px-0 pb-16 md:px-6 md:pb-20">
        <h2 className="px-4 pb-4 text-[80px] font-display font-black uppercase leading-none text-[#1b1b1b] md:px-2">
          MC
        </h2>
        <div className="bg-[#e3e3e3] px-4 py-8 md:rounded-3xl md:px-8 md:py-10">
          <header className="flex items-center justify-between text-[20px] font-bold uppercase tracking-tight md:text-[30px]">
            <h2 className="font-display">ДЕНЬ 2: ALL IN BATTLE</h2>
            <p>26 апреля</p>
          </header>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {dayTwoColumns.map((column) => (
              <article
                key={column.title}
                className={`rounded-3xl border border-[rgba(213,213,213,0.6)] bg-[#fafafa] p-6 md:min-h-[674px] md:p-10 ${
                  column.featured
                    ? "md:-mt-4 md:flex md:flex-col md:justify-between md:shadow-[0_0_30px_3px_rgba(41,108,51,0.15)]"
                    : ""
                }`}
              >
                <h3 className="font-display text-[42px] font-semibold leading-[1] tracking-tight">
                  {column.title}
                </h3>
                <ul className="mt-8 grid gap-3 text-[24px] leading-[1.22]">
                  {column.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                {column.button ? (
                  <button className="mt-10 h-14 w-full rounded-full bg-[#2a6a34] px-5 text-[28px] font-semibold text-white transition hover:bg-[#21562a]">
                    {column.button}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="media" className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[80px] font-black uppercase leading-none tracking-tight">
            PHOTO
          </h2>
          <h2 className="font-display text-[80px] font-black uppercase leading-none tracking-tight">
            VIDEO
          </h2>
        </div>
      </section>

      <section id="registration" className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-24">
        <RegistrationForm />
      </section>
    </main>
  );
}
