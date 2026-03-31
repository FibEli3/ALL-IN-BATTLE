"use client";

import { ReactNode } from "react";

type ProgramRegistrationButtonProps = {
  className: string;
  children: ReactNode;
  presetId?: string;
  clearSelection?: boolean;
};

export function ProgramRegistrationButton({
  className,
  children,
  presetId,
  clearSelection = false,
}: ProgramRegistrationButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("program-registration-preset", {
        detail: {
          presetId: presetId ?? null,
          clearSelection,
        },
      }),
    );

    const registrationSection = document.getElementById("registration");
    if (registrationSection) {
      registrationSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    window.setTimeout(() => {
      const input = document.getElementById("registration-full-name");
      if (input instanceof HTMLInputElement) {
        try {
          input.focus({ preventScroll: true });
        } catch {
          input.focus();
        }
      }
    }, 320);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
