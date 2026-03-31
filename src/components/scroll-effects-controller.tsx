"use client";

import { useEffect } from "react";

function getPhase(progress: number) {
  if (progress >= 0.52) return 5;
  if (progress >= 0.42) return 4;
  if (progress >= 0.32) return 3;
  if (progress >= 0.22) return 2;
  if (progress >= 0.12) return 1;
  return 0;
}

export function ScrollEffectsController() {
  useEffect(() => {
    const root = document.documentElement;
    const registration = document.getElementById("registration");
    const judges = document.getElementById("judges");
    const dayOne = document.getElementById("day-one");
    const lineupSections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-lineup-anim]")
    );

    let frame = 0;

    const update = () => {
      frame = 0;

      if (registration) {
        const registrationTop = registration.offsetTop;
        const shouldSnap = window.scrollY + 8 < registrationTop;
        root.classList.toggle("snap-mode", shouldSnap);
      }

      if (judges && dayOne) {
        const from = judges.offsetTop - window.innerHeight * 0.42;
        const to = dayOne.offsetTop - window.innerHeight * 0.12;
        const showGlobalBg = window.scrollY >= from && window.scrollY < to;
        root.classList.toggle("lineup-bg-visible", showGlobalBg);
      }

      const vh = window.innerHeight;
      for (const section of lineupSections) {
        const rect = section.getBoundingClientRect();
        const rawProgress = (vh - rect.top) / (vh + rect.height);
        const progress = Math.max(0, Math.min(1, rawProgress));
        const phase = getPhase(progress);
        section.dataset.phase = String(phase);

        section.classList.remove(
          "phase-0",
          "phase-1",
          "phase-2",
          "phase-3",
          "phase-4",
          "phase-5"
        );
        section.classList.add(`phase-${phase}`);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const getLockedSection = () => {
      const viewportAnchor = window.innerHeight * 0.2;
      for (const section of lineupSections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportAnchor && rect.bottom > viewportAnchor) {
          const phase = Number(section.dataset.phase || "0");
          const completePhase = Number(section.dataset.completePhase || "5");
          if (phase < completePhase) return section;
        }
      }
      return null;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) return;
      const locked = getLockedSection();
      if (!locked) return;

      event.preventDefault();
      const step = Math.min(72, Math.max(28, Math.abs(event.deltaY) * 0.22));
      window.scrollBy({ top: step, behavior: "auto" });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const keys = ["ArrowDown", "PageDown", " "];
      if (!keys.includes(event.key)) return;
      const locked = getLockedSection();
      if (!locked) return;

      event.preventDefault();
      window.scrollBy({ top: 56, behavior: "auto" });
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href="#registration"]') as HTMLAnchorElement | null;
      if (!link) return;

      const registrationSection = document.getElementById("registration");
      if (!registrationSection) return;

      event.preventDefault();
      registrationSection.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "#registration");
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
      root.classList.remove("snap-mode");
      root.classList.remove("lineup-bg-visible");
    };
  }, []);

  return null;
}
