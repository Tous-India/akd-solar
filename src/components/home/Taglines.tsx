"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { taglines } from "@/lib/data";

/** Quote strip under the home banner. With more than one tag line it fades to the next every 7 s. */
export function Taglines() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (taglines.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % taglines.length), 7000);
    return () => window.clearInterval(id);
  }, []);
  const t = taglines[i];
  return (
    <section aria-label="Tag line" className="border-y border-line bg-sand/60">
      <Container className="py-6 sm:py-7">
        <figure key={i} className="tagline-fade mx-auto max-w-4xl text-center">
          <blockquote className="font-display text-[clamp(1.05rem,0.9rem+0.7vw,1.4rem)] leading-snug font-semibold text-ink">
            <span className="text-sun-deep">“</span>
            {t.text}
            <span className="text-sun-deep">”</span>
          </blockquote>
          <figcaption className="mt-2 text-sm font-bold tracking-[0.14em] text-sun-deep uppercase">— {t.author}</figcaption>
        </figure>
      </Container>
    </section>
  );
}
