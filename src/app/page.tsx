import Image from "next/image";
import { Suspense } from "react";
import { RegistrationForm } from "@/components/registration-form";
import { ProgramRegistrationButton } from "@/components/program-registration-button";
import { ScrollEffectsController } from "@/components/scroll-effects-controller";
import { HeroNavigation } from "@/components/hero-navigation";

type PersonCardProps = {
  name: string;
  image: string;
  city?: string;
  tiltClass?: string;
  orderClass?: string;
  offsetClass?: string;
  revealIndex?: number;
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
    tiltClass:
      "min-[501px]:max-[1023px]:-rotate-[5deg] min-[1024px]:-rotate-[5deg]",
    orderClass:
      "min-[501px]:max-[1023px]:order-1 min-[1024px]:order-1 min-[1024px]:pt-0",
    revealIndex: 1,
  },
  {
    name: "RASH THE FLOW",
    city: "г. Санкт-Петербург",
    image: "/judges/rash-the-flow.jpg",
    tiltClass: "",
    orderClass:
      "min-[501px]:max-[1023px]:order-3 min-[1024px]:order-2 min-[1024px]:pt-16",
    revealIndex: 3,
  },
  {
    name: "RUBA",
    city: "г. Москва",
    image: "/judges/ruba.jpg",
    tiltClass:
      "min-[501px]:max-[1023px]:rotate-[5deg] min-[1024px]:rotate-[5deg]",
    orderClass:
      "min-[501px]:max-[1023px]:order-2 min-[1024px]:order-3 min-[1024px]:pt-0",
    revealIndex: 2,
  },
];

const djs: PersonCardProps[] = [
  {
    name: "WHYDEAP",
    city: "г. Краснодар",
    image: "/dj/whydeap.jpg",
    tiltClass:
      "min-[501px]:max-[1023px]:-rotate-[5deg] min-[1024px]:-rotate-[5deg]",
    orderClass:
      "min-[501px]:max-[1023px]:order-1 min-[1024px]:order-1 min-[1024px]:pt-0",
    revealIndex: 1,
  },
  {
    name: "ELMI",
    city: "г. Симферополь",
    image: "/dj/elmi.jpg",
    tiltClass: "",
    orderClass:
      "min-[501px]:max-[1023px]:order-3 min-[1024px]:order-2 min-[1024px]:pt-16",
    revealIndex: 3,
  },
  {
    name: "BAMBOOK",
    city: "г. Краснодар",
    image: "/dj/bambook.jpg",
    tiltClass:
      "min-[501px]:max-[1023px]:rotate-[5deg] min-[1024px]:rotate-[5deg]",
    orderClass:
      "min-[501px]:max-[1023px]:order-2 min-[1024px]:order-3 min-[1024px]:pt-0",
    revealIndex: 2,
  },
];

