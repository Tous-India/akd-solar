"use client";

import { useId, useRef } from "react";
import { gsap, MQ, useGSAP, whenIdle } from "@/lib/gsap";

type Pt = [number, number];

// Roof plane (ridge → eave) used to lay out the panel grid with bilinear interpolation
const ROOF: [Pt, Pt, Pt, Pt] = [
  [214, 176], // ridge start (near apex)
  [438, 196], // ridge end
  [546, 298], // eave end
  [328, 292], // eave start
];
const ROWS = 3;
const COLS = 4;

function lerp(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
function roofPoint(u: number, v: number): Pt {
  return lerp(lerp(ROOF[0], ROOF[1], u), lerp(ROOF[3], ROOF[2], u), v);
}
function quad(u0: number, v0: number, u1: number, v1: number) {
  return [roofPoint(u0, v0), roofPoint(u1, v0), roofPoint(u1, v1), roofPoint(u0, v1)]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
}

const GAP = 0.022;
const PANELS = Array.from({ length: ROWS * COLS }, (_, i) => {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  const u0 = c / COLS + GAP;
  const u1 = (c + 1) / COLS - GAP;
  const v0 = r / ROWS + GAP * 1.6;
  const v1 = (r + 1) / ROWS - GAP * 1.6;
  const mid = (u0 + u1) / 2;
  const a = roofPoint(mid, v0);
  const b = roofPoint(mid, v1);
  return { points: quad(u0, v0, u1, v1), line: [a, b] as [Pt, Pt], tone: (c + (ROWS - r)) % 3 };
});

const RAYS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const long = i % 2 === 0;
  const r0 = 92;
  const r1 = long ? 152 : 128;
  const spread = long ? 0.16 : 0.13;
  const p = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  return `${p(r0, angle - spread)} ${p(r1, angle)} ${p(r0, angle + spread)}`;
});

const SUN: Pt = [452, 168];

type Props = {
  /** The slider passes false for hidden slides: no timeline is built (and any running one is killed). */
  active?: boolean;
};

