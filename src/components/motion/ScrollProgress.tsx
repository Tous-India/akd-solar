"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** "Sun journey": a thin sunrise bar along the top edge with a small sun travelling with scroll progress. */
export function ScrollProgress() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const bar = barRef.current;
      const sun = sunRef.current;
      if (!bar || !sun) return;
      const setBar = gsap.quickSetter(bar, "scaleX");
      const setSun = gsap.quickSetter(sun, "x", "px");
      const update = (p: number) => {
        setBar(p);
        setSun(p * Math.max(0, window.innerWidth - 18));
        sun.style.opacity = p > 0.002 ? "1" : "0";
      };
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => update(self.progress),
        onRefresh: (self) => update(self.progress),
      });
    },
    { dependencies: [pathname], scope: rootRef, revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={barRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-sun via-gold to-leaf will-change-transform" />
      <div ref={sunRef} className="absolute -top-[7px] left-0 size-[18px] opacity-0 transition-opacity duration-300 will-change-transform">
        <svg viewBox="0 0 18 18" className="size-full drop-shadow-[0_0_6px_rgb(255_201_60/0.9)]">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line key={i} x1={9 + Math.cos(a) * 6} y1={9 + Math.sin(a) * 6} x2={9 + Math.cos(a) * 8.5} y2={9 + Math.sin(a) * 8.5} stroke="#F7931E" strokeWidth="1.4" strokeLinecap="round" />
            );
          })}
          <circle cx="9" cy="9" r="4.5" fill="#FFC93C" stroke="#F7931E" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
