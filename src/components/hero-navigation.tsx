"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NavItem = { label: string; href: string };

export function HeroNavigation({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="site-nav">
        <a href="#top" className="site-nav-logo" aria-label="ALL IN BATTLE — на главную">
          <Image src="/event/logo-nav.webp" alt="" width={192} height={192} priority unoptimized />
        </a>
        <p className="site-nav-date">24–25 октября</p>
        <nav className="site-nav-links" aria-label="Главная навигация">
          {items.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <button type="button" className="site-nav-menu" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation">Меню</button>
      </header>

      <div id="mobile-navigation" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-top">
          <Image className="mobile-menu-logo" src="/event/logo-transparent.webp" alt="ALL IN BATTLE" width={256} height={256} unoptimized />
          <button type="button" onClick={() => setOpen(false)}>Закрыть</button>
        </div>
        <nav aria-label="Мобильная навигация">
          {items.map((item, index) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
            </a>
          ))}
        </nav>
        <p>24–25 октября 2026 · Краснодар</p>
      </div>
    </>
  );
}
