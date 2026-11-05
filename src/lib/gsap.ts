"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once, client side only. Flip (projects page) and SplitText (desktop headings)
// are imported where they're used so phones don't download them.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

/** Media queries shared by every gsap.matchMedia() call */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  /** tablets, phones and touch laptops — lighter fades only */
  light: "(prefers-reduced-motion: no-preference) and (max-width: 1023.98px), (prefers-reduced-motion: no-preference) and (pointer: coarse)",
} as const;

export type MotionConditions = { motion?: boolean; desktop?: boolean; reduce?: boolean };

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;
}

/** Fire once when an element scrolls into view — no layout reads (cheap on phones) */
export function onceInView(el: Element, cb: () => void, rootMargin = "0px 0px -12% 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}

/** Run decorative work once the page has loaded and the main thread is idle (keeps it out of TBT) */
export function whenIdle(cb: () => void, timeout = 2500) {
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = () => {
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(cb, { timeout });
    else timer = setTimeout(cb, 1200);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    window.removeEventListener("load", run);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timer) clearTimeout(timer);
  };
}

export { gsap, ScrollTrigger, useGSAP };
