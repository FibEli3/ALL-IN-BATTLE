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

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
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
        <Image src="/icons/menu.svg" alt="" width={32} height={32} />
      </button>

      <div
        className={`fixed inset-0 z-[120] transition-opacity duration-300 ease-out md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          <div className="absolute inset-0 bg-[#e6eee6]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.62)_0%,_rgba(230,238,230,0.92)_58%,_rgba(164,191,167,0.88)_100%)]" />
          <Image
            src="/bg/bg-menu.png"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none absolute inset-0 z-[2] object-cover"
          />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center"
              aria-label="Close menu"
            >
              <Image src="/icons/cross.svg" alt="" width={32} height={32} />
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
      </div>
    </>
  );
}
