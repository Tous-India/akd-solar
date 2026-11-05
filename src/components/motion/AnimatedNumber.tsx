"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Props = { value: number; format: (n: number) => string; className?: string };

/** Tweens smoothly from the previous value whenever `value` changes. */
export function AnimatedNumber({ value, format, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);
  const tween = useRef<gsap.core.Tween | null>(null);
  const formatRef = useRef(format);
  formatRef.current = format;
  const [initial] = useState(() => format(value));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      tween.current?.kill();
      if (prefersReducedMotion() || current.current === value) {
        current.current = value;
        el.textContent = formatRef.current(value);
        return;
      }
      const obj = { v: current.current };
      tween.current = gsap.to(obj, {
        v: value,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: () => {
          current.current = obj.v;
          el.textContent = formatRef.current(obj.v);
        },
      });
    },
    { dependencies: [value] },
  );

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      {initial}
    </span>
  );
}
