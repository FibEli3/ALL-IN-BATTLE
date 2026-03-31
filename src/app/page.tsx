import Image from "next/image";
import { Suspense } from "react";
import { RegistrationForm } from "@/components/registration-form";
import { ProgramRegistrationButton } from "@/components/program-registration-button";
import { ScrollEffectsController } from "@/components/scroll-effects-controller";

type PersonCardProps = {
  name: string;
  image: string;
  city?: string;
  tiltClass?: string;
  orderClass?: string;
  offsetClass?: string;
  revealIndex?: 1 | 2 | 3;
};

type BulletTone = "black" | "red";

type DayListItem = {
  bullet: BulletTone;
  title: string;
  details?: string[];
};

type DayCard = {
  title: string;
  price?: string;
  items: DayListItem[];
  button?: string;
  registrationPresetId?: string;
  focusOnly?: boolean;
  variant: "side" | "center";
  decor?: "left-bottom" | "right-mid" | "right-top";
};

const navItems = [
  { label: "Судьи", href: "#judges" },
  { label: "DJ", href: "#dj" },
  { label: "MC", href: "#mc" },
  { label: "Media", href: "#media" },
  { label: "Регистрация", href: "#registration" },
];

const footerLinks = [
  { label: "TELEGRAM", href: "https://t.me/all_in_battle" },
  { label: "VKONTAKTE", href: "https://vk.ru/allinbattlehop" },
  {
    label: "INSTAGRAMM",
    href: "https://www.instagram.com/all_in_battlehop?igsh=MTZtODN6YmlnbTdyNg==",
  },
];

const judges: PersonCardProps[] = [
  {
    name: "ASHPI",
    city: "г. Донецк",
    image: "/judges/ashpi.jpg",
    tiltClass: "md:-rotate-[5deg]",
    orderClass: "md:order-1 md:pt-0",
    revealIndex: 1,
  },
  {
    name: "RASH THE FLOW",
    city: "г. Санкт-Петербург",
    image: "/judges/rash-the-flow.jpg",
    tiltClass: "",
    orderClass: "md:order-2 md:pt-16",
    revealIndex: 3,
  },
  {
    name: "RUBA",
    city: "г. Москва",
    image: "/judges/ruba.jpg",
    tiltClass: "md:rotate-[5deg]",
    orderClass: "md:order-3 md:pt-0",
    revealIndex: 2,
  },
];

const djs: PersonCardProps[] = [
  {
    name: "WHYDEAP",
    city: "г. Краснодар",
    image: "/dj/whydeap.jpg",
    tiltClass: "md:-rotate-[5deg]",
    orderClass: "md:order-1 md:pt-0",
    revealIndex: 1,
  },
  {
    name: "ELMI",
    city: "г. Симферополь",
    image: "/dj/elmi.jpg",
    tiltClass: "",
    orderClass: "md:order-2 md:pt-16",
    revealIndex: 3,
  },
  {
    name: "BAMBOOK",
    city: "г. Краснодар",
    image: "/dj/bambook.jpg",
    tiltClass: "md:rotate-[5deg]",
    orderClass: "md:order-3 md:pt-0",
    revealIndex: 2,
  },
];

const mcs: PersonCardProps[] = [
  {
    name: "EMILE",
    city: "г. Краснодар",
    image: "/mc/emile.jpg",
    tiltClass: "md:-rotate-[5deg]",
    revealIndex: 1,
  },
  {
    name: "MAVI",
    city: "г. Симферополь",
    image: "/mc/mavi.jpg",
    tiltClass: "md:rotate-[5deg]",
    revealIndex: 2,
  },
];

const dayOneCards: DayCard[] = [
  {
    title: "Мастер-Класс от RASH THE FLOW",
    price: "2900₽",
    items: [
      {
        bullet: "black",
        title: "Длительность:",
        details: ["1,5 часа"],
      },
    ],
    button: "Зарегистрироваться на МК",
    registrationPresetId: "day1-option-1",
    variant: "side",
    decor: "left-bottom",
  },
  {
    title: "Contest 3x3",
    price: "900₽",
    items: [
      { bullet: "black", title: "Судит:", details: ["RASH"] },
      { bullet: "black", title: "Играют:", details: ["BAMBOOK/WHYDEAP"] },
      {
        bullet: "black",
        title: "Номинации:",
        details: ["KIDS (до 12 лет)", "JUN (13-18 лет)", "OLD (18+)"],
      },
      { bullet: "black", title: "Зрительский билет:", details: ["700₽"] },
    ],
    button: "Зарегистрироваться на контест",
    registrationPresetId: "day1-option-2",
    variant: "center",
  },
  {
    title: "JAM",
    price: "600₽",
    items: [
      { bullet: "black", title: "Играют:", details: ["BAMBOOK/WHYDEAP"] },
      {
        bullet: "red",
        title: "Участникам Мастер-Класса/Contest 3x3 – джем бесплатный",
      },
    ],
    button: "Зарегистрироваться на джем",
    registrationPresetId: "day1-option-3",
    variant: "side",
    decor: "right-mid",
  },
];

