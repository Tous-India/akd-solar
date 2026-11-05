"use client";

import { useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { gsap, MQ, prefersReducedMotion, useGSAP } from "@/lib/gsap";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);
import { projects, type ProjectCategory } from "@/lib/data";
import { ProjectCard } from "./ProjectCard";

type Filter = "all" | ProjectCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "agricultural", label: "Agricultural" },
];

export function ProjectsGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const counts = FILTERS.reduce<Record<Filter, number>>(
    (acc, f) => ({ ...acc, [f.id]: f.id === "all" ? projects.length : projects.filter((p) => p.category === f.id).length }),
    { all: 0, residential: 0, commercial: 0, agricultural: 0 },
  );

  const choose = (next: Filter) => {
    if (next === filter) return;
    if (!prefersReducedMotion() && ref.current) {
      flipState.current = Flip.getState(ref.current.querySelectorAll("[data-project]"));
    }
    setFilter(next);
  };

  // Entrance on scroll
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;
        const scrollTrigger = { trigger: "[data-grid]", start: "top 85%", once: true };
        gsap.from("[data-project]", { y: desktop ? 40 : 20, autoAlpha: 0, duration: 0.8, stagger: 0.08, scrollTrigger });
        // Artwork wipes up and settles from 1.1 → 1 (desktop)
        if (desktop) {
          gsap.fromTo(
            "[data-project] [data-clip]",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut", stagger: 0.08, scrollTrigger },
          );
          gsap.fromTo("[data-project] [data-clip] > svg", { scale: 1.1 }, { scale: 1, duration: 1.5, stagger: 0.08, scrollTrigger });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // Animate the layout change after React re-renders
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.7,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.15 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.4 }),
      });
    },
    { dependencies: [filter], scope: ref },
  );

  const visible = filter === "all" ? projects.length : counts[filter];

  return (
    <div ref={ref}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter projects" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(f.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-[0.95rem] font-semibold transition-colors duration-300 ${
                  active ? "border-navy bg-navy text-cream" : "border-line bg-white text-ink hover:border-ink/30"
                }`}
              >
                {f.label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/15 text-gold" : "bg-sand text-muted"}`}>{counts[f.id]}</span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="text-sm text-muted">
          Showing {visible} project{visible === 1 ? "" : "s"}
        </p>
      </div>

      <ul data-grid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => {
          const show = filter === "all" || p.category === filter;
          return (
            <li key={p.id} data-project data-flip-id={p.id} className={show ? "" : "hidden"} aria-hidden={!show}>
              <ProjectCard project={p} index={i} headingLevel="h2" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
