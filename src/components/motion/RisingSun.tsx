"use client";

import { useId, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Props = {
  /** Scales the sun inside its box */
  size?: "sm" | "md" | "lg";
  /** 0–1: multiplies glow, beam and halo strength (use ~0.4 for a soft background sun) */
  intensity?: number;
  /** true: sunrise is scrubbed with scroll. false: the sun rises once when it enters view. */
  scrub?: boolean;
  beams?: number;
  sparkles?: number;
  className?: string;
  /** onWarm: white light for orange/gold backgrounds. onLight: gold/orange light for cream backgrounds */
  tone?: "onWarm" | "onLight";
  /** false renders only glow, rays and beams (an aura behind other artwork) */
  core?: boolean;
  /** Skip all animation work below this viewport width (use when the sun is hidden there) */
  minWidth?: number;
};

/*
 * The site's signature motion: a layered SVG sun that rises over the bottom edge of its box.
 *
 * The default markup IS the fully-risen state, so no-JS and reduced-motion visitors see a complete, static sun.
 *
 * Optional scene hooks — put them on elements inside the closest [data-sun-scene] ancestor:
 *   [data-sun-warm]     element whose --sun-a/--sun-b/--sun-c gradient stops warm up
 *   [data-sun-grid]     panel-grid layer that brightens as if lit
 *   [data-sun-parallax] content that drifts up slightly slower than the scroll
 *   [data-sun-reveal]   content that fades/slides in once the sun is half-risen
 */

const C = { x: 240, y: 262 }; // sun centre in the 480×300 viewBox (near the bottom edge)
const SCALE = { sm: 0.72, md: 0.86, lg: 1 } as const;

const RAY_COUNT = 16;
const RAYS = Array.from({ length: RAY_COUNT }, (_, i) => ({ angle: (360 / RAY_COUNT) * i, long: i % 2 === 0 }));

// Beams fan up and to the left, towards the copy
const BEAM_ANGLES = [-62, -48, -34, -20, -8];

const SPARKLES = [
  { a: -150, r: 196, s: 3 },
  { a: -128, r: 178, s: 2.2 },
  { a: -105, r: 205, s: 2.6 },
  { a: -82, r: 186, s: 3.2 },
  { a: -60, r: 200, s: 2.2 },
  { a: -38, r: 176, s: 2.8 },
  { a: -18, r: 192, s: 2 },
  { a: -140, r: 150, s: 1.8 },
  { a: -70, r: 158, s: 1.8 },
  { a: -30, r: 148, s: 1.6 },
];

const polar = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: C.x + Math.cos(rad) * r, y: C.y + Math.sin(rad) * r };
};

