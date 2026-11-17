"use client";

import { useRef } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { gsap, MQ, ScrollTrigger, useGSAP, whenIdle } from "@/lib/gsap";
import { site } from "@/lib/site";

const ITEMS: { icon: IconName; text: string }[] = [
  { icon: "badge", text: `Havells authorised dealer since ${site.havellsDealerSince}` },
  { icon: "rupee", text: "207 customers got PM Surya Ghar subsidy" },
  { icon: "shield", text: "25-year panel performance warranty" },
  { icon: "eye", text: "Free app monitoring for 25 years" },
  { icon: "clock", text: `Installed in as little as ${site.numbers.installDays} days` },
];

/** Infinite marquee that speeds up briefly with scroll velocity. Static for reduced motion. */
export function TrustMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, (self) => {
        const loop = gsap.to(trackRef.current, { xPercent: -50, ease: "none", duration: 45, repeat: -1, paused: true });
        let settle: gsap.core.Tween | null = null;
        // Start after load/idle so the loop never competes with hydration
        return whenIdle(() =>
          self.add(() => {
            const st = ScrollTrigger.create({
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              onToggle: (t) => (t.isActive ? loop.play() : loop.pause()),
              onUpdate: (t) => {
                const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(t.getVelocity()) / 600);
                loop.timeScale(boost);
                settle?.kill();
                settle = gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out", delay: 0.1 });
              },
            });
            if (st.isActive) loop.play();
          }),
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item.text} className="flex shrink-0 items-center gap-3 px-6 text-[0.95rem] font-semibold whitespace-nowrap text-ink/80 sm:px-8">
          <Icon name={item.icon} className="size-5 shrink-0 text-sun-deep" />
          {item.text}
          <span aria-hidden className="ml-6 size-1.5 rounded-full bg-sun sm:ml-8" />
        </li>
      ))}
    </ul>
  );

  return (
    <section ref={ref} aria-label="Why customers choose AKD Solar" className="overflow-hidden border-y border-line bg-sand/60 py-5">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
