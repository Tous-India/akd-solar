"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { testimonials } from "@/lib/data";

const AUTOPLAY_SECONDS = 6;

export function Testimonials() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const pointerStart = useRef<number | null>(null);
  const firstRun = useRef(true);

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const count = testimonials.length;

  const [inView, setInView] = useState(false);

  useEffect(() => setReduced(prefersReducedMotion()), []);

  // Autoplay only while the slider is on screen (no off-screen work, kinder to batteries)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  // Slide to the active testimonial
  useGSAP(
    () => {
      gsap.to(trackRef.current, { xPercent: -100 * index, duration: prefersReducedMotion() ? 0 : 0.9, ease: "power3.inOut" });
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      gsap.fromTo(
        `[data-slide="${index}"] [data-slide-inner]`,
        { autoAlpha: prefersReducedMotion() ? 1 : 0.2, y: prefersReducedMotion() ? 0 : 12 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.25 },
      );
    },
    { dependencies: [index], scope: rootRef },
  );

  // Autoplay driven by a progress bar tween; pauses on hover/focus or when the user pauses
  const paused = hovered || userPaused || reduced || !inView;
  useEffect(() => {
    timer.current?.kill();
    const bar = progressRef.current;
    if (!bar) return;
    gsap.set(bar, { scaleX: 0 });
    timer.current = gsap.to(bar, {
      scaleX: 1,
      duration: AUTOPLAY_SECONDS,
      ease: "none",
      paused: true,
      onComplete: () => go(index + 1),
    });
    return () => {
      timer.current?.kill();
    };
  }, [index, go]);

  useEffect(() => {
    if (paused) timer.current?.pause();
    else timer.current?.resume();
  }, [paused, index]);

  // Pause when the tab is hidden
  useEffect(() => {
    const onVis = () => (document.hidden ? timer.current?.pause() : !paused && timer.current?.resume());
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [paused]);

  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Customer stories"
            title="Families and businesses who switched — and never looked back."
          />
          <div className="mt-8 flex items-center gap-4">
            <div className="flex text-gold" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Icon key={i} name="star" className="size-5" />
              ))}
            </div>
            <p className="text-muted">
              <span className="font-display font-bold text-ink">4.9 / 5</span> from 640+ Google reviews
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous testimonial"
              className="flex size-12 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink/40"
            >
              <Icon name="chevronLeft" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next testimonial"
              className="flex size-12 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink/40"
            >
              <Icon name="chevronRight" className="size-5" />
            </button>
            {!reduced ? (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Resume automatic slideshow" : "Pause automatic slideshow"}
                className="flex size-12 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-white hover:text-ink"
              >
                <Icon name={userPaused ? "play" : "pause"} className="size-5" />
              </button>
            ) : null}
          </div>
        </div>

        <div
          ref={rootRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
          onFocus={(e) => e.target.matches(":focus-visible") && setHovered(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false);
          }}
          className="min-w-0"
        >
          <div
            className="touch-pan-y overflow-hidden rounded-card border border-line bg-white select-none"
            onPointerDown={(e) => {
              pointerStart.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (pointerStart.current === null) return;
              const dx = e.clientX - pointerStart.current;
              pointerStart.current = null;
              if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
            }}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
          >
            <div ref={trackRef} className="flex" aria-live={paused ? "polite" : "off"}>
              {testimonials.map((t, i) => (
                <figure
                  key={t.name}
                  data-slide={i}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={i !== index}
                  inert={i !== index}
                  className="relative w-full shrink-0 p-7 sm:p-10 lg:p-12"
                >
                  <div data-slide-inner>
                    <Icon name="quote" className="size-10 text-sun" />
                    <blockquote className="mt-6 font-display text-[clamp(1.125rem,1rem+0.7vw,1.5rem)] leading-relaxed font-semibold tracking-[-0.015em] text-ink">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy font-display font-bold text-gold">
                        {t.initials}
                      </span>
                      <span>
                        <span className="block font-semibold text-ink">{t.name}</span>
                        <span className="block text-sm text-muted">{t.role}</span>
                      </span>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
            <div className="h-1 bg-sand">
              <div ref={progressRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-sun to-gold" />
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-1" role="group" aria-label="Choose testimonial">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show testimonial ${i + 1}: ${t.name}`}
                aria-current={i === index}
                className="group flex size-11 items-center justify-center"
              >
                <span className={`block h-2 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-sun" : "w-2 bg-ink/20 group-hover:bg-ink/40"}`} />
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
