"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Icon, type IconName } from "@/components/ui/Icon";
import { gsap, MQ, onceInView, useGSAP } from "@/lib/gsap";
import { formatINR, formatNumber } from "@/lib/format";

// Illustrative example used on the home page (matches the hero chip). Not a specific customer.
const BEFORE = 4200;
const AFTER = 350;
const GENERATION = 610;

type Stage = { key: string; icon: IconName; label: string; title: string; text: string };

const STAGES: Stage[] = [
  {
    key: "today",
    icon: "rupee",
    label: "Your bill today",
    title: "₹4,200 a month, rising every summer",
    text: "About 520 units a month for a family with two air-conditioners — every unit bought from the grid.",
  },
  {
    key: "installed",
    icon: "sun",
    label: "Solar installed",
    title: "5 kW on the roof, ~610 units a month",
    text: "Panels cover the daytime load and bank the surplus with your DISCOM through net-metering.",
  },
  {
    key: "after",
    icon: "leaf",
    label: "Your bill after",
    title: "₹350 — fixed charges and a little night use",
    text: "Roughly ₹46,000 saved every year, for 25 years, with the subsidy already in your account.",
  },
];

export function BillStory() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-stage-panel]");
        const steps = gsap.utils.toArray<HTMLElement>("[data-stage-step]");
        const bill = ref.current?.querySelector<HTMLElement>("[data-bill-num]");
        const units = ref.current?.querySelector<HTMLElement>("[data-units-num]");
        const after = ref.current?.querySelector<HTMLElement>("[data-after-num]");
        if (!bill || !units || !after) return;

        gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 });
        const counter = { bill: 0, units: 0, after: BEFORE };
        const render = () => {
          bill.textContent = formatINR(counter.bill);
          units.textContent = formatNumber(counter.units);
          after.textContent = formatINR(counter.after);
        };
        render();

        const setStep = (i: number) => steps.forEach((s, j) => s.classList.toggle("is-active", j === i));
        setStep(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => setStep(Math.min(2, Math.floor(self.progress * 3))),
          },
        });
        tl.to(counter, { bill: BEFORE, duration: 1, onUpdate: render })
          .to("[data-progress-fill]", { scaleY: 1 / 3, duration: 1 }, 0)
          .to(panels[0], { autoAlpha: 0, y: -40, duration: 0.4 }, 1.1)
          .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 1.25)
          .to(counter, { units: GENERATION, duration: 1, onUpdate: render }, 1.4)
          .to("[data-story-panel]", { opacity: 1, stagger: 0.05, duration: 0.5 }, 1.4)
          .to("[data-progress-fill]", { scaleY: 2 / 3, duration: 1 }, 1.25)
          .to(panels[1], { autoAlpha: 0, y: -40, duration: 0.4 }, 2.5)
          .to(panels[2], { autoAlpha: 1, y: 0, duration: 0.4 }, 2.65)
          .to(counter, { after: AFTER, duration: 1, onUpdate: render }, 2.8)
          .to("[data-progress-fill]", { scaleY: 1, duration: 1 }, 2.65)
          .to({}, { duration: 0.3 });

        return () => {
          steps.forEach((s) => s.classList.remove("is-active"));
          bill.textContent = formatINR(BEFORE);
          units.textContent = formatNumber(GENERATION);
          after.textContent = formatINR(AFTER);
        };
      });
      // Tablet / mobile: light staggered fade, no pinning
      mm.add(MQ.light, () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-stage-panel]");
        if (!panels.length) return;
        gsap.set(panels, { y: 20, autoAlpha: 0 });
        return onceInView(panels[0], () => gsap.to(panels, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1, overwrite: true }));
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="bill-story-title" className="relative overflow-hidden py-20 sm:py-28 desk:flex desk:min-h-screen desk:items-center desk:py-0">
      <Container className="grid gap-10 desk:grid-cols-[0.9fr_1.1fr] desk:items-center desk:gap-16">
        <div>
          <Eyebrow>What solar does to a real bill</Eyebrow>
          <h2 id="bill-story-title" className="mt-4 text-h2 font-bold text-ink">
            From ₹4,200 to ₹350 a month — in three steps.
          </h2>
          <p className="mt-4 max-w-xl text-lead text-muted">An illustrative 5 kW home in Haryana. Scroll to watch the bill change.</p>

          <div className="relative mt-10 hidden desk:block">
            <div aria-hidden className="absolute top-3 bottom-3 left-[21px] w-0.5 bg-ink/10">
              <div data-progress-fill className="h-full w-full origin-top scale-y-0 bg-gradient-to-b from-sun via-gold to-leaf" />
            </div>
            <ol className="relative space-y-2">
            {STAGES.map((s, i) => (
              <li key={s.key} data-stage-step className="group relative flex items-center gap-5 py-3">
                <span className="relative z-10 flex size-11 items-center justify-center rounded-full border-2 border-line bg-cream text-muted transition-all duration-500 group-[.is-active]:border-sun group-[.is-active]:bg-sun group-[.is-active]:text-ink">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <span className="font-display text-lg font-semibold text-ink/50 transition-colors duration-500 group-[.is-active]:text-ink">
                  {String(i + 1).padStart(2, "0")} · {s.label}
                </span>
              </li>
            ))}
            </ol>
          </div>
        </div>

        {/* Mobile / tablet / reduced motion: three stacked cards. Desktop: panels cross-fade in one frame. */}
        <div className="grid gap-4 desk:relative desk:block desk:h-[440px]">
          {STAGES.map((s, i) => (
            <article
              key={s.key}
              data-stage-panel
              className={`on-dark relative overflow-hidden rounded-card p-6 text-cream sm:p-8 desk:absolute desk:inset-0 desk:p-10 ${
                i === 2 ? "bg-solar-deep" : "bg-navy"
              }`}
            >
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="panel-grid-dark absolute inset-0" />
                <div className={`sun-glow absolute -top-40 -right-40 size-[460px] rounded-full ${i === 0 ? "opacity-30" : "opacity-60"}`} />
              </div>
              <div className="relative flex h-full flex-col">
                <span className="flex items-center gap-2 text-sm font-bold tracking-[0.14em] text-gold uppercase">
                  <Icon name={s.icon} className="size-4" /> {String(i + 1).padStart(2, "0")} · {s.label}
                </span>
                <p className="mt-6 font-display text-[clamp(3rem,2rem+4vw,5.5rem)] leading-none font-extrabold tracking-[-0.045em]">
                  {i === 0 ? <span data-bill-num>{formatINR(BEFORE)}</span> : null}
                  {i === 1 ? (
                    <>
                      <span data-units-num>{formatNumber(GENERATION)}</span>
                      <span className="ml-2 text-[0.4em] text-gold">units / month</span>
                    </>
                  ) : null}
                  {i === 2 ? <span data-after-num>{formatINR(AFTER)}</span> : null}
                </p>
                <h3 className="mt-5 font-display text-xl font-bold sm:text-2xl">{s.title}</h3>
                <p className="mt-2 max-w-md text-cream/75">{s.text}</p>
                {i === 1 ? (
                  <div aria-hidden className="mt-auto hidden grid-cols-6 gap-1.5 pt-6 desk:grid">
                    {Array.from({ length: 12 }, (_, j) => (
                      <span key={j} data-story-panel className="h-6 skew-x-[-12deg] rounded-[2px] bg-gradient-to-br from-sky to-panel opacity-25" />
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
      <p className="sr-only">
        Example: a monthly bill of {formatINR(BEFORE)} drops to about {formatINR(AFTER)} after a 5 kW rooftop system generating about {GENERATION} units a month.
      </p>
    </section>
  );
}