const dayTwoColumns: DayCard[] = [
  {
    title: "Номинации",
    items: [
      { bullet: "black", title: "BABY", details: ["(до 7 лет)"] },
      { bullet: "black", title: "JUN PRO", details: ["(12-15 лет, опыт 3+ года)"] },
      { bullet: "black", title: "KIDS BEG", details: ["(7-11 лет, до 3 лет обучения)"] },
      { bullet: "black", title: "BEG 16+", details: ["(до 3-х лет обучения)"] },
      { bullet: "black", title: "KIDS PRO", details: ["(7-11 лет, опыт 3+ года)"] },
      { bullet: "black", title: "PRO 16+", details: ["(опыт 3+ года)"] },
      { bullet: "black", title: "JUN BEG", details: ["(12-15 лет, до 3-х лет обучения)"] },
    ],
    variant: "side",
  },
  {
    title: "Стоимость",
    items: [
      { bullet: "black", title: "Первая номинация:", details: ["1700₽"] },
      { bullet: "black", title: "Каждая следующая:", details: ["800₽"] },
      { bullet: "black", title: "Зрительский билет:", details: ["700₽"] },
    ],
    variant: "center",
    button: "Зарегистрироваться на баттл",
    focusOnly: true,
  },
  {
    title: "Важно",
    items: [
      { bullet: "black", title: "Место проведения:", details: ["Скоро появится!"] },
      {
        bullet: "red",
        title:
          "Опыт танцевания определяется категориями BEG (начинающие до 3х лет обучения), PRO (более 3х лет обучения). Организаторы вправе самостоятельно перевести вас в другую категорию при несоответствии уровня BEG/PRO.",
      },
      {
        bullet: "red",
        title: "После того, как вы отправили заявку и зарегистрировались, номинацию поменять нельзя!",
      },
      {
        bullet: "red",
        title: "Возврат денежных средств за участие возможен до 17.04.26 включительно",
      },
    ],
    variant: "side",
    decor: "right-top",
  },
];

const sectionHeadingClass =
  "font-display text-[56px] font-black uppercase leading-none tracking-tight text-[#2a6a34] md:text-[80px]";

const personNameClass =
  "inline-block whitespace-nowrap font-display text-[40px] font-semibold uppercase leading-[0.92] tracking-[-0.01em] text-[#111]";

const personCityClass = "mt-3 font-body text-[24px] font-bold leading-none text-[#242424]";

