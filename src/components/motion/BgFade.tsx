"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Smooth light → dark transition for a dark section.
 * Put it as the first child of a `relative` section whose classes include `bg-navy desk:bg-cream`:
 * on desktop the navy layer fades in (opacity only) as the section enters; elsewhere it's simply navy.
 */
export function BgFade() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        gsap.fromTo(
          ref.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current?.parentElement, start: "clamp(top 95%)", end: "clamp(top 60%)", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 bg-navy" />;
}
