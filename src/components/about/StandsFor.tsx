"use client";

import { useId, useRef, useState } from "react";
import { gsap, MQ, onceInView, useGSAP } from "@/lib/gsap";
import { akdStandsFor, type StandsForItem } from "@/lib/data";

const TONE: Record<StandsForItem["tone"], string> = {
  // white text fails on brand orange, so the orange circle carries ink text (7.4:1)
  sun: "bg-sun text-ink",
  green: "bg-[#2E8B1E] text-white",
  blue: "bg-panel text-white",
  red: "bg-[#D7141A] text-white",
};

type Props = { size?: "md" | "lg"; className?: string; /** hide the small label when a heading already says it */ label?: boolean };

/**
 * "AKD SOLAR stands for": 8 connected letter circles. Hover, focus or tap a circle to show its description
 * in the card below (one shared card, so it can never overflow the page). Scrolls sideways with snap on narrow screens.
 */
export function StandsFor({ size = "md", className = "", label = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const [active, setActive] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const shown = active ?? pinned;
  const item = shown === null ? null : akdStandsFor[shown];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const circles = gsap.utils.toArray<HTMLElement>("[data-letter]", ref.current);
        const line = ref.current?.querySelector("[data-line]");
        gsap.set(circles, { autoAlpha: 0, scale: 0.6, y: 10 });
        if (line) gsap.set(line, { scaleX: 0 });
        return onceInView(ref.current!, () => {
          if (line) gsap.to(line, { scaleX: 1, duration: 0.9, ease: "power2.out" });
          gsap.to(circles, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "back.out(1.8)" });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const circle = size === "lg" ? "size-14 text-2xl sm:size-16 sm:text-[1.75rem]" : "size-12 text-xl sm:size-14 sm:text-2xl";
  const cardId = `${uid}-desc`;

  return (
    <div ref={ref} className={className}>
      {label ? <p className="mb-3 font-display text-xs font-bold tracking-[0.2em] text-sun-deep uppercase">AKD Solar stands for</p> : null}
      <div className="-mx-4 snap-x snap-mandatory overflow-x-auto px-4 pb-1 [scrollbar-width:thin] sm:mx-0 sm:px-0">
        <ol className="relative flex w-max min-w-full justify-between gap-1 sm:gap-2" onMouseLeave={() => setActive(null)}>
          <span aria-hidden data-line className={`absolute inset-x-6 h-0.5 origin-left bg-gradient-to-r from-sun via-[#2E8B1E] to-[#D7141A] ${size === "lg" ? "top-7 sm:top-8" : "top-6 sm:top-7"}`} />
          {akdStandsFor.map((s, i) => {
            const on = shown === i;
            return (
              <li key={`${s.letter}-${s.word}`} className="relative flex w-[4.25rem] shrink-0 snap-start flex-col items-center sm:w-[4.75rem]">
                <button
                  type="button"
                  data-letter
                  aria-describedby={on ? cardId : undefined}
                  aria-pressed={pinned === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setPinned((p) => (p === i ? null : i))}
                  className={`relative flex items-center justify-center rounded-full font-display font-extrabold ring-4 ring-cream transition-transform duration-300 ${circle} ${TONE[s.tone]} ${
                    on ? "scale-110 shadow-[0_10px_24px_-10px_rgb(16_24_40/0.5)]" : "hover:scale-105"
                  }`}
                >
                  <span aria-hidden>{s.letter}</span>
                  <span className="sr-only">
                    {s.letter} — {s.word}
                  </span>
                </button>
                <span aria-hidden className={`mt-2 text-center text-[0.72rem] leading-tight font-semibold sm:text-xs ${on ? "text-ink" : "text-muted"}`}>
                  {s.word}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <div
        id={cardId}
        aria-live="polite"
        className={`mt-3 min-h-[4.5rem] rounded-card border px-4 py-3 text-sm leading-relaxed transition-colors ${
          item ? "border-sun/40 bg-white text-ink/85" : "border-dashed border-line text-muted"
        }`}
      >
        {item ? (
          <>
            <span className="font-display font-bold text-ink">
              {item.letter} — {item.word}:{" "}
            </span>
            {item.text}
          </>
        ) : (
          "Hover over or tap a letter to see what it means."
        )}
      </div>
    </div>
  );
}

/** Full list for the About page */
export function StandsForList() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {akdStandsFor.map((s) => (
        <li key={`${s.letter}-${s.word}`} className="flex gap-4 rounded-card border border-line bg-white p-4 sm:p-5">
          <span aria-hidden className={`flex size-11 shrink-0 items-center justify-center rounded-full font-display text-xl font-extrabold ${TONE[s.tone]}`}>
            {s.letter}
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">
              <span className="sr-only">{s.letter} — </span>
              {s.word}
            </h3>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