function PersonCard({
  name,
  image,
  city,
  tiltClass = "",
  orderClass = "",
  offsetClass = "",
  revealIndex,
}: PersonCardProps) {
  return (
    <article
      className={`lineup-card mx-auto w-full max-w-[395px] text-center ${orderClass} ${offsetClass}`}
      data-reveal={revealIndex}
    >
      <div className="lineup-card-reveal">
        <div className={`mx-auto w-full max-w-[395px] origin-top ${tiltClass}`}>
          <div className="mx-auto w-full max-w-[395px] overflow-hidden rounded-[28px]">
            <Image
              src={image}
              alt={name}
              width={395}
              height={519}
              className="aspect-[395/519] h-auto w-full object-cover"
            />
          </div>
          <div className="mt-6">
            <h3 className={personNameClass}>{name}</h3>
            {city ? <p className={personCityClass}>{city}</p> : null}
          </div>
        </div>
      </div>
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
    <section
      id={id}
      data-snap-section
      data-lineup-anim
      className="snap-section relative mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-16 md:px-8 md:py-24"
    >
      <Image
        src="/bg.png"
        alt=""
        width={560}
        height={560}
        className="lineup-rotating-bg pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-[34vw] min-w-[260px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-20"
      />
      <h2 className={`lineup-title relative z-10 text-center ${sectionHeadingClass}`}>{title}</h2>
      <div className="mx-auto mt-8 grid max-w-[1400px] gap-8 md:grid-cols-3 md:items-start md:gap-x-16">
        {people.map((person, index) => (
          <PersonCard
            key={person.name}
            revealIndex={person.revealIndex ?? ((index + 1) as 1 | 2 | 3)}
            {...person}
          />
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
      width={26}
      height={23}
      className="mt-[1px] h-[23px] w-[26px] shrink-0"
    />
  );
}

export default function Home() {
  return (
    <main className="bg-white font-body text-[#1b1b1b]">
      <ScrollEffectsController />

      <section
        data-snap-section
        className="snap-section relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
      >
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

      <section
        id="mc"
        data-snap-section
        data-lineup-anim
        className="snap-section relative mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-16 md:px-8 md:py-24"
      >
        <Image
          src="/bg.png"
          alt=""
          width={560}
          height={560}
          className="lineup-rotating-bg pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-[34vw] min-w-[260px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-20"
        />
        <h2 className={`lineup-title relative z-10 text-center ${sectionHeadingClass}`}>MC</h2>
        <div className="mx-auto mt-8 grid max-w-[1240px] gap-10 md:grid-cols-2 md:gap-x-28">
          {mcs.map((person, index) => (
            <PersonCard key={person.name} revealIndex={(index + 1) as 1 | 2 | 3} {...person} />
          ))}
        </div>
      </section>

      <section
        id="media"
        data-snap-section
        data-lineup-anim
        className="snap-section relative mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-16 md:px-8 md:py-24"
      >
        <Image
          src="/bg.png"
          alt=""
          width={560}
          height={560}
          className="lineup-rotating-bg pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-[34vw] min-w-[260px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-20"
        />
        <div className="grid items-start gap-10 md:grid-cols-3">
          <div className="md:pt-10">
            <h2 className={`lineup-title relative z-10 ${sectionHeadingClass} text-left`}>PHOTO</h2>
            <div className="mt-16 max-w-[420px]">
              <PersonCard
                name="VALENTINA"
                image="/photo/valentina.jpg"
                tiltClass="md:-rotate-[2deg]"
                orderClass="max-w-[395px]"
                revealIndex={1}
              />
            </div>
          </div>

          <div className="md:pt-16">
            <PersonCard
              name="RADON"
              image="/video/radon.jpg"
              tiltClass="md:-rotate-[5.5deg]"
              offsetClass="md:-translate-x-12"
              revealIndex={2}
            />
          </div>

          <div className="md:pt-10">
            <PersonCard
              name="DIMA SOKOLOV"
              image="/video/dima-sokolov.jpg"
              tiltClass="md:rotate-[6deg]"
              offsetClass="md:translate-x-12"
              revealIndex={3}
            />
            <h2 className="lineup-video-title mt-10 text-center font-display text-[56px] font-black uppercase leading-none tracking-tight text-[#2a6a34] md:relative md:left-[-240px] md:text-center md:text-[80px]">
              VIDEO
            </h2>
          </div>
        </div>
      </section>

      <section
        id="day-one"
        data-snap-section
        className="snap-section mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8 md:py-16"
      >
        <div className="relative px-2 py-6 md:px-0">
          <header className="mb-12 flex items-start justify-between gap-4 text-[30px] font-display font-black uppercase leading-[0.9] tracking-tight text-[#1b1b1b]">
            <h2>День 1: Workshop / Jam / Contest</h2>
            <p>25 апреля</p>
          </header>
          <div className="relative mt-12 flex flex-col gap-6 md:mt-12 md:flex-row md:items-start md:justify-center">
            {dayOneCards.map((card) => (
              <article
                key={card.title}
                className={`relative flex flex-col overflow-hidden rounded-[28px] border border-[#dde1de] ${
                  card.variant === "center"
                    ? "z-20 w-full bg-[#fafafa] px-[40px] py-[60px] md:w-[464px] md:min-h-[760px] md:shadow-[0_0_30px_3px_rgba(41,108,51,0.15)]"
                    : "z-10 w-full bg-[#fafafa] px-[50px] py-[40px] md:mt-[20px] md:w-[444px] md:min-h-[720px]"
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
                <div className="mt-12 space-y-4 text-[20px] font-semibold leading-[1.2] text-[#1f1f1f]">
                  {card.items.map((item, itemIndex) => (
                    <div key={`${item.title}-${itemIndex}`} className="flex gap-3">
                      <FlowerMark warning={item.bullet === "red"} />
                      <div className="pt-[1px]">
                        <p className="text-[#1f1f1f]">{item.title}</p>
                        {item.details ? (
                          <div className="mt-[10px] space-y-2 text-[#626262]">
                            {item.details.map((detail) => (
                              <p key={`${item.title}-${detail}`}>{detail}</p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                {card.decor === "left-bottom" ? (
                  <Image
                    src="/decor/flower-side-left.png"
                    alt=""
                    width={110}
                    height={110}
                    className="pointer-events-none absolute left-[8px] bottom-20 w-[132px] opacity-85"
                  />
                ) : null}
                {card.decor === "right-mid" ? (
                  <Image
                    src="/decor/flower-side-right.png"
                    alt=""
                    width={110}
                    height={110}
                    className="pointer-events-none absolute right-[8px] bottom-[170px] w-[132px] opacity-85"
                  />
                ) : null}
                <ProgramRegistrationButton
                  presetId={card.registrationPresetId}
                  clearSelection
                  className="mt-auto block w-full rounded-full bg-[#2a6a34] px-6 py-4 text-center text-[18px] font-semibold leading-none text-white transition hover:bg-[#21562a] whitespace-nowrap"
                >
                  {card.button}
                </ProgramRegistrationButton>
              </article>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3">
            <FlowerMark warning />
            <p className="text-[20px] font-semibold leading-[1.2] text-[#1f1f1f]">
              Возврат денежных средств за участие в jam/contest/workshop возможен до 17.04.2026
              включительно
            </p>
          </div>
        </div>
      </section>

      <section
        id="day-two"
        data-snap-section
        className="snap-section mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8 md:py-16"
      >
        <div className="relative px-2 py-6 md:px-0">
          <header className="mb-12 flex items-start justify-between gap-4 text-[30px] font-display font-black uppercase leading-[0.9] tracking-tight text-[#1b1b1b]">
            <h2>День 2: ALL IN BATTLE</h2>
            <p>26 апреля</p>
          </header>
          <div className="relative mt-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-center">
            {dayTwoColumns.map((column) => (
              <article
                key={column.title}
                className={`relative flex flex-col overflow-hidden rounded-[28px] border border-[#dde1de] ${
                  column.variant === "center"
                    ? "z-20 w-full bg-[#fafafa] px-[40px] py-[60px] md:w-[464px] md:min-h-[760px] md:shadow-[0_0_30px_3px_rgba(41,108,51,0.15)]"
                    : "z-10 w-full bg-[#fafafa] px-[50px] py-[40px] md:mt-[20px] md:w-[444px] md:min-h-[720px]"
                } ${
                  column.variant === "center"
                    ? "md:mx-[-24px]"
                    : column.title === "Номинации"
                      ? "md:mr-[-24px]"
                      : "md:ml-[-24px]"
                }`}
              >
                <h3 className="font-body text-[28px] font-bold leading-[1.1]">{column.title}</h3>
                <div className="mt-12 space-y-4 text-[20px] font-semibold leading-[1.2] text-[#1f1f1f]">
                  {column.items.map((item, itemIndex) => (
                    <div key={`${item.title}-${itemIndex}`} className="flex gap-3">
                      <FlowerMark warning={item.bullet === "red"} />
                      <div className="pt-[1px]">
                        <p className="text-[#1f1f1f]">{item.title}</p>
                        {item.details ? (
                          <div className="mt-[10px] space-y-2 text-[#626262]">
                            {item.details.map((detail) => (
                              <p key={`${item.title}-${detail}`}>{detail}</p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                {column.decor === "right-top" ? (
                  <Image
                    src="/decor/flower-side-right.png"
                    alt=""
                    width={116}
                    height={116}
                    className="pointer-events-none absolute right-[8px] top-[10px] w-[136px] opacity-85"
                  />
                ) : null}
                {column.button ? (
                  <ProgramRegistrationButton
                    clearSelection
                    className="mt-auto block w-full rounded-full bg-[#2a6a34] px-6 py-4 text-center text-[18px] font-semibold leading-none text-white transition hover:bg-[#21562a] whitespace-nowrap"
                  >
                    {column.button}
                  </ProgramRegistrationButton>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="registration" className="mx-auto w-full max-w-[1440px] px-5 pb-20 md:px-8 md:pb-24">
        <Suspense fallback={null}>
          <RegistrationForm />
        </Suspense>
      </section>

      <footer className="relative overflow-hidden px-5 pb-28 pt-10 md:px-8 md:pb-40 md:pt-16">
        <Image
          src="/decor/footer-left.jpg"
          alt=""
          width={520}
          height={420}
          className="pointer-events-none absolute bottom-0 left-[-40px] h-auto w-[44vw] min-w-[320px] max-w-[700px]"
        />
        <Image
          src="/decor/footer-right.jpg"
          alt=""
          width={420}
          height={420}
          className="pointer-events-none absolute bottom-0 right-[-20px] h-auto w-[34vw] min-w-[270px] max-w-[580px]"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] justify-center">
          <div className="flex flex-col items-center gap-5 text-center md:gap-7">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 font-display text-[32px] font-black uppercase leading-none text-[#131417] transition hover:opacity-80 md:text-[50px]"
              >
                <span>{link.label}</span>
                <Image
                  src="/decor/arrow.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="h-[22px] w-[22px] md:h-[34px] md:w-[34px]"
                />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}











