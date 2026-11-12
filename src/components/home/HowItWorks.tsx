"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, MQ, onceInView, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/lib/data";

/** "How We Work": 4 numbered steps on a connecting line (vertical on phones). */
export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const list = ref.current?.querySelector("[data-steps]");
        if (!list) return;
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", list);
        gsap.set("[data-line-fill]", { scaleX: 0, scaleY: 0 });
        gsap.set(steps, { autoAlpha: 0, y: 16 });
        return onceInView(list, () => {
          gsap.to("[data-line-fill]", { scaleX: 1, scaleY: 1, duration: 1.2, ease: "power2.inOut" });
          gsap.to(steps, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.18, ease: "power3.out" });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="how-title" className="bg-sand py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title={<span id="how-title">How it works</span>}
          subtitle="From the first conversation to the final connection."
          align="center"
        />
        <ol data-steps className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          {/* connecting line: vertical on phones, horizontal from md */}
          <span aria-hidden className="absolute top-7 bottom-7 left-7 w-0.5 bg-ink/10 md:top-7 md:right-[12.5%] md:bottom-auto md:left-[12.5%] md:h-0.5 md:w-auto">
            <span data-line-fill className="block size-full origin-top bg-gradient-to-b from-sun via-gold to-[#2E8B1E] md:origin-left md:bg-gradient-to-r" />
          </span>
          {processSteps.map((step, i) => (
            <li key={step.title} data-step className="relative flex gap-5 md:flex-col md:items-center md:gap-4 md:text-center">
              <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-sun bg-white text-sun-deep shadow-[0_0_0_6px_var(--color-sand)]">
                <Icon name={step.icon} className="size-6" />
                <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-navy font-display text-xs font-bold text-gold">
                  {i + 1}
                </span>
              </span>
              <div className="pt-1 md:pt-0">
                <h3 className="font-display text-h3 font-bold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted md:mx-auto md:max-w-[15rem]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
