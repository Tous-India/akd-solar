"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** A shy, smiling sun that keeps peeking out from behind a drifting cloud. */
export function CloudySun() {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to("[data-rays]", { rotation: 360, svgOrigin: "200 150", duration: 40, ease: "none", repeat: -1 });

        // cloud drifts across, the sun peeks out, hides again
        const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
        tl.to("[data-cloud]", { x: -70, duration: 2.6 })
          .to("[data-sun-body]", { x: 26, y: -10, rotation: 8, svgOrigin: "200 150", duration: 0.9 }, "<0.8")
          .to("[data-pupils]", { x: -4, duration: 0.4 }, "<")
          .to({}, { duration: 1.2 })
          .to("[data-pupils]", { x: 3, duration: 0.4 })
          .to("[data-cloud]", { x: 0, duration: 2.4 })
          .to("[data-sun-body]", { x: 0, y: 0, rotation: 0, duration: 0.9 }, "<0.6")
          .to({}, { duration: 1 });

        // blink
        gsap.to("[data-eyes]", { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.08, yoyo: true, repeat: -1, repeatDelay: 3.2 });

        // gentle rain from the little cloud
        gsap.utils.toArray<SVGElement>("[data-drop]").forEach((d, i) => {
          gsap.fromTo(d, { y: 0, autoAlpha: 0 }, { y: 46, autoAlpha: 1, duration: 1.1, repeat: -1, delay: i * 0.35, ease: "power1.in" });
        });
        gsap.to("[data-cloud-small]", { x: 18, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 400 300" className="h-auto w-full max-w-[420px]" role="img" aria-label="A smiling sun hiding behind a cloud">
      <defs>
        <radialGradient id="nf-sun" cx="40%" cy="38%" r="70%">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset="0.4" stopColor="#FFC93C" />
          <stop offset="1" stopColor="#F7931E" />
        </radialGradient>
        <radialGradient id="nf-halo">
          <stop offset="0" stopColor="#FFC93C" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFC93C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="150" r="150" fill="url(#nf-halo)" />

      <g data-sun-body>
        <g data-rays>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r0 = 70;
            const r1 = i % 2 ? 100 : 116;
            const s = 0.15;
            const p = (r: number, ang: number) => `${(200 + Math.cos(ang) * r).toFixed(1)},${(150 + Math.sin(ang) * r).toFixed(1)}`;
            return <polygon key={i} points={`${p(r0, a - s)} ${p(r1, a)} ${p(r0, a + s)}`} fill="#F7931E" />;
          })}
        </g>
        <circle cx="200" cy="150" r="62" fill="url(#nf-sun)" />
        <g data-eyes>
          <ellipse cx="182" cy="140" rx="7" ry="9" fill="#101828" />
          <ellipse cx="218" cy="140" rx="7" ry="9" fill="#101828" />
          <g data-pupils fill="#fff">
            <circle cx="184" cy="137" r="2.5" />
            <circle cx="220" cy="137" r="2.5" />
          </g>
        </g>
        <circle cx="170" cy="160" r="8" fill="#D7141A" opacity="0.25" />
        <circle cx="230" cy="160" r="8" fill="#D7141A" opacity="0.25" />
        <path d="M188 164q12 10 24 0" stroke="#101828" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      <g data-cloud>
        <path
          d="M118 214a40 40 0 0 1 58-36 52 52 0 0 1 96 10 34 34 0 0 1 22 62H130a34 34 0 0 1-12-36z"
          fill="#fff"
          stroke="#E8E0D1"
          strokeWidth="3"
        />
        <path d="M150 238h120" stroke="#E8E0D1" strokeWidth="3" strokeLinecap="round" />
      </g>

      <g data-cloud-small>
        <path d="M300 64a18 18 0 0 1 32-6 14 14 0 0 1 22 12 11 11 0 0 1-2 22h-48a14 14 0 0 1-4-28z" fill="#E7EEF7" />
        {[312, 326, 340].map((x) => (
          <path key={x} data-drop d={`M${x} 96c-3 5-4 7-4 9a4 4 0 0 0 8 0c0-2-1-4-4-9z`} fill="#2BA8E8" />
        ))}
      </g>
    </svg>
  );
}
