import Image from "next/image";
import { RegistrationForm } from "@/components/registration-form";

type PersonCardProps = {
  name: string;
  image: string;
  city?: string;
  imageClass?: string;
  orderClass?: string;
  textRotateClass?: string;
};

const navItems = [
  { label: "Судьи", href: "#judges" },
  { label: "DJ", href: "#dj" },
  { label: "MC", href: "#mc" },
  { label: "Media", href: "#media" },
  { label: "Регистрация", href: "#registration" },
];

const judges: PersonCardProps[] = [
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

const djs: PersonCardProps[] = [
  {
    name: "WHYDEAP",
    city: "г. Краснодар",
    image: "/dj/whydeap.jpg",
    imageClass: "-rotate-[2deg]",
    textRotateClass: "md:-rotate-[2deg]",
    orderClass: "md:order-1 md:pt-0",
  },
  {
    name: "ELMI",
    city: "г. Симферополь",
    image: "/dj/elmi.jpg",
    imageClass: "rotate-0",
    orderClass: "md:order-2 md:pt-16",
  },
  {
    name: "BAMBOOK",
    city: "г. Краснодар",
    image: "/dj/bambook.jpg",
    imageClass: "rotate-[2deg]",
    textRotateClass: "md:-rotate-[2deg]",
    orderClass: "md:order-3 md:pt-0",
  },
];

const mcs: PersonCardProps[] = [
  {
    name: "EMILE",
    city: "г. Краснодар",
    image: "/mc/emile.jpg",
    imageClass: "-rotate-[2deg]",
    textRotateClass: "md:-rotate-[2deg]",
  },
  {
    name: "MAVI",
    city: "г. Симферополь",
    image: "/mc/mavi.jpg",
    imageClass: "rotate-[2deg]",
    textRotateClass: "md:-rotate-[2deg]",
  },
];

const dayOneCards = [
  {
    title: "Мастер-Класс от RASH THE FLOW",
    price: "2900₽",
    points: [
      { text: "Длительность:", bullet: "black", tone: "primary" },
      { text: "1,5 часа", bullet: "none", tone: "muted" },
    ],
    button: "Зарегистрироваться на МК",
    variant: "side",
  },
  {
    title: "Contest 3x3",
    price: "900₽",
    points: [
      { text: "Судит:", bullet: "black", tone: "primary" },
      { text: "RASH", bullet: "none", tone: "muted" },
      { text: "Играют:", bullet: "black", tone: "primary" },
      { text: "BAMBOOK/WHYDEAP", bullet: "none", tone: "muted" },
      { text: "Номинации:", bullet: "black", tone: "primary" },
      { text: "KIDS (до 12 лет)", bullet: "none", tone: "muted" },
      { text: "JUN (13-18 лет)", bullet: "none", tone: "muted" },
      { text: "OLD (18+)", bullet: "none", tone: "muted" },
      { text: "Зрительский билет:", bullet: "black", tone: "primary" },
      { text: "600₽", bullet: "none", tone: "muted" },
    ],
    button: "Зарегистрироваться на контест",
    variant: "center",
  },
  {
    title: "JAM",
    price: "600₽",
    points: [
      { text: "Играют:", bullet: "black", tone: "primary" },
      { text: "BAMBOOK/WHYDEAP", bullet: "none", tone: "muted" },
      {
        text: "Участникам Мастер-Класса/Contest 3x3 – джем бесплатный",
        bullet: "red",
        tone: "primary",
      },
    ],
    button: "Зарегистрироваться на джем",
    variant: "side",
  },
];

const dayTwoColumns = [
  {
    title: "Номинации",
    points: [
      { text: "BABY", bullet: "black", tone: "primary" },
      { text: "(до 7 лет)", bullet: "none", tone: "muted" },
      { text: "JUN PRO", bullet: "black", tone: "primary" },
      { text: "(12-15 лет, опыт 3+ года)", bullet: "none", tone: "muted" },
      { text: "KIDS BEG", bullet: "black", tone: "primary" },
      { text: "(7-11 лет, до 3 лет обучения)", bullet: "none", tone: "muted" },
      { text: "BEG 16+", bullet: "black", tone: "primary" },
      { text: "(до 3-х лет обучения)", bullet: "none", tone: "muted" },
      { text: "KIDS PRO", bullet: "black", tone: "primary" },
      { text: "(7-11 лет, опыт 3+ года)", bullet: "none", tone: "muted" },
      { text: "PRO 16+", bullet: "black", tone: "primary" },
      { text: "(опыт 3+ года)", bullet: "none", tone: "muted" },
      { text: "JUN BEG", bullet: "black", tone: "primary" },
      { text: "(12-15 лет, до 3-х лет обучения)", bullet: "none", tone: "muted" },
    ],
    variant: "side",
  },
  {
    title: "Стоимость",
    points: [
      { text: "Первая номинация:", bullet: "black", tone: "primary" },
      { text: "1700₽", bullet: "none", tone: "muted" },
      { text: "Каждая следующая:", bullet: "black", tone: "primary" },
      { text: "800₽", bullet: "none", tone: "muted" },
      { text: "Зрительский билет:", bullet: "black", tone: "primary" },
      { text: "600₽", bullet: "none", tone: "muted" },
    ],
    variant: "center",
    button: "Зарегистрироваться на баттл",
  },
  {
    title: "Важно",
    points: [
      { text: "Место проведения:", bullet: "black", tone: "primary" },
      { text: "Скоро появится!", bullet: "none", tone: "muted" },
      {
        text: "Опыт танцевания определяется категориями BEG (начинающие до 3х лет обучения), PRO (более 3х лет обучения). Организаторы вправе самостоятельно перевести вас в другую категорию при несоответствии уровня BEG/PRO.",
        bullet: "red",
        tone: "primary",
      },
      {
        text: "После того, как вы отправили заявку и зарегистрировались, номинацию поменять нельзя!",
        bullet: "red",
        tone: "primary",
      },
      {
        text: "Возврат денежных средств за участие возможен до 17.04.26 включительно",
        bullet: "red",
        tone: "primary",
      },
    ],
    variant: "side",
  },
];

const sectionHeadingClass =
  "font-display text-[56px] font-black uppercase leading-none tracking-tight text-[#2a6a34] md:text-[80px]";

const personNameClass =
  "mt-6 inline-block whitespace-nowrap font-display text-[40px] font-semibold uppercase leading-[0.92] tracking-[-0.01em] text-[#111]";

const personCityClass = "mt-3 font-body text-[24px] font-bold leading-none text-[#242424]";

function PersonCard({
  name,
  image,
  city,
  imageClass = "",
  orderClass = "",
  textRotateClass = "",
}: PersonCardProps) {
  return (
    <article className={`mx-auto w-full max-w-[420px] text-center ${orderClass}`}>
      <div className={`mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] ${imageClass}`}>
        <Image
          src={image}
          alt={name}
          width={420}
          height={620}
          className="h-auto w-full object-cover"
        />
      </div>
      <h3 className={`${personNameClass} origin-center ${textRotateClass || imageClass}`}>{name}</h3>
      {city ? <p className={personCityClass}>{city}</p> : null}
    </article>
  );
}

function TrioSection({
  id,
  title,
  people,
}: {
  id: string;
  title: string;
  people: PersonCardProps[];
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
      <h2 className={`text-center ${sectionHeadingClass}`}>{title}</h2>
      <div className="mx-auto mt-8 grid max-w-[1400px] gap-8 md:grid-cols-3 md:items-start md:gap-x-16">
        {people.map((person) => (
          <PersonCard key={person.name} {...person} />
        ))}
      </div>
    </section>
  );
}

function FlowerMark({ warning = false }: { warning?: boolean }) {
  return (
    <Image
      src={warning ? "/decor/flower-bullet-red.png" : "/decor/flower-bullet-black.png"}
      alt=""
      width={18}
      height={18}
      className="mt-[2px] h-[18px] w-[18px] shrink-0"
    />
  );
}

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

      <TrioSection id="judges" title="JUDGES" people={judges} />
      <TrioSection id="dj" title="DJ" people={djs} />

      <section id="mc" className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
        <h2 className={`text-center ${sectionHeadingClass}`}>MC</h2>
        <div className="mx-auto mt-8 grid max-w-[1240px] gap-10 md:grid-cols-2 md:gap-x-28">
          {mcs.map((person) => (
            <PersonCard key={person.name} {...person} />
          ))}
        </div>
      </section>

      <section id="media" className="mx-auto w-full max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-start gap-10 md:grid-cols-3">
          <div className="md:pt-10">
            <h2 className={`${sectionHeadingClass} text-left`}>PHOTO</h2>
            <div className="mt-16 max-w-[420px]">
              <PersonCard
                name="VALENTINA"
                image="/photo/valentina.jpg"
                imageClass="-rotate-[1deg]"
                textRotateClass="md:-rotate-[2deg]"
                orderClass="max-w-[420px]"
              />
            </div>
          </div>

          <div className="md:pt-16">
            <PersonCard
              name="RADON"
              image="/video/radon.jpg"
              imageClass="-rotate-[2deg]"
              textRotateClass="md:-rotate-[2deg]"
            />
          </div>

          <div className="md:pt-10">
            <PersonCard
              name="DIMA SOKOLOV"
              image="/video/dima-sokolov.jpg"
              imageClass="rotate-[2deg]"
              textRotateClass="md:-rotate-[2deg]"
            />
            <h2 className="mt-10 text-center font-display text-[56px] font-black uppercase leading-none tracking-tight text-[#2a6a34] md:text-[80px] md:text-left">
              VIDEO
            </h2>
          </div>
        </div>
      </section>

      <section id="day-one" className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8 md:py-16">
        <div className="relative px-2 py-6 md:px-0">
          <Image
            src="/decor/flower-side-left.png"
            alt=""
            width={120}
            height={120}
            className="pointer-events-none absolute -left-2 bottom-24 hidden w-[88px] opacity-85 md:block"
          />
          <Image
            src="/decor/flower-side-right.png"
            alt=""
            width={120}
            height={120}
            className="pointer-events-none absolute -right-2 bottom-24 hidden w-[92px] opacity-85 md:block"
          />
          <header className="mb-12 flex items-start justify-between gap-4 text-[30px] font-display font-black uppercase leading-[0.9] tracking-tight text-[#1b1b1b]">
            <h2>День 1: Workshop / Jam / Contest</h2>
            <p>25 апреля</p>
          </header>
          <div className="relative mt-12 flex flex-col gap-6 md:mt-12 md:flex-row md:items-start md:justify-center">
            {dayOneCards.map((card) => (
              <article
                key={card.title}
                className={`flex flex-col rounded-[28px] border border-[#d0d0d0] bg-[#ececec] ${
                  card.variant === "center"
                    ? "z-20 w-full px-[40px] py-[60px] md:w-[464px] md:min-h-[760px]"
                    : "z-10 w-full px-[50px] py-[40px] md:mt-[20px] md:w-[444px] md:min-h-[720px]"
                } ${
                  card.variant === "center"
                    ? "md:mx-[-24px]"
                    : card.title === "Мастер-Класс от RASH THE FLOW"
                      ? "md:mr-[-24px]"
                      : "md:ml-[-24px]"
                }`}
              >
                <h3 className="h-[68px] text-[28px] leading-[1.1]">
                  <span className="font-body font-bold">{card.title}</span>
                </h3>
                <p className="mt-6 text-[42px] font-bold leading-none text-[#095d13]">{card.price}</p>
                <div className="mt-12 space-y-3 text-[20px] font-semibold leading-[1.2] text-[#1f1f1f]">
                  {card.points.map((line, lineIndex) => (
                    <div key={`${line.text}-${lineIndex}`} className="flex gap-3">
                      {line.bullet === "black" || line.bullet === "red" ? (
                        <FlowerMark warning={line.bullet === "red"} />
                      ) : (
                        <span className="w-4" />
                      )}
                      <p className={line.tone === "muted" ? "text-[#626262]" : "text-[#1f1f1f]"}>{line.text}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-auto w-full rounded-full bg-[#2a6a34] px-6 py-4 text-[18px] font-semibold leading-none text-white transition hover:bg-[#21562a] whitespace-nowrap">
                  {card.button}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="day-two" className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8 md:py-16">
        <div className="relative px-2 py-6 md:px-0">
          <Image
            src="/decor/flower-side-left.png"
            alt=""
            width={120}
            height={120}
            className="pointer-events-none absolute -left-2 top-36 hidden w-[88px] opacity-85 md:block"
          />
          <Image
            src="/decor/flower-side-right.png"
            alt=""
            width={120}
            height={120}
            className="pointer-events-none absolute -right-2 top-36 hidden w-[92px] opacity-85 md:block"
          />
          <header className="mb-12 flex items-start justify-between gap-4 text-[30px] font-display font-black uppercase leading-[0.9] tracking-tight text-[#1b1b1b]">
            <h2>День 2: ALL IN BATTLE</h2>
            <p>26 апреля</p>
          </header>
          <div className="relative mt-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-center">
            {dayTwoColumns.map((column) => (
              <article
                key={column.title}
                className={`flex flex-col rounded-[28px] border border-[#d0d0d0] bg-[#ececec] ${
                  column.variant === "center"
                    ? "z-20 w-full px-[40px] py-[60px] md:w-[464px] md:min-h-[760px]"
                    : "z-10 w-full px-[50px] py-[40px] md:mt-[20px] md:w-[444px] md:min-h-[720px]"
                } ${
                  column.variant === "center"
                    ? "md:mx-[-24px]"
                    : column.title === "Номинации"
                      ? "md:mr-[-24px]"
                      : "md:ml-[-24px]"
                }`}
              >
                <h3 className="font-body text-[28px] font-medium leading-none md:text-[54px]">{column.title}</h3>
                <div className="mt-12 space-y-3 text-[20px] font-semibold leading-[1.2] text-[#1f1f1f]">
                  {column.points.map((line, index) => (
                    <div key={`${line.text}-${index}`} className="flex gap-3">
                      {line.bullet === "black" || line.bullet === "red" ? (
                        <FlowerMark warning={line.bullet === "red"} />
                      ) : (
                        <span className="w-4" />
                      )}
                      <p className={line.tone === "muted" ? "text-[#626262]" : "text-[#1f1f1f]"}>{line.text}</p>
                    </div>
                  ))}
                </div>
                {column.button ? (
                  <button className="mt-auto w-full rounded-full bg-[#2a6a34] px-6 py-4 text-[18px] font-semibold leading-none text-white transition hover:bg-[#21562a] whitespace-nowrap">
                    {column.button}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="registration" className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-24">
        <RegistrationForm />
      </section>
    </main>
  );
}
