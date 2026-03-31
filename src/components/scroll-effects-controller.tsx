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
    document.addEventListener("click", onDocumentClick);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("click", onDocumentClick);
      root.classList.remove("snap-mode");
    };
  }, []);

  return null;
}
