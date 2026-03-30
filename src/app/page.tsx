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
                href="#dj"
                className="rounded-full bg-[#2a6a34] px-[40px] py-[16px] text-[20px] font-medium leading-none text-white transition hover:bg-[#21562a]"
              >
                Первый день
              </a>
              <a
                href="#mc"
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

      <section id="registration" className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-24">
        <RegistrationForm />
      </section>
    </main>
  );
}
