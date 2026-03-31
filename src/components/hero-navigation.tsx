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
        className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center md:hidden"
        aria-label="Open menu"
      >
        <Image src="/icons/menu.svg" alt="" width={26} height={26} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <Image
            src="/menu/full.png"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none absolute inset-0 object-cover"
          />
          <Image
            src="/menu/top.png"
            alt=""
            width={390}
            height={220}
            className="pointer-events-none absolute left-0 top-0 h-auto w-full object-cover"
          />
          <Image
            src="/menu/bot.png"
            alt=""
            width={390}
            height={240}
            className="pointer-events-none absolute bottom-0 left-0 h-auto w-full object-cover"
          />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center"
            aria-label="Close menu"
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
                  className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#174b24]"
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

