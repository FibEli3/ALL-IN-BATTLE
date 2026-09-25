import Image from "next/image";
import { Suspense } from "react";
import {
  ArrowDownRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { HeroNavigation } from "@/components/hero-navigation";
import { ProgramRegistrationButton } from "@/components/program-registration-button";
import { RegistrationForm } from "@/components/registration-form";
import { ScrollEffectsController } from "@/components/scroll-effects-controller";

type Person = {
  name: string;
  role: string;
  city?: string;
  image: string;
};

const navItems = [
  { label: "Судьи", href: "#judges" },
  { label: "Программа", href: "#program" },
  { label: "Команда", href: "#team" },
  { label: "Регистрация", href: "#registration" },
];

const judges: Person[] = [
  { name: "GLADI", role: "Судья", city: "Симферополь", image: "/event/people/gladi-optimized.webp" },
  { name: "PRADAZOMBIE", role: "Судья", city: "Ницца, Франция", image: "/event/people/pradazombie-optimized.webp" },
  { name: "KHARKOVSKAYA", role: "Судья", city: "Санкт-Петербург", image: "/event/people/kharkovskaya-optimized.webp" },
];

const djs: Person[] = [
  { name: "CHEREPASHKA", role: "DJ", city: "Санкт-Петербург", image: "/event/people/cherepashka-optimized.webp" },
  { name: "WHYDEAP", role: "DJ", city: "Краснодар", image: "/event/people/whydeap-optimized.webp" },
  { name: "ALBERT FTH", role: "DJ", city: "Горячий Ключ", image: "/event/people/albert-fth-optimized.webp" },
];

const mcs: Person[] = [
  { name: "MAVI", role: "MC", city: "Симферополь", image: "/event/people/mavi-optimized.webp" },
  { name: "ARTEM TITUKH", role: "MC", city: "Горячий Ключ", image: "/event/people/artem-titukh-optimized.webp" },
];

const media: Person[] = [
  { name: "ALESYAAA", role: "Видео", image: "/event/people/alesyaaa-optimized.webp" },
  { name: "RADON", role: "Видео", image: "/event/people/radon-optimized.webp" },
  { name: "YASHNAYA ELENA", role: "Фото", image: "/event/people/yashnaya-elena-optimized.webp" },
];

const dayTwoCategories = [
  ["BABY", "до 7 лет"],
  ["KIDS BEG", "7–11 лет · до 3 лет обучения"],
  ["KIDS PRO", "7–11 лет · опыт от 3 лет"],
  ["JUN BEG", "12–15 лет · до 3 лет обучения"],
  ["JUN PRO", "12–15 лет · опыт от 3 лет"],
  ["BEG 16+", "до 3 лет обучения"],
  ["PRO", "опыт от 3 лет"],
];

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="section-header" data-reveal>
      <p>{kicker}</p>
      <h2>{title}</h2>
    </header>
  );
}

function PortraitCard({ person, index }: { person: Person; index: number }) {
  return (
    <article className="portrait-card" data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}>
      <div className="portrait-frame">
        <Image
          src={person.image}
          alt={`${person.name} — ${person.role}`}
          width={2480}
          height={3306}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 31vw"
          className="portrait-image"
          unoptimized
        />
      </div>
      <div className="portrait-caption">
        <div><p>{person.role}</p><h3>{person.name}</h3></div>
        {person.city ? <span>{person.city}</span> : null}
      </div>
    </article>
  );
}

function LineupSection({ id, eyebrow, title, people }: { id: string; eyebrow: string; title: string; people: Person[] }) {
  return (
    <section id={id} className="site-section lineup-section">
      <SectionHeader kicker={eyebrow} title={title} />
      <div className={`lineup-grid ${people.length === 2 ? "lineup-grid-two" : ""}`}>
        {people.map((person, index) => <PortraitCard key={person.name} person={person} index={index} />)}
      </div>
    </section>
  );
}

