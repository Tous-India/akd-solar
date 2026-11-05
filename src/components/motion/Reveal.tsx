"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ, onceInView, useGSAP } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Animate direct children one after another instead of the wrapper itself */
  stagger?: number;
  y?: number;
  delay?: number;
  variant?: "fade" | "clip";
  start?: string;
  id?: string;
};

/**
 * Scroll reveal. Content is fully visible without JS and with reduced motion.
 * Desktop: ScrollTrigger (clip-path wipes, 1.1 → 1 scale). Phones/tablets: a light fade driven by an
 * IntersectionObserver, which avoids layout reads and keeps the main thread free.
 */
export function Reveal({ as: Tag = "div", className, children, stagger, y = 36, delay = 0, variant = "fade", start = "top 86%", id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? Array.from(el.children) : [el];
      if (!targets.length) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const scrollTrigger = { trigger: el, start, once: true };
        if (variant === "clip") {
          gsap.fromTo(
            targets,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut", delay, stagger: stagger ?? 0, scrollTrigger },
          );
          const inner = targets.map((t) => t.firstElementChild).filter((n): n is Element => Boolean(n));
          if (inner.length) {
            gsap.fromTo(inner, { scale: 1.1 }, { scale: 1, duration: 1.6, ease: "power3.out", delay, stagger: stagger ?? 0, scrollTrigger });
          }
        } else {
          gsap.from(targets, { y, autoAlpha: 0, duration: 1, delay, stagger: stagger ?? 0, scrollTrigger });
        }
      });

      mm.add(MQ.light, () => {
        gsap.set(targets, { y: variant === "clip" ? 0 : Math.min(y, 20), autoAlpha: 0 });
        return onceInView(el, () => {
          gsap.to(targets, { y: 0, autoAlpha: 1, duration: 0.7, delay, stagger: stagger ?? 0, overwrite: true });
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
