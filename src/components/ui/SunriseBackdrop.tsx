"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

type Props = {
  tone?: "light" | "dark";
  /** Tailwind classes positioning the sun glow */
  glowClass?: string;
  className?: string;
  grid?: boolean;
};

/**
 * Signature motif: a soft sunrise glow over thin solar-panel grid lines. Purely decorative.
 * On desktop the glow and the grid drift at different speeds as the section scrolls (parallax layers).
 */
export function SunriseBackdrop({ tone = "light", glowClass = "-top-40 right-[-10%]", className = "", grid = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const section = ref.current?.parentElement;
        if (!section) return;
        const scrollTrigger = { trigger: section, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo("[data-layer='glow']", { yPercent: -6 }, { yPercent: 16, ease: "none", scrollTrigger });
        gsap.fromTo("[data-layer='grid']", { yPercent: 0 }, { yPercent: 5, ease: "none", scrollTrigger });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {grid ? (
        <div data-layer="grid" className="absolute -inset-y-16 inset-x-0">
          <div className={`absolute inset-0 ${tone === "dark" ? "panel-grid-dark" : "panel-grid"}`} />
        </div>
      ) : null}
      <div data-layer="glow" className="absolute inset-0">
        <div className={`sun-glow absolute aspect-square w-[min(900px,140vw)] rounded-full ${tone === "dark" ? "opacity-60" : ""} ${glowClass}`} />
      </div>
    </div>
  );
}
