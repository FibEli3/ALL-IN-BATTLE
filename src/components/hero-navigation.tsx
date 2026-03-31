"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

export function HeroNavigation({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <nav className="absolute left-1/2 top-[30px] z-20 hidden w-fit -translate-x-1/2 items-center justify-center gap-10 whitespace-nowrap rounded-full bg-white px-7 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.12)] md:flex">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-xl font-semibold leading-none tracking-[-0.02em] text-[#174b24] transition hover:opacity-70"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.16)] md:hidden"
        aria-label="Открыть меню"
      >
        <Image src="/icons/menu.svg" alt="" width={26} height={26} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#f7f7f7_42%,_#c3d4c6_76%,_#8aa58f_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0)_44%,_rgba(30,80,44,0.18)_100%)]" />

          <Image
            src="/hero/left-top.png"
            alt=""
            width={260}
            height={260}
            className="pointer-events-none absolute left-[-64px] top-[-22px] h-auto w-[58vw] max-w-[260px] opacity-95 mix-blend-multiply"
          />
          <Image
            src="/hero/left-bot.png"
            alt=""
            width={260}
            height={260}
            className="pointer-events-none absolute bottom-[-68px] left-[-72px] h-auto w-[60vw] max-w-[270px] opacity-95 mix-blend-multiply"
          />
          <Image
            src="/hero/right.png"
            alt=""
            width={280}
            height={280}
            className="pointer-events-none absolute bottom-[-46px] right-[-74px] h-auto w-[62vw] max-w-[280px] opacity-95 mix-blend-multiply"
          />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.16)]"
            aria-label="Закрыть меню"
          >
            <Image src="/icons/cross.svg" alt="" width={20} height={20} />
          </button>

          <div className="relative z-10 flex min-h-full items-center justify-center">
            <div className="flex flex-col items-center gap-8 text-center">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-[46px] font-semibold leading-none tracking-[-0.02em] text-[#174b24]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

