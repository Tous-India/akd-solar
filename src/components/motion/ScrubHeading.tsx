"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

type Props = { as?: "h1" | "h2"; className?: string; children: ReactNode; id?: string };

/** Heading whose words brighten from 20% to full opacity as it scrolls into view (desktop only; SplitText is loaded on demand). */
export function ScrubHeading({ as: Tag = "h2", className, children, id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, (self) => {
        let alive = true;
        let revert: (() => void) | undefined;
        import("gsap/SplitText").then(({ SplitText }) => {
          if (!alive || !ref.current) return;
          gsap.registerPlugin(SplitText);
          self.add(() => {
            const split = SplitText.create(ref.current!, { type: "words", tag: "span", aria: "none" });
            revert = () => split.revert();
            gsap.fromTo(
              split.words,
              { opacity: 0.2 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: { trigger: ref.current, start: "clamp(top 88%)", end: "clamp(top 55%)", scrub: 0.5 },
              },
            );
          });
        });
        return () => {
          alive = false;
          revert?.();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
