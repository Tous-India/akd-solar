"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Parts = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function partsUntil(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
    done: ms === 0,
  };
}

/** Live countdown to the PM Surya Ghar deadline. Returns null on the server and first render (no hydration mismatch). */
export function useCountdown(deadline: string = site.subsidyDeadline) {
  const [parts, setParts] = useState<Parts | null>(null);
  useEffect(() => {
    const target = new Date(deadline).getTime();
    const tick = () => setParts(partsUntil(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);
  return parts;
}

const pad = (n: number) => String(n).padStart(2, "0");

type Props = { variant?: "inline" | "big"; tone?: "light" | "dark"; className?: string };

/** inline: "139d 04h 12m 09s" · big: four boxes */
export function Countdown({ variant = "inline", tone = "light", className = "" }: Props) {
  const p = useCountdown();
  const units = [
    { label: "Days", value: p ? String(p.days) : "–" },
    { label: "Hours", value: p ? pad(p.hours) : "–" },
    { label: "Minutes", value: p ? pad(p.minutes) : "–" },
    { label: "Seconds", value: p ? pad(p.seconds) : "–" },
  ];
  const srText = p ? (p.done ? "The subsidy window has closed." : `${p.days} days, ${p.hours} hours and ${p.minutes} minutes left`) : "";

  if (variant === "big") {
    return (
      <div className={className}>
        <span className="sr-only" aria-live="off">
          {srText}
        </span>
        <ol aria-hidden className="grid grid-cols-4 gap-2">
          {units.map((u) => (
            <li
              key={u.label}
              data-countdown={u.label.toLowerCase()}
              className={`rounded-card border px-2 py-2 text-center sm:px-3 sm:py-3 ${
                tone === "dark" ? "border-white/15 bg-white/[0.06] text-cream" : "border-line bg-white text-ink"
              }`}
            >
              <span className="block font-display text-[clamp(1.35rem,3.2vw,2rem)] leading-none font-extrabold tabular-nums">{u.value}</span>
              <span className={`mt-1 block text-[0.65rem] font-semibold tracking-wide uppercase ${tone === "dark" ? "text-cream/70" : "text-muted"}`}>
                {u.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <span className={`tabular-nums ${className}`} data-countdown="inline">
      <span className="sr-only">{srText}</span>
      <span aria-hidden className="inline-flex gap-2">
        <span>{p ? p.days : "––"}d</span>
        <span>{p ? pad(p.hours) : "––"}h</span>
        <span>{p ? pad(p.minutes) : "––"}m</span>
        <span>{p ? pad(p.seconds) : "––"}s</span>
      </span>
    </span>
  );
}

/** Just the days, for small screens */
export function DaysLeft({ className = "" }: { className?: string }) {
  const p = useCountdown();
  return (
    <span className={`tabular-nums ${className}`} data-countdown="days">
      {p ? `${p.days} days left` : "–– days left"}
    </span>
  );
}
