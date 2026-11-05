"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/lib/data";

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-steps]", start: "top 65%", end: "bottom 65%", scrub: 1 },
          },
        );
        steps.forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 65%",
            onEnter: () => step.classList.add("is-lit"),
            onLeaveBack: () => step.classList.remove("is-lit"),
          });
          gsap.from(step.querySelector("[data-step-body]"), {
            x: 24,
            autoAlpha: 0,
            duration: 0.8,
            scrollTrigger: { trigger: step, start: "top 85%", once: true },
          });
        });
      });

      mm.add(MQ.reduce, () => {
        gsap.set("[data-progress]", { scaleY: 1 });
        steps.forEach((s) => s.classList.add("is-lit"));
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-sand py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="How it works"
            title="From first call to free electricity in six calm steps."
            subtitle="No running between offices. One project manager, one WhatsApp group, and clear timelines you can hold us to."
          />
          <div className="mt-8">
            <Button href="/contact" magnetic>
              Book my free survey
            </Button>
          </div>
        </div>

        <div data-steps className="relative">
          <div aria-hidden className="absolute top-2 bottom-2 left-[27px] w-0.5 rounded-full bg-ink/10">
            <div data-progress className="h-full w-full origin-top rounded-full bg-gradient-to-b from-sun via-gold to-leaf" />
          </div>
          <ol className="relative">
          {processSteps.map((step, i) => (
            <li key={step.title} data-step className="group relative flex gap-5 pb-10 last:pb-0 sm:gap-7">
              <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-line bg-cream text-muted transition-all duration-500 group-[.is-lit]:border-sun group-[.is-lit]:bg-sun group-[.is-lit]:text-ink group-[.is-lit]:shadow-[0_0_0_8px_rgb(247_147_30/0.15)]">
                <Icon name={step.icon} className="size-6" />
              </div>
              <div data-step-body className="flex-1 rounded-card border border-line bg-cream p-5 transition-colors duration-500 group-[.is-lit]:bg-white sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-sun-deep">Step {String(i + 1).padStart(2, "0")}</span>
                  <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink/70">{step.time}</span>
                </div>
                <h3 className="mt-2 font-display text-h3 font-bold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
