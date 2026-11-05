"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker and synced with ScrollTrigger.
 * Only on desktop with a fine pointer and no reduced-motion preference — touch devices keep native
 * scrolling and never download Lenis.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.desktop, () => {
      let alive = true;
      let cleanup = () => {};
      import("lenis").then(({ default: LenisCtor }) => {
        if (!alive) return;
        const lenis = new LenisCtor({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          anchors: { offset: -96 },
          autoRaf: false,
        });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        cleanup = () => {
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
          lenisRef.current = null;
        };
      });
      return () => {
        alive = false;
        cleanup();
      };
    });
    return () => mm.revert();
  }, []);

  // New page: jump to top instantly and re-measure
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (!window.location.hash) lenis.scrollTo(0, { immediate: true, force: true });
    lenis.resize();
  }, [pathname]);

  return null;
}
