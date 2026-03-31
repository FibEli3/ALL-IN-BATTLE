"use client";

import { useEffect } from "react";

function getPhase(progress: number) {
  if (progress >= 0.95) return 5;
  if (progress >= 0.8) return 4;
  if (progress >= 0.6) return 3;
  if (progress >= 0.4) return 2;
  if (progress >= 0.2) return 1;
  return 0;
}

export function ScrollEffectsController() {
  useEffect(() => {
    const root = document.documentElement;
    const registration = document.getElementById("registration");
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
      const step = Math.min(130, Math.max(56, Math.abs(event.deltaY) * 0.45));
      window.scrollBy({ top: step, behavior: "auto" });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const keys = ["ArrowDown", "PageDown", " "];
      if (!keys.includes(event.key)) return;
      const locked = getLockedSection();
      if (!locked) return;

      event.preventDefault();
      window.scrollBy({ top: 120, behavior: "auto" });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      root.classList.remove("snap-mode");
    };
  }, []);

  return null;
}
