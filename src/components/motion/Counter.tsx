"use client";

import { useRef, useState } from "react";
import { gsap, MQ, onceInView, useGSAP } from "@/lib/gsap";
import { formatNumber } from "@/lib/format";

type Props = { value: number; prefix?: string; suffix?: string; decimals?: number; duration?: number };

/** Counts up from 0 when scrolled into view. Server HTML contains the final value. */
export function Counter({ value, prefix = "", suffix = "", decimals = 0, duration = 2.2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => `${prefix}${formatNumber(n, decimals)}${suffix}`;
  const [initial] = useState(() => fmt(value));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const obj = { v: 0 };
        el.textContent = fmt(0);
        let tween: gsap.core.Tween | undefined;
        const stop = onceInView(
          el,
          () => {
            tween = gsap.to(obj, {
              v: value,
              duration,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = fmt(obj.v);
              },
            });
          },
          "0px 0px -8% 0px",
        );
        return () => {
          stop();
          tween?.kill();
          el.textContent = fmt(value);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span className="relative inline-block tabular-nums">
      <span className="sr-only">{initial}</span>
      <span ref={ref} aria-hidden suppressHydrationWarning>
        {initial}
      </span>
    </span>
  );
}