export function HeroIllustration({ active = true }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  // Unique ids so two copies on a page never share gradients or clip paths
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g = (name: string) => `hi-${uid}-${name}`;

  useGSAP(
    () => {
      if (!active) return;
      const svg = ref.current;
      if (!svg) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;
        const loops = gsap.timeline({ paused: true });
        loops
          .to("[data-rays]", { rotation: 360, svgOrigin: `${SUN[0]} ${SUN[1]}`, duration: 80, ease: "none", repeat: -1 }, 0)
          .to("[data-house]", { y: -7, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0)
          .fromTo("[data-sweep]", { x: -180 }, { x: 520, duration: 2.6, ease: "power2.inOut", repeat: -1, repeatDelay: 2.4 }, 0.8)
          .to("[data-cloud='1']", { x: 26, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0)
          .to("[data-cloud='2']", { x: -20, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0)
          .to("[data-wire]", { strokeDashoffset: -60, duration: 1.6, ease: "none", repeat: -1 }, 0)
          .to("[data-led]", { opacity: 0.25, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut" }, 0);

        // Sunrise entrance on desktop; phones show the finished artwork straight away
        if (desktop) {
          gsap.from("[data-sun]", { y: 70, autoAlpha: 0, duration: 1.6, delay: 0.3, ease: "power3.out" });
          gsap.from("[data-panel]", { autoAlpha: 0, scale: 0.85, transformOrigin: "50% 50%", stagger: 0.04, duration: 0.6, delay: 0.6 });
        }

        // Loops start once the page is idle and pause while the artwork is off screen (no ScrollTrigger inside slides)
        let visible = true;
        let ready = false;
        const io = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          if (!ready) return;
          if (visible) loops.play();
          else loops.pause();
        });
        io.observe(svg);
        const cancelIdle = whenIdle(() => {
          ready = true;
          if (visible) loops.play();
        });
        return () => {
          io.disconnect();
          cancelIdle();
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 500"
      className="h-auto w-full overflow-visible"
      role="img"
      aria-labelledby={g("title")}
    >
      <title id={g("title")}>A house with solar panels on its roof as the sun rises behind it</title>
      <defs>
        <radialGradient id={g("sun")} cx="40%" cy="38%" r="70%">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset="0.35" stopColor="#FFC93C" />
          <stop offset="1" stopColor="#F7931E" />
        </radialGradient>
        <linearGradient id={g("ray")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC93C" />
          <stop offset="1" stopColor="#F7931E" />
        </linearGradient>
        <radialGradient id={g("halo")}>
          <stop offset="0" stopColor="#FFC93C" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#F7931E" stopOpacity="0.12" />
          <stop offset="1" stopColor="#F7931E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g("edge")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2BA8E8" />
          <stop offset="1" stopColor="#1E4FB0" />
        </linearGradient>
        <linearGradient id={g("p0")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A63D0" />
          <stop offset="1" stopColor="#1E4FB0" />
        </linearGradient>
        <linearGradient id={g("p1")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38B6F0" />
          <stop offset="1" stopColor="#2286D6" />
        </linearGradient>
        <linearGradient id={g("p2")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2F86E0" />
          <stop offset="1" stopColor="#1F5BC0" />
        </linearGradient>
        <linearGradient id={g("sweep")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={g("ground")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7CC520" />
          <stop offset="1" stopColor="#2E8B1E" />
        </linearGradient>
        <linearGradient id={g("side")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#EFE6D6" />
          <stop offset="1" stopColor="#F7F1E6" />
        </linearGradient>
        <linearGradient id={g("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CDEBFA" />
          <stop offset="1" stopColor="#7FC6EE" />
        </linearGradient>
        <clipPath id={g("panels")}>
          {PANELS.map((p, i) => (
            <polygon key={i} points={p.points} />
          ))}
        </clipPath>
      </defs>

      {/* Sun */}
      <g data-sun>
        <circle data-halo cx={SUN[0]} cy={SUN[1]} r="230" fill={`url(#${g("halo")})`} opacity="0.75" />
        <g data-rays>
          {RAYS.map((pts, i) => (
            <polygon key={i} points={pts} transform={`translate(${SUN[0]} ${SUN[1]})`} fill={`url(#${g("ray")})`} />
          ))}
        </g>
        <circle cx={SUN[0]} cy={SUN[1]} r="80" fill={`url(#${g("sun")})`} />
        <circle cx={SUN[0] - 22} cy={SUN[1] - 24} r="22" fill="#fff" opacity="0.28" />
      </g>

      {/* Clouds */}
      <g data-cloud="1" fill="#fff" opacity="0.95">
        <path d="M40 120a22 22 0 0 1 40-12 18 18 0 0 1 32 10 14 14 0 0 1 2 28H46a16 16 0 0 1-6-26z" />
      </g>
      <g data-cloud="2" fill="#fff" opacity="0.9">
        <path d="M520 58a16 16 0 0 1 29-8 13 13 0 0 1 23 8 10 10 0 0 1 1 20h-49a12 12 0 0 1-4-20z" />
      </g>

      {/* Ground */}
      <path d="M0 470c90-30 190-34 300-26s210 10 300-14v70H0z" fill="#A7D86A" opacity="0.55" />
      <path d="M0 482c110-18 220-22 320-16s190 6 280-6v40H0z" fill={`url(#${g("ground")})`} />
      <ellipse cx="322" cy="452" rx="250" ry="10" fill="#0A1730" opacity="0.08" />

      {/* Small sparkle by the tree */}
      <path d="M20 340l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" fill="#F7931E" />

      {/* Tree */}
      <g>
        <rect x="52" y="392" width="8" height="62" rx="3" fill="#7A5230" />
        <circle cx="56" cy="380" r="34" fill="#2E8B1E" />
        <circle cx="38" cy="398" r="24" fill="#3E9E25" />
        <circle cx="76" cy="400" r="22" fill="#7CC520" />
        <circle cx="62" cy="364" r="14" fill="#7CC520" opacity="0.7" />
      </g>

      {/* House */}
      <g data-house>
        {/* side wall */}
        <polygon points="312,294 548,302 548,448 312,448" fill={`url(#${g("side")})`} />
        <rect x="372" y="338" width="56" height="46" rx="4" fill={`url(#${g("glass")})`} stroke="#1E4FB0" strokeWidth="4" />
        <path d="M400 338v46M372 361h56" stroke="#1E4FB0" strokeWidth="3" />
        <rect x="456" y="338" width="56" height="46" rx="4" fill={`url(#${g("glass")})`} stroke="#1E4FB0" strokeWidth="4" />
        <path d="M484 338v46M456 361h56" stroke="#1E4FB0" strokeWidth="3" />

        {/* inverter + wire */}
        <path data-wire d="M336 300V392" stroke="#7CC520" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" fill="none" />
        <rect x="322" y="390" width="28" height="36" rx="5" fill="#0A1730" />
        <circle data-led cx="336" cy="402" r="3.5" fill="#7CC520" />
        <rect x="328" y="412" width="16" height="3" rx="1.5" fill="#2BA8E8" />

        {/* gable wall */}
        <polygon points="102,292 206,184 312,292 312,448 102,448" fill="#FFFDF8" />
        <polygon points="102,292 206,184 312,292 312,300 102,300" fill="#0A1730" opacity="0.04" />

        {/* roof plane + panels */}
        <polygon points="206,166 444,186 560,304 326,298" fill="#123A86" />
        {PANELS.map((p, i) => (
          <g key={i} data-panel>
            <polygon points={p.points} fill={`url(#${g(`p${p.tone}`)})`} />
            <polygon data-panel-glow points={p.points} fill="#FFE7A0" opacity="0" />
            <line
              x1={p.line[0][0]}
              y1={p.line[0][1]}
              x2={p.line[1][0]}
              y2={p.line[1][1]}
              stroke="#fff"
              strokeOpacity="0.22"
              strokeWidth="1.2"
            />
          </g>
        ))}
        <g clipPath={`url(#${g("panels")})`}>
          <g data-sweep>
            <rect x="180" y="140" width="70" height="190" fill={`url(#${g("sweep")})`} transform="skewX(-24)" />
          </g>
        </g>

        {/* roof edge chevron, like the logo */}
        <polyline points="84,304 206,170 330,304" fill="none" stroke={`url(#${g("edge")})`} strokeWidth="24" strokeLinejoin="miter" />

        {/* gable window (four panes, from the logo) */}
        <g fill="none" stroke="#1E4FB0" strokeWidth="4">
          <rect x="184" y="226" width="19" height="19" />
          <rect x="209" y="226" width="19" height="19" />
          <rect x="184" y="251" width="19" height="19" />
          <rect x="209" y="251" width="19" height="19" />
        </g>

        {/* door + steps */}
        <rect x="176" y="360" width="62" height="88" rx="6" fill="#1E4FB0" />
        <rect x="186" y="372" width="42" height="30" rx="3" fill="#2BA8E8" opacity="0.45" />
        <circle cx="226" cy="410" r="3.5" fill="#FFC93C" />
        <rect x="164" y="446" width="86" height="8" rx="3" fill="#D9CDB7" />

        {/* plant pots */}
        <rect x="128" y="424" width="24" height="24" rx="4" fill="#F7931E" />
        <circle cx="134" cy="416" r="10" fill="#2E8B1E" />
        <circle cx="146" cy="414" r="11" fill="#7CC520" />
      </g>
    </svg>
  );
}
