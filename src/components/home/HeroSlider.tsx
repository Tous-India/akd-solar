"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Countdown } from "@/components/subsidy/Countdown";
import { IntroAnimate } from "@/components/motion/IntroAnimate";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import { HeroIllustration } from "./HeroIllustration";

const AUTOPLAY_MS = 6000;
const SLIDES = 3;
const HERO_PHOTO = { src: "/images/projects/p01-1.jpg", width: 1296, height: 972 };

export function HeroSlider() {
  const rootRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const pointerStart = useRef<number | null>(null);
  const firstRun = useRef(true);

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);

  const go = useCallback((n: number) => setIndex(((n % SLIDES) + SLIDES) % SLIDES), []);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const el = rootRef.current;
    const io = el ? new IntersectionObserver(([e]) => setInView(e.isIntersecting)) : null;
    if (el && io) io.observe(el);
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Cross-fade to the active slide (instant with reduced motion)
  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", slidesRef.current);
      const reduce = prefersReducedMotion();
      if (firstRun.current) {
        firstRun.current = false;
        gsap.set(slides, { autoAlpha: (i: number) => (i === index ? 1 : 0) });
        return;
      }
      slides.forEach((s, i) => {
        if (i === index) gsap.fromTo(s, { autoAlpha: 0, x: reduce ? 0 : 24 }, { autoAlpha: 1, x: 0, duration: reduce ? 0 : 0.7, ease: "power3.out", overwrite: true });
        else gsap.to(s, { autoAlpha: 0, x: reduce ? 0 : -24, duration: reduce ? 0 : 0.45, ease: "power2.in", overwrite: true, clearProps: "x" });
      });
    },
    { dependencies: [index], scope: slidesRef },
  );

  // Autoplay driven by the progress bar
  const paused = hovered || userPaused || reduced || !inView || tabHidden;
  useEffect(() => {
    timer.current?.kill();
    const bar = progressRef.current;
    if (!bar) return;
    gsap.set(bar, { scaleX: 0 });
    timer.current = gsap.to(bar, { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: "none", paused: true, onComplete: () => go(index + 1) });
    return () => {
      timer.current?.kill();
    };
  }, [index, go]);

  useEffect(() => {
    if (paused) timer.current?.pause();
    else timer.current?.resume();
  }, [paused, index]);

  const slideProps = (i: number) => ({
    "data-slide": i,
    role: "group" as const,
    "aria-roledescription": "slide",
    "aria-label": `${i + 1} of ${SLIDES}`,
    "aria-hidden": i !== index,
    inert: i !== index,
    // Every slide shares one grid cell, so the slider is as tall as its tallest slide (no layout shift)
    className: `col-start-1 row-start-1 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 ${i === 0 ? "" : "invisible opacity-0"}`,
  });

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative overflow-hidden pt-24 pb-10 sm:pt-28 xl:pt-32"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sun-glow absolute -top-[20%] right-[-30%] aspect-square w-[min(820px,130vw)] rounded-full opacity-70" />
      </div>

      <Container className="relative">
        <IntroAnimate>
          <div
            ref={slidesRef}
            className="grid touch-pan-y"
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
            {/* 1 · Illustration */}
            <div {...slideProps(0)}>
              <div className="max-w-xl">
                <h1 data-intro className="text-hero font-extrabold tracking-[-0.035em] text-ink">
                  Pay less. <span className="text-solar">Live greener.</span>
                </h1>
                <p data-intro className="mt-4 text-lead text-muted">
                  Rooftop solar for homes and businesses in Sonipat and Delhi NCR, installed in as little as {site.numbers.installDays} days.
                </p>
                <div data-intro className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button href="/contact" size="lg" magnetic>
                    Get Free Quote
                  </Button>
                  <Button href="/calculator" size="lg" variant="secondary" icon="sun" className="bg-white!">
                    Calculate Savings
                  </Button>
                </div>
              </div>
              <div data-intro className="mx-auto w-full max-w-[520px] lg:max-w-none">
                <HeroIllustration active={index === 0} />
              </div>
            </div>

            {/* 2 · Subsidy countdown */}
            <div {...slideProps(1)}>
              <div className="max-w-xl">
                <p className="text-sm font-bold tracking-[0.14em] text-sun-deep uppercase">PM Surya Ghar Yojana</p>
                <h2 className="mt-3 text-hero font-extrabold tracking-[-0.035em] text-ink">
                  Up to <span className="text-sun-deep">₹78,000</span> subsidy
                </h2>
                <p className="mt-4 text-lead text-muted">Central subsidy for home rooftop solar. Applications close 31 March 2027.</p>
                <div className="mt-7">
                  <Button href="/pm-surya-ghar-yojana" size="lg">
                    Check subsidy
                  </Button>
                </div>
              </div>
              <div className="w-full">
                <Countdown variant="big" />
                <p className="mt-3 text-center text-sm text-muted">Time left to apply</p>
              </div>
            </div>

            {/* 3 · Real installation */}
            <div {...slideProps(2)}>
              <div className="max-w-xl">
                <p className="text-sm font-bold tracking-[0.14em] text-solar-deep uppercase">Our work</p>
                <h2 className="mt-3 text-hero font-extrabold tracking-[-0.035em] text-ink">
                  {site.numbers.installations} rooftops powered in Haryana
                </h2>
                <p className="mt-4 text-lead text-muted">Homes, shops, factories and farms — installed by our own crew.</p>
                <div className="mt-7">
                  <Button href="/projects" size="lg" variant="dark">
                    View projects
                  </Button>
                </div>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card">
                <Image
                  src={HERO_PHOTO.src}
                  alt="AKD Solar rooftop installation on a commercial building"
                  width={HERO_PHOTO.width}
                  height={HERO_PHOTO.height}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="flex size-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink/40"
            >
              <Icon name="chevronLeft" className="size-5" />
            </button>
            <div className="flex items-center" role="group" aria-label="Choose slide">
              {Array.from({ length: SLIDES }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === index}
                  className="group flex size-11 items-center justify-center"
                >
                  <span className={`block h-2 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-sun" : "w-2 bg-ink/25 group-hover:bg-ink/45"}`} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="flex size-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink/40"
            >
              <Icon name="chevronRight" className="size-5" />
            </button>
            {!reduced ? (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? "Resume automatic slides" : "Pause automatic slides"}
                className="flex size-11 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-white hover:text-ink"
              >
                <Icon name={userPaused ? "play" : "pause"} className="size-5" />
              </button>
            ) : null}
            <div aria-hidden className="ml-2 hidden h-0.5 max-w-40 flex-1 overflow-hidden rounded-full bg-ink/10 sm:block">
              <div ref={progressRef} className="h-full origin-left scale-x-0 bg-sun" />
            </div>
          </div>
        </IntroAnimate>
      </Container>
    </section>
  );
}
