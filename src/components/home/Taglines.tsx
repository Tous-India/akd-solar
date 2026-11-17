"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { taglines } from "@/lib/data";

/** Home quote section (between Recent projects and the closing CTA). With more than one tag line it fades to the next every 8 s. */
export function Taglines() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (taglines.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % taglines.length), 8000);
    return () => window.clearInterval(id);
  }, []);
  const t = taglines[i];
  return (
    <section aria-label="Tag line" className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(720px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(247_147_30/0.16)_0%,rgb(247_147_30/0.06)_40%,transparent_70%)]"
      />
      <Container className="relative">
        <figure key={i} className="tagline-fade mx-auto max-w-4xl text-center">
          <span aria-hidden className="block font-display text-6xl leading-none text-sun sm:text-7xl">
            “
          </span>
          <blockquote className="-mt-4 font-display text-[clamp(1.25rem,1rem+1.2vw,2rem)] leading-snug font-bold tracking-tight text-ink">
            {t.text}
          </blockquote>
          <figcaption className="mt-5 text-sm font-bold tracking-[0.16em] text-sun-deep uppercase">— {t.author}</figcaption>
          {taglines.length > 1 ? (
            <div aria-hidden className="mt-5 flex justify-center gap-2">
              {taglines.map((q, n) => (
                <span key={q.author} className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-sun" : "w-1.5 bg-ink/20"}`} />
              ))}
            </div>
          ) : null}
        </figure>
      </Container>
    </section>
  );
}