const mcs: PersonCardProps[] = [
  {
    name: "EMILE",
    city: "г. Краснодар",
    image: "/mc/emile.jpg",
    tiltClass:
      "min-[501px]:max-[1023px]:-rotate-[5deg] min-[1024px]:-rotate-[5deg]",
    revealIndex: 1,
  },
  {
    name: "MAVI",
    city: "г. Симферополь",
    image: "/mc/mavi.jpg",
    tiltClass:
      "min-[501px]:max-[1023px]:rotate-[5deg] min-[1024px]:rotate-[5deg]",
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
      {
        bullet: "black",
        title: "Место проведения:",
        details: ["Дальняя 43"],
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
      { bullet: "black", title: "Место проведения:", details: ["Калинина 291"] },
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
      { bullet: "black", title: "KIDS BEG", details: ["(7-11 лет, до 3 лет обучения)"] },
      { bullet: "black", title: "KIDS PRO", details: ["(7-11 лет, опыт 3+ года)"] },
      { bullet: "black", title: "JUN BEG", details: ["(12-15 лет, до 3-х лет обучения)"] },
      { bullet: "black", title: "JUN PRO", details: ["(12-15 лет, опыт 3+ года)"] },
      { bullet: "black", title: "BEG 16+", details: ["(до 3-х лет обучения)"] },
      { bullet: "black", title: "PRO", details: ["(опыт 3+ года)"] },
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
      { bullet: "black", title: "Место проведения:", details: ["Калинина 291"] },
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
  "font-display text-[56px] font-black uppercase leading-none tracking-tight text-[#2a6a34] min-[501px]:max-[1023px]:text-[72px] min-[1024px]:text-[80px]";

const personNameClass =
  "mx-auto inline-block max-w-[14ch] whitespace-normal break-words font-display text-[32px] font-semibold uppercase leading-[0.92] tracking-[-0.01em] text-[#111]";

const personCityClass = "mt-3 font-body text-[20px] font-bold leading-none text-[#242424]";

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
      className={`lineup-card mx-auto w-full max-w-[335px] text-center min-[501px]:max-[1023px]:max-w-[260px] min-[501px]:max-[1023px]:justify-self-center min-[1024px]:max-w-[395px] ${orderClass} ${offsetClass}`}
      data-reveal={revealIndex}
    >
      <div className="lineup-card-reveal">
        <div className={`mx-auto w-full max-w-[335px] origin-top min-[501px]:max-[1023px]:max-w-[260px] min-[501px]:max-[1023px]:origin-center min-[1024px]:max-w-[395px] ${tiltClass}`}>
          <div className="mx-auto w-full max-w-[335px] overflow-hidden rounded-[28px] min-[501px]:max-[1023px]:max-w-[260px] min-[1024px]:max-w-[395px]">
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
  completePhase = 4,
}: {
  id: string;
  title: string;
  people: PersonCardProps[];
  completePhase?: number;
}) {
  return (
    <section
      id={id}
      data-snap-section
      data-lineup-anim
      data-complete-phase={completePhase}
      className="snap-section relative mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-16 md:px-8 md:py-24 min-[501px]:max-[1023px]:py-20"
    >
      <h2 className={`lineup-title relative z-10 text-center ${sectionHeadingClass}`}>{title}</h2>
      <div className="mx-auto mt-8 grid w-full max-w-[1400px] justify-items-center gap-8 min-[501px]:max-[1023px]:grid-cols-1 min-[501px]:max-[1023px]:gap-12 min-[1024px]:grid-cols-3 min-[1024px]:items-start min-[1024px]:gap-x-16">
        {people.map((person, index) => (
          <PersonCard key={person.name} revealIndex={person.revealIndex ?? index + 1} {...person} />
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

      <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden py-10 md:min-h-screen">
        <Image
          src="/bg/bg-mob.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none absolute inset-0 object-cover md:hidden"
          priority
        />
        <Image
          src="/bg/bg-tab.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none absolute inset-0 hidden object-cover md:block lg:hidden"
          priority
        />
        <Image
          src="/bg/bg-desk.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none absolute inset-0 hidden object-cover lg:block"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0)_42%,_rgba(30,80,44,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0)_58%,_rgba(71,116,80,0.22)_100%)]" />
        <HeroNavigation items={navItems} />

        <div className="relative z-10 w-full max-w-[980px] px-4">
          <div className="mt-24 text-center md:mt-28">
            <h1 className="font-display text-[58px] font-black uppercase leading-[0.94] tracking-[0.01em] text-[#174b24] min-[375px]:text-[64px] md:text-[140px]">
              ALL IN
              <br />
              BATTLE
            </h1>
            <p className="mt-[26px] inline-flex flex-row items-center justify-center gap-3 text-[20px] font-medium leading-[1.05] text-[#808286] min-[375px]:text-[24px] md:text-[32px] md:leading-none">
              <span className="whitespace-nowrap">25-26 апреля</span>
              <span className="whitespace-nowrap">г. Краснодар</span>
            </p>
            <div className="mt-10 flex flex-row items-center justify-center gap-3 min-[375px]:gap-4">
              <a
                href="#day-one"
                className="rounded-full bg-[#2a6a34] px-6 py-[14px] text-[14px] font-medium leading-none text-white transition hover:bg-[#21562a] min-[375px]:px-8 md:px-[40px] md:py-[16px] md:text-[20px]"
              >
                Первый день
              </a>
              <a
                href="#day-two"
                className="rounded-full bg-[#2a6a34] px-6 py-[14px] text-[14px] font-medium leading-none text-white transition hover:bg-[#21562a] min-[375px]:px-8 md:px-[40px] md:py-[16px] md:text-[20px]"
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
        data-complete-phase="3"
        className="snap-section relative mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-16 md:px-8 md:py-24 min-[501px]:max-[1023px]:py-20"
      >
        <h2 className={`lineup-title relative z-10 text-center ${sectionHeadingClass}`}>MC</h2>
        <div className="mx-auto mt-8 grid max-w-[1240px] gap-10 min-[501px]:max-[1023px]:grid-cols-1 min-[501px]:max-[1023px]:gap-12 min-[1024px]:grid-cols-2 min-[1024px]:gap-x-28">
          {mcs.map((person, index) => (
            <PersonCard key={person.name} revealIndex={(index + 1) as 1 | 2 | 3} {...person} />
          ))}
        </div>
      </section>

      <section
        id="media"
        data-snap-section
        data-lineup-anim
        data-complete-phase="5"
        data-lineup-kind="media"
        className="snap-section relative mx-auto w-full max-w-[1440px] overflow-hidden px-5 py-16 md:px-8 md:py-24 min-[501px]:max-[1023px]:py-20"
      >
        <div className="grid items-start gap-10 min-[501px]:max-[1023px]:grid-cols-1 min-[1024px]:grid-cols-3">
          <div className="order-1 min-[1024px]:order-none min-[1024px]:pt-10">
            <h2 className={`lineup-title relative z-10 text-center ${sectionHeadingClass} min-[1024px]:text-left`}>
              PHOTO
            </h2>
            <div className="mt-16 mx-auto max-w-[395px] min-[1024px]:mx-0">
              <PersonCard
                name="VALENTINA"
                image="/photo/valentina.jpg"
                tiltClass="min-[501px]:max-[1023px]:-rotate-[2deg] min-[1024px]:-rotate-[2deg]"
                orderClass="max-w-[395px]"
                revealIndex={1}
              />
            </div>
          </div>

          <div className="order-3 mt-12 min-[1024px]:hidden">
            <h2 className="lineup-video-title text-center font-display text-[56px] font-black uppercase leading-none tracking-tight text-[#2a6a34] min-[501px]:max-[1023px]:text-[72px]">
              VIDEO
            </h2>
          </div>

          <div className="order-4 min-[1024px]:order-none min-[1024px]:pt-16">
            <PersonCard
              name="RADON"
              image="/video/radon.jpg"
              tiltClass="min-[501px]:max-[1023px]:-rotate-[5.5deg] min-[1024px]:-rotate-[5.5deg]"
              offsetClass="min-[1024px]:-translate-x-12"
              revealIndex={4}
            />
          </div>

          <div className="order-5 min-[1024px]:order-none min-[1024px]:pt-10">
            <PersonCard
              name="DIMA SOKOLOV"
              image="/video/dima-sokolov.jpg"
              tiltClass="min-[501px]:max-[1023px]:rotate-[6deg] min-[1024px]:rotate-[6deg]"
              offsetClass="min-[1024px]:translate-x-12"
              revealIndex={4}
            />
            <h2 className="lineup-video-title mt-10 hidden text-center font-display text-[56px] font-black uppercase leading-none tracking-tight text-[#2a6a34] min-[1024px]:relative min-[1024px]:left-[-240px] min-[1024px]:block min-[1024px]:text-center min-[1024px]:text-[80px]">
              VIDEO
            </h2>
          </div>
        </div>
      </section>

      <section id="day-one" className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8 md:py-16">
        <div className="relative px-2 py-6 md:px-0">
          <header className="mb-10 flex flex-col items-start gap-3 text-[24px] font-display font-black uppercase leading-[0.9] tracking-tight text-[#1b1b1b] md:mb-12 md:flex-row md:items-start md:justify-between md:gap-4 min-[1024px]:text-[30px]">
            <h2>День 1: Workshop / Jam / Contest</h2>
            <p>25 апреля</p>
          </header>
          <div className="relative mt-8 flex flex-col gap-4 md:mt-12 min-[501px]:max-[1023px]:grid min-[501px]:max-[1023px]:grid-cols-2 min-[501px]:max-[1023px]:items-start min-[501px]:max-[1023px]:gap-4 min-[1024px]:flex min-[1024px]:flex-row min-[1024px]:items-start min-[1024px]:justify-center min-[1024px]:gap-6">
            {dayOneCards.map((card) => (
              <article
                key={card.title}
                className={`relative flex flex-col overflow-hidden rounded-[28px] border border-[#dde1de] ${
                  card.variant === "center"
                    ? "order-2 z-20 w-full bg-[#fafafa] px-6 py-8 shadow-[0_0_30px_3px_rgba(41,108,51,0.15)] min-[501px]:max-[1023px]:col-start-1 min-[501px]:max-[1023px]:col-end-2 min-[501px]:max-[1023px]:translate-y-[20px] min-[501px]:max-[1023px]:min-h-[560px] min-[1024px]:w-[464px] min-[1024px]:min-h-[760px] min-[1024px]:px-[40px] min-[1024px]:py-[60px]"
                    : card.title === "JAM"
                      ? "order-3 z-10 mt-[-56px] w-[calc(100%-20px)] self-center bg-[#fafafa] px-6 pb-8 pt-[84px] min-[501px]:max-[1023px]:order-3 min-[501px]:max-[1023px]:mt-[40px] min-[501px]:max-[1023px]:w-[calc(100%-18px)] min-[501px]:max-[1023px]:self-center min-[501px]:max-[1023px]:px-6 min-[501px]:max-[1023px]:pb-8 min-[501px]:max-[1023px]:pt-8 min-[501px]:max-[1023px]:min-h-[520px] min-[1024px]:mt-[20px] min-[1024px]:w-[444px] min-[1024px]:min-h-[720px] min-[1024px]:self-start min-[1024px]:px-[50px] min-[1024px]:py-[40px]"
                      : "order-1 z-10 w-full bg-[#fafafa] px-6 py-8 min-[501px]:max-[1023px]:col-span-2 min-[1024px]:mt-[20px] min-[1024px]:w-[444px] min-[1024px]:min-h-[720px] min-[1024px]:px-[50px] min-[1024px]:py-[40px]"
                } ${
                  card.variant === "center"
                    ? "min-[1024px]:mx-[-24px]"
                    : card.title === "Мастер-Класс от RASH THE FLOW"
                      ? "min-[1024px]:mr-[-24px]"
                      : "min-[1024px]:ml-[-24px]"
                }`}
              >
                <h3 className="h-[40px] font-body text-[18px] font-bold leading-[1.1] min-[1024px]:h-[68px] min-[1024px]:text-[28px]">
                  {card.title}
                </h3>
                <p className="mt-4 text-[32px] font-bold leading-none text-[#095d13] min-[1024px]:mt-6 min-[1024px]:text-[42px]">
                  {card.price}
                </p>
                <div className="mt-8 space-y-4 text-[16px] font-semibold leading-[1.2] text-[#1f1f1f] min-[1024px]:mt-12 min-[1024px]:text-[20px]">
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
                    className={`mt-12 block w-full rounded-full bg-[#2a6a34] px-6 py-4 text-center text-[14px] font-semibold leading-none text-white transition hover:bg-[#21562a] whitespace-nowrap min-[1024px]:text-[18px] ${
                    card.title === "Мастер-Класс от RASH THE FLOW"
                      ? "min-[501px]:max-[1023px]:mt-[48px] min-[1024px]:mt-auto"
                      : card.title === "Contest 3x3"
                        ? "min-[501px]:max-[1023px]:mt-12 min-[1024px]:!mt-12"
                      : "min-[501px]:max-[1023px]:mt-auto min-[1024px]:mt-auto"
                  }`}
                >
                  {card.button}
                </ProgramRegistrationButton>
              </article>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3">
            <FlowerMark warning />
            <p className="text-[16px] font-semibold leading-[1.2] text-[#1f1f1f] min-[1024px]:text-[20px]">
              Возврат денежных средств за участие в jam/contest/workshop возможен до 17.04.2026
              включительно
            </p>
          </div>
        </div>
      </section>

      <section id="day-two" className="mx-auto w-full max-w-[1440px] px-5 py-10 md:px-8 md:py-16">
        <div className="relative px-2 py-6 md:px-0">
          <header className="mb-10 flex flex-col items-start gap-3 text-[24px] font-display font-black uppercase leading-[0.9] tracking-tight text-[#1b1b1b] md:mb-12 md:flex-row md:items-start md:justify-between md:gap-4 min-[1024px]:text-[30px]">
            <h2>День 2: ALL IN BATTLE</h2>
            <p>26 апреля</p>
          </header>
          <div className="relative mt-8 flex flex-col gap-4 md:mt-12 min-[501px]:max-[1023px]:grid min-[501px]:max-[1023px]:grid-cols-2 min-[501px]:max-[1023px]:items-start min-[501px]:max-[1023px]:gap-4 min-[1024px]:flex min-[1024px]:flex-row min-[1024px]:items-start min-[1024px]:justify-center min-[1024px]:gap-6">
            {dayTwoColumns.map((column) => (
              <article
                key={column.title}
                className={`relative flex flex-col overflow-hidden rounded-[28px] border border-[#dde1de] ${
                  column.title === "Стоимость"
                    ? "order-1 z-10 w-full bg-[#fafafa] px-6 py-8 min-[501px]:max-[1023px]:col-span-2 min-[501px]:max-[1023px]:min-h-[420px] min-[1024px]:mt-[20px] min-[1024px]:w-[444px] min-[1024px]:min-h-[720px] min-[1024px]:px-[50px] min-[1024px]:py-[40px]"
                    : column.title === "Номинации"
                      ? "order-2 z-20 w-full bg-[#fafafa] px-6 py-8 shadow-[0_0_30px_3px_rgba(41,108,51,0.15)] min-[501px]:max-[1023px]:translate-y-[20px] min-[501px]:max-[1023px]:min-h-[560px] min-[1024px]:w-[464px] min-[1024px]:min-h-[760px] min-[1024px]:px-[40px] min-[1024px]:py-[60px]"
                      : "order-3 z-10 mt-[-56px] w-[calc(100%-20px)] self-center bg-[#fafafa] px-6 pb-8 pt-[84px] min-[501px]:max-[1023px]:mt-[40px] min-[501px]:max-[1023px]:w-[calc(100%-18px)] min-[501px]:max-[1023px]:self-center min-[501px]:max-[1023px]:px-6 min-[501px]:max-[1023px]:pb-8 min-[501px]:max-[1023px]:pt-8 min-[501px]:max-[1023px]:min-h-[520px] min-[1024px]:mt-[20px] min-[1024px]:w-[444px] min-[1024px]:min-h-[720px] min-[1024px]:px-[50px] min-[1024px]:py-[40px]"
                } ${
                  column.title === "Номинации"
                    ? "min-[1024px]:mx-[-24px]"
                    : column.title === "Стоимость"
                      ? "min-[1024px]:mr-[-24px]"
                      : "min-[1024px]:ml-[-24px]"
                }`}
              >
                <h3 className="h-[40px] font-body text-[18px] font-bold leading-[1.1] min-[1024px]:h-auto min-[1024px]:text-[28px]">
                  {column.title}
                </h3>
                <div className="mt-8 space-y-4 text-[16px] font-semibold leading-[1.2] text-[#1f1f1f] min-[1024px]:mt-12 min-[1024px]:text-[20px]">
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
                {column.title === "Стоимость" ? (
                  <Image
                    src="/decor/flower-side-right.png"
                    alt=""
                    width={112}
                    height={112}
                    className="pointer-events-none absolute right-[8px] top-[10px] w-[124px] opacity-85 min-[1024px]:hidden"
                  />
                ) : null}
                {column.button ? (
                  <ProgramRegistrationButton
                    clearSelection
                    className="mt-12 block w-full rounded-full bg-[#2a6a34] px-6 py-4 text-center text-[14px] font-semibold leading-none text-white transition hover:bg-[#21562a] whitespace-nowrap min-[1024px]:mt-auto min-[1024px]:text-[18px]"
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
          className="pointer-events-none absolute bottom-0 left-[-64px] h-auto w-[44vw] min-w-[320px] max-w-[700px] md:left-[-56px]"
        />
        <Image
          src="/decor/footer-right.jpg"
          alt=""
          width={420}
          height={420}
          className="pointer-events-none absolute bottom-0 right-[-44px] h-auto w-[34vw] min-w-[270px] max-w-[580px] md:right-[-36px]"
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