function RegisterButton({ label, presetId, clearSelection }: { label: string; presetId?: string; clearSelection?: boolean }) {
  return (
    <ProgramRegistrationButton presetId={presetId} clearSelection={clearSelection} className="text-link-button">
      <span>{label}</span><ArrowDownRightIcon className="action-arrow" aria-hidden="true" />
    </ProgramRegistrationButton>
  );
}

export default function Home() {
  return (
    <main>
      <ScrollEffectsController />

      <section className="hero" id="top">
        <HeroNavigation items={navItems} />
        <Image src="/event/wood.webp" alt="" width={1440} height={2560} sizes="40vw" className="hero-wood hero-wood-left" unoptimized />
        <Image src="/event/background.webp" alt="" width={1440} height={2560} sizes="40vw" className="hero-wood hero-wood-right" unoptimized />

        <div className="hero-copy">
          <p className="hero-meta">24–25 октября 2026 · Краснодар</p>
          <h1><span>ALL IN BATTLE</span><span>ANNIVERSARY 5</span></h1>
          <p className="hero-subtitle">Два дня хип-хопа, импровизации и настоящего баттла</p>
        </div>

        <div className="hero-portraits" aria-label="Судьи ALL IN BATTLE 5">
          <Image src="/event/people/gladi-cutout.webp" alt="GLADI" width={1087} height={1447} sizes="40vw" className="hero-person hero-person-left" loading="eager" unoptimized />
          <Image src="/event/people/pradazombie-cutout.webp" alt="PRADAZOMBIE" width={1087} height={1447} sizes="42vw" className="hero-person hero-person-center" priority unoptimized />
          <Image src="/event/people/kharkovskaya-cutout.webp" alt="KHARKOVSKAYA" width={1087} height={1447} sizes="40vw" className="hero-person hero-person-right" loading="eager" unoptimized />
        </div>

        <a className="hero-cta" href="#registration">Регистрация <ArrowDownRightIcon className="action-arrow" aria-hidden="true" /></a>
        <p className="hero-scroll">Листай, чтобы увидеть программу</p>
      </section>

      <section className="intro site-section" aria-labelledby="intro-title">
        <div className="intro-number" data-reveal>05</div>
        <div className="intro-copy" data-reveal>
          <p>Пятый год подряд</p>
          <h2 id="intro-title">Не просто баттлы. Место, где встречается комьюнити.</h2>
        </div>
        <p className="intro-note" data-reveal>Юбилейный ALL IN объединит танцоров разных возрастов и уровня — от первого выхода в круг до уверенного PRO.</p>
      </section>

      <LineupSection id="judges" eyebrow="Лайн-ап / 01" title="Судьи" people={judges} />

      <section id="program" className="site-section program-section">
        <SectionHeader kicker="24 октября / 01" title="Первый день" />
        <div className="program-grid">
          <article className="program-card" data-reveal>
            <p className="program-index">01</p><h3>Мастер-класс PRADAZOMBIE</h3><p className="program-price">3 200 ₽</p>
            <dl><div><dt>Длительность</dt><dd>1,5 часа</dd></div><div><dt>Адрес</dt><dd>Будет объявлен</dd></div></dl>
            <RegisterButton label="Иду на Мастер-Класс" presetId="day1-option-1" />
          </article>
          <article className="program-card program-card-accent" data-reveal>
            <p className="program-index">02</p><h3>Contest 3×3</h3><p className="program-price">3 000 ₽ <small>/ команда</small></p>
            <dl><div><dt>Судья</dt><dd>PRADAZOMBIE</dd></div><div><dt>Категории</dt><dd>До 18 лет / PRO</dd></div><div><dt>Музыка</dt><dd>ALBERT FTH / WHYDEAP</dd></div><div><dt>Зритель</dt><dd>800 ₽</dd></div></dl>
            <RegisterButton label="Зарегистрироваться на контест" />
          </article>
          <article className="program-card" data-reveal>
            <p className="program-index">03</p><h3>Jam</h3><p className="program-price">800 ₽</p>
            <dl><div><dt>Музыка</dt><dd>ALBERT FTH / WHYDEAP</dd></div><div><dt>Участникам Contest 3×3</dt><dd>Бесплатно</dd></div></dl>
            <RegisterButton label="Иду на джем" presetId="day1-option-3" />
          </article>
        </div>

        <div className="invited" data-reveal>
          <p>Приглашённые тройки</p>
          <div>
            <article><span>TEENS</span><h3>Nikita LSK<br />Настя Sowa<br />Arina Shtorm</h3></article>
            <article><span>PRO</span><h3>Zaytsev<br />Ashpi<br />Keti</h3></article>
          </div>
        </div>
      </section>

      <section className="site-section day-two-section">
        <SectionHeader kicker="25 октября / 02" title="Второй день" />
        <div className="day-two-layout">
          <div className="category-list">
            {dayTwoCategories.map(([name, description], index) => (
              <article key={name} data-reveal style={{ "--reveal-delay": `${index * 45}ms` } as React.CSSProperties}>
                <span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{description}</p>
              </article>
            ))}
          </div>
          <aside className="price-panel" data-reveal>
            <p>Стоимость участия</p>
            <div><span>Первая номинация</span><strong>1 900 ₽</strong></div>
            <div><span>Каждая следующая</span><strong>900 ₽</strong></div>
            <div><span>Зрительский билет</span><strong>800 ₽</strong></div>
            <p className="price-note">Категории BEG — до 3 лет обучения. PRO — опыт от 3 лет. Организаторы могут скорректировать категорию, если уровень участника ей не соответствует.</p>
            <RegisterButton label="Зарегистрироваться" clearSelection />
          </aside>
        </div>
      </section>

      <LineupSection id="team" eyebrow="За пультом / 03" title="DJ" people={djs} />
      <LineupSection id="mc" eyebrow="У микрофона / 04" title="MC" people={mcs} />
      <LineupSection id="media" eyebrow="За кадром / 05" title="Медиа" people={media} />

      <section className="site-section location-section">
        <SectionHeader kicker="Краснодар / 06" title="Место" />
        <div className="location-layout">
          <div data-reveal><p>Второй день</p><h3>«Бронзовая лошадь»</h3><address>ул. Калинина, 291</address></div>
          <Image src="/event/logo.webp" alt="Логотип ALL IN BATTLE 5" width={1920} height={1920} sizes="(max-width: 768px) 72vw, 34vw" className="location-logo" unoptimized />
        </div>
      </section>

      <section id="registration" className="site-section registration-section">
        <SectionHeader kicker="Финальный шаг / 07" title="Регистрация" />
        <Suspense fallback={<p className="form-loading">Загружаем форму…</p>}><RegistrationForm /></Suspense>
      </section>

      <footer className="site-footer">
        <Image src="/event/logo.webp" alt="ALL IN BATTLE 5" width={1920} height={1920} className="footer-logo" unoptimized />
        <p>24–25 октября 2026<br />Краснодар</p>
        <nav aria-label="Социальные сети">
          <a href="https://t.me/all_in_battle" target="_blank" rel="noreferrer"><span>Telegram</span><ArrowUpRightIcon className="external-arrow" aria-hidden="true" /></a>
          <a href="https://vk.ru/allinbattlehop" target="_blank" rel="noreferrer"><span>VKontakte</span><ArrowUpRightIcon className="external-arrow" aria-hidden="true" /></a>
          <a href="https://www.instagram.com/all_in_battlehop" target="_blank" rel="noreferrer"><span>Instagram</span><ArrowUpRightIcon className="external-arrow" aria-hidden="true" /></a>
        </nav>
        <a href="#top"><span>Наверх</span><ArrowUpIcon className="external-arrow" aria-hidden="true" /></a>
      </footer>
    </main>
  );
}
