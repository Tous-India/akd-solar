"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SunriseBackdrop } from "@/components/ui/SunriseBackdrop";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { HeroIllustration } from "./HeroIllustration";

// `phoneBreak` ends a line below 640px so phones get four short, font-independent lines (no reflow when Sora loads)
const LINES: { text: string; className?: string; phoneBreak?: boolean }[][] = [
  [{ text: "Power" }, { text: "your" }, { text: "home", phoneBreak: true }, { text: "with" }, { text: "the" }, { text: "sun.", className: "text-sun-deep" }],
  [{ text: "Pay" }, { text: "less,", phoneBreak: true }, { text: "live" }, { text: "greener.", className: "text-solar" }],
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Intro + scroll parallax on desktop only; phones paint the hero immediately (fast LCP)
      mm.add(MQ.desktop, () => {
        // CSS keeps [data-intro] hidden until now. Reveal explicitly: autoAlpha would read that hidden state as 0.
        gsap.set("[data-intro]", { visibility: "visible" });

        // Entrance runs on the inner elements and ends at their natural CSS state
        gsap
          .timeline({ delay: 0.2 })
          .from("[data-word]", { yPercent: 110, duration: 1, stagger: 0.06, ease: "power4.out", clearProps: "transform" })
          .from("[data-hero-fade]", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, clearProps: "opacity,transform" }, "-=0.6")
          .from("[data-hero-art]", { opacity: 0, y: 40, duration: 1.2, clearProps: "opacity,transform" }, 0.3);

        // Scroll parallax runs on outer wrappers, transform only: hero text and buttons never lose opacity
        const exit = { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6 };
        gsap.fromTo("[data-hero-heading]", { y: 0 }, { y: -60, ease: "none", scrollTrigger: exit });
        gsap.to("[data-hero-art-scroll]", { yPercent: -8, ease: "none", scrollTrigger: exit });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 pb-12 sm:pt-32 lg:pt-36 lg:pb-20">
      <SunriseBackdrop glowClass="-top-[20%] right-[-45%] sm:right-[-20%] lg:-top-[30%] lg:right-[-12%]" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
        <div className="max-w-2xl">
          <p
            data-intro
            data-hero-fade
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-white/80 py-1.5 pr-4 pl-1.5 text-sm font-medium text-ink"
          >
            <span className="rounded-full bg-akd px-2.5 py-0.5 text-xs font-bold tracking-wide text-white uppercase">New</span>
            <span className="truncate">PM Surya Ghar subsidy up to ₹78,000</span>
          </p>

          <div data-hero-heading>
            <h1 data-intro className="mt-6 text-hero font-extrabold tracking-[-0.04em] text-ink">
              {LINES.map((line, li) => (
                <span key={li} className="block">
                  {line.map((w, wi) => (
                    <span key={wi}>
                      <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                        <span data-word className={`inline-block ${w.className ?? ""}`}>
                          {w.text}
                        </span>
                      </span>
                      {wi < line.length - 1 ? (w.phoneBreak ? <><br className="sm:hidden" /><span className="max-sm:hidden"> </span></> : " ") : null}
                    </span>
                  ))}
                  {li < LINES.length - 1 ? " " : null}
                </span>
              ))}
            </h1>
          </div>

          <p data-intro data-hero-fade className="mt-6 max-w-xl text-lead text-muted">
            AKD Solar designs, installs and maintains rooftop solar for Indian homes and businesses. We handle the survey, the subsidy paperwork and
            net-metering — you just watch your bill shrink.
          </p>

          <div data-intro data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" size="lg" magnetic className="w-full hover:bg-[#E5850F]! sm:w-auto">
              Get Free Site Survey
            </Button>
            <Button href="/calculator" size="lg" variant="secondary" icon="sun" className="w-full bg-white! sm:w-auto">
              Calculate Savings
            </Button>
          </div>

          <ul data-intro data-hero-fade className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-ink">
            {["Free site survey", "Installed in ~7 days", "EMI options available"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-solar/15 text-solar-deep">
                  <Icon name="check" className="size-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div data-hero-art-scroll className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div data-intro data-hero-art className="relative">
            <HeroIllustration />
            <div className="absolute top-[6%] left-0 flex items-center gap-3 rounded-card border border-line bg-white/90 px-3 py-2.5 shadow-[0_12px_30px_-18px_rgb(16_24_40/0.4)] backdrop-blur sm:px-4 sm:py-3">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-solar" />
              </span>
              <span className="text-xs leading-tight sm:text-sm">
                <span className="block text-muted">Generating now</span>
                <span className="font-display font-bold text-ink">4.8 kW</span>
              </span>
            </div>
            <div className="absolute right-0 bottom-[4%] rounded-card border border-line bg-white/90 px-3 py-2.5 shadow-[0_12px_30px_-18px_rgb(16_24_40/0.4)] backdrop-blur sm:px-4 sm:py-3">
              <span className="block text-xs text-muted sm:text-sm">Monthly bill</span>
              <span className="font-display text-sm font-bold text-ink sm:text-base">
                <s className="font-semibold text-muted decoration-akd decoration-2">₹4,200</s> <span aria-hidden>→</span>{" "}
                <span className="text-solar-deep">₹350</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