export function RisingSun({ size = "lg", intensity = 1, scrub = true, beams = 5, sparkles = 8, className = "", tone = "onWarm", core = true, minWidth = 0 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const k = Math.max(0, Math.min(1, intensity));
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gid = (name: string) => `rs-${name}-${uid}`;

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const scene = (svg.closest("[data-sun-scene]") as HTMLElement | null) ?? (svg.closest("section") as HTMLElement | null) ?? svg;
      const q = (sel: string) => gsap.utils.toArray<Element>(sel, svg);
      // Scene hooks may sit on the scene element itself (e.g. the card) or on its descendants
      const sceneQ = (sel: string) =>
        scene === svg ? [] : [...(scene.matches(sel) ? [scene] : []), ...gsap.utils.toArray<HTMLElement>(sel, scene)];

      const group = svg.querySelector("[data-sun-group]");
      const rays = svg.querySelector("[data-sun-rays]");
      const rayLines = q("[data-ray]");
      const glow = svg.querySelector("[data-sun-glow]");
      const beamsG = svg.querySelector("[data-sun-beams]");
      const extraBeams = q("[data-beam-extra]");
      const sparkleEls = q("[data-sparkle]");
      const warm = sceneQ("[data-sun-warm]");
      const grid = sceneQ("[data-sun-grid]");
      const parallax = sceneQ("[data-sun-parallax]");
      const reveal = sceneQ("[data-sun-reveal]");
      const origin = `${C.x} ${C.y}`;

      const mm = gsap.matchMedia();
      mm.add(
        {
          large: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          tablet: "(min-width: 768px) and (max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
          small: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
          fine: "(pointer: fine)",
          shown: `(min-width: ${minWidth}px)`,
        },
        (ctx) => {
          const { large, tablet, small, fine, shown } = ctx.conditions as Record<string, boolean>;
          if (!shown) return; // hidden at this size — do nothing
          if (!large && !tablet && !small) return; // reduced motion → static, fully risen

          const full = large || tablet;
          if (tablet) gsap.set(extraBeams, { autoAlpha: 0 });

          // ── Sunrise timeline ──
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            onStart: () => gsap.set([group, rays, glow, beamsG], { willChange: "transform, opacity" }),
            onComplete: () => gsap.set([group, rays, glow, beamsG], { willChange: "auto" }),
          });
          // The sun is fully up by 70% of the range; rays, glow and warmth keep building to the end
          tl.fromTo(group, { y: 150, scale: 0.8, svgOrigin: origin }, { y: 0, scale: 1, svgOrigin: origin, duration: 0.7 }, 0).fromTo(
            glow,
            { opacity: 0.2 * k, scale: 0.7, svgOrigin: origin },
            { opacity: 0.9 * k, scale: 1.3, svgOrigin: origin, duration: 1 },
            0,
          );

          if (full) {
            tl.fromTo(rays, { rotation: -40, svgOrigin: origin }, { rotation: 40, svgOrigin: origin, duration: 1 }, 0).fromTo(
              rayLines,
              { scaleY: 0.4, transformOrigin: "50% 100%" },
              { scaleY: 1, transformOrigin: "50% 100%", duration: 0.55, stagger: 0.025 },
              0.1,
            );
            if (large) {
              tl.fromTo(beamsG, { opacity: 0, rotation: -6, svgOrigin: origin }, { opacity: k, rotation: 4, svgOrigin: origin, duration: 1 }, 0.15);
            } else {
              tl.fromTo(beamsG, { opacity: 0 }, { opacity: k, duration: 0.8 }, 0.2);
            }
            if (warm.length) {
              tl.fromTo(
                warm,
                { "--sun-a": "#FFE48A", "--sun-b": "#FFCF55", "--sun-c": "#FAB442" },
                { "--sun-a": "#FFC93C", "--sun-b": "#FFAA30", "--sun-c": "#F58A1F", duration: 1 },
                0,
              );
            }
            if (grid.length) tl.fromTo(grid, { opacity: 0.16 }, { opacity: 0.36, duration: 1 }, 0);
            if (large && parallax.length) tl.fromTo(parallax, { y: 0 }, { y: -20, duration: 1 }, 0);
          } else {
            // Phones: simple rise and glow; heading/buttons stay put
            tl.fromTo(rayLines, { scaleY: 0.6, transformOrigin: "50% 100%" }, { scaleY: 1, transformOrigin: "50% 100%", duration: 0.6 }, 0.2);
            if (warm.length) tl.fromTo(warm, { "--sun-a": "#FFE48A", "--sun-b": "#FFCF55", "--sun-c": "#FAB442" }, { "--sun-a": "#FFC93C", "--sun-b": "#FFAA30", "--sun-c": "#F58A1F", duration: 1 }, 0);
          }
          if (reveal.length && full) {
            // Buttons arrive once the sun is half-risen
            tl.fromTo(reveal, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.12, stagger: 0.04 }, 0.33);
          }

          if (scrub) {
            ScrollTrigger.create({ trigger: scene, start: "top 85%", end: "bottom 30%", scrub: 1, animation: tl });
          } else {
            // Play once on enter, eased, instead of scrubbing
            tl.pause();
            ScrollTrigger.create({
              trigger: scene,
              start: "top 90%",
              once: true,
              onEnter: () => gsap.to(tl, { progress: 1, duration: 2.2, ease: "power3.out", delay: 0.3 }),
            });
          }

          // ── Idle loops (only while in view) ──
          const idle: gsap.core.Animation[] = [];
          const spin = gsap.timeline({ paused: true, repeat: -1 }).to(rays, { rotation: "+=360", svgOrigin: origin, duration: 60, ease: "none" });
          idle.push(spin);
          if (full) {
            idle.push(
              gsap.to(rayLines.filter((_, i) => i % 2 === 0), {
                scaleY: 1.15,
                transformOrigin: "50% 100%",
                duration: 1.6,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: { each: 0.2, repeat: -1, yoyo: true },
                paused: true,
              }),
            );
            idle.push(gsap.to(svg.querySelector("[data-sun-pulse]"), { opacity: 0.1 * k, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true }));
            sparkleEls.forEach((s) => {
              idle.push(
                gsap.fromTo(
                  s,
                  { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" },
                  {
                    opacity: 1,
                    scale: 1,
                    transformOrigin: "50% 50%",
                    duration: gsap.utils.random(0.6, 1.4),
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: gsap.utils.random(0.4, 2.2),
                    delay: gsap.utils.random(0, 2),
                    paused: true,
                  },
                ),
              );
            });
          }
          ScrollTrigger.create({
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => idle.forEach((a) => (self.isActive ? a.play() : a.pause())),
            onRefresh: (self) => idle.forEach((a) => (self.isActive ? a.play() : a.pause())),
          });

          // ── Mouse-follow (desktop, fine pointer) ──
          if (large && fine && scene !== svg) {
            const sx = gsap.quickTo(group, "x", { duration: 0.8, ease: "power3.out" });
            const bx = gsap.quickTo(beamsG, "x", { duration: 1.1, ease: "power3.out" });
            const by = gsap.quickTo(beamsG, "y", { duration: 1.1, ease: "power3.out" });
            const onMove = (e: PointerEvent) => {
              const r = scene.getBoundingClientRect();
              const dx = (e.clientX - r.left) / r.width - 0.5;
              const dy = (e.clientY - r.top) / r.height - 0.5;
              sx(dx * 18);
              bx(dx * 26);
              by(dy * 14);
            };
            const onLeave = () => {
              sx(0);
              bx(0);
              by(0);
            };
            (scene as HTMLElement).addEventListener("pointermove", onMove);
            (scene as HTMLElement).addEventListener("pointerleave", onLeave);
            return () => {
              (scene as HTMLElement).removeEventListener("pointermove", onMove);
              (scene as HTMLElement).removeEventListener("pointerleave", onLeave);
            };
          }
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  const s = SCALE[size];
  const coreR = 78;
  const light = tone === "onWarm" ? "#FFFFFF" : "#F7931E";
  const soft = tone === "onWarm" ? "#FFFFFF" : "#FFC93C";

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 300"
      preserveAspectRatio="xMidYMax meet"
      className={`block h-auto w-full overflow-visible ${className}`}
      aria-hidden
      focusable="false"
    >
      <defs>
        <radialGradient id={gid("glow")}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="0.25" stopColor="#FFF1C2" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#FFC93C" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFC93C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gid("core")} cx="42%" cy="36%" r="70%">
          <stop offset="0" stopColor="#FFFBEA" />
          <stop offset="0.45" stopColor="#FFE07A" />
          <stop offset="1" stopColor="#FFC93C" />
        </radialGradient>
        <linearGradient id={gid("beam")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={soft} stopOpacity="0.9" />
          <stop offset="1" stopColor={soft} stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform={`translate(${C.x} ${C.y}) scale(${s}) translate(${-C.x} ${-C.y})`}>
        <g data-sun-group>
          {/* glow (+ a separate pulsing layer so the scrub and the idle pulse don't fight over opacity) */}
          <g data-sun-glow opacity={0.9 * k}>
            <circle cx={C.x} cy={C.y} r="240" fill={`url(#${gid("glow")})`} />
          </g>
          <circle data-sun-pulse cx={C.x} cy={C.y} r="200" fill={`url(#${gid("glow")})`} opacity={0} />

          {/* light beams fanning towards the copy */}
          <g data-sun-beams opacity={k}>
            {BEAM_ANGLES.slice(0, Math.max(0, Math.min(5, beams))).map((a, i) => {
              const tip = polar(-90 + a, 640);
              const l = polar(-90 + a - 2.2, 640);
              return (
                <polygon
                  key={a}
                  {...(i >= 3 ? { "data-beam-extra": "" } : {})}
                  points={`${C.x},${C.y} ${l.x.toFixed(1)},${l.y.toFixed(1)} ${tip.x.toFixed(1)},${tip.y.toFixed(1)}`}
                  fill={`url(#${gid("beam")})`}
                  opacity={0.22}
                />
              );
            })}
          </g>

          {/* rays */}
          <g data-sun-rays>
            {RAYS.map((r) => (
              <g key={r.angle} transform={`rotate(${r.angle} ${C.x} ${C.y})`}>
                <line
                  data-ray
                  x1={C.x}
                  y1={C.y - 104}
                  x2={C.x}
                  y2={C.y - (r.long ? 168 : 140)}
                  stroke={light}
                  strokeOpacity={0.55 + 0.35 * k}
                  strokeWidth={r.long ? 9 : 6}
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>

          {/* halo + core */}
          <circle data-sun-halo cx={C.x} cy={C.y} r="98" fill={soft} opacity={(tone === "onWarm" ? 0.28 : 0.18) + 0.2 * k} />
          {core ? <circle data-sun-core cx={C.x} cy={C.y} r={coreR} fill={`url(#${gid("core")})`} opacity={0.75 + 0.25 * k} /> : null}
          {core ? <circle cx={C.x - 22} cy={C.y - 26} r="20" fill="#FFFFFF" opacity={0.35 * k} /> : null}

          {/* sparkles */}
          {SPARKLES.slice(0, sparkles).map((sp, i) => {
            const p = polar(sp.a, sp.r);
            return (
              <path
                key={i}
                data-sparkle
                d={`M${p.x} ${p.y - sp.s * 2.4}L${p.x + sp.s * 0.6} ${p.y - sp.s * 0.6}L${p.x + sp.s * 2.4} ${p.y}L${p.x + sp.s * 0.6} ${p.y + sp.s * 0.6}L${p.x} ${p.y + sp.s * 2.4}L${p.x - sp.s * 0.6} ${p.y + sp.s * 0.6}L${p.x - sp.s * 2.4} ${p.y}L${p.x - sp.s * 0.6} ${p.y - sp.s * 0.6}Z`}
                fill={light}
                opacity={0.85}
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
}
