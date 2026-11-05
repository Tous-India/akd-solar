"use client";

import Link from "next/link";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { gsap, MQ, onceInView, useGSAP } from "@/lib/gsap";
import { BgFade } from "@/components/motion/BgFade";
import { projects } from "@/lib/data";

const featured = ["sharma-residence", "mehta-textiles", "patel-farms", "green-valley", "sunrise-school"]
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is (typeof projects)[number] => Boolean(p));

export function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop with a fine pointer: pin the section and scroll the track horizontally
      mm.add(MQ.desktop, () => {
        const track = trackRef.current;
        if (!track) return;
        const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
        const scroller = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        // Each card's artwork wipes in as it slides into view inside the horizontal scroll
        gsap.utils.toArray<HTMLElement>("[data-feature-card] [data-clip]").forEach((clip) => {
          gsap.fromTo(
            clip,
            { clipPath: "inset(0% 0% 0% 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "power2.out",
              scrollTrigger: { trigger: clip, containerAnimation: scroller, start: "left 95%", end: "left 60%", scrub: true },
            },
          );
          gsap.fromTo(
            clip.firstElementChild,
            { scale: 1.1 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: clip, containerAnimation: scroller, start: "left 95%", end: "left 40%", scrub: true } },
          );
        });
      });
      // Everywhere else: simple staggered fade + wipe as cards scroll in
      mm.add(MQ.light, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-feature-card]");
        const track = trackRef.current;
        if (!track) return;
        gsap.set(cards, { autoAlpha: 0, y: 24 });
        return onceInView(track, () => gsap.to(cards, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7, overwrite: true }));
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} aria-labelledby="featured-title" className="on-dark relative overflow-hidden bg-navy text-cream desk:bg-cream">
      <BgFade />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="panel-grid-dark absolute inset-0" />
        <div className="sun-glow absolute -bottom-[60%] -left-[20%] size-[900px] rounded-full opacity-40" />
      </div>
      <div className="relative flex flex-col justify-center py-20 sm:py-28 desk:min-h-screen desk:py-16">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            tone="dark"
            eyebrow="Featured projects"
            title={<span id="featured-title">Roofs we&apos;ve turned into power plants.</span>}
            subtitle="Homes, factories, schools and farms across India — each one designed around real bills and real roofs."
          />
          <Link
            href="/projects"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 font-semibold text-gold transition-colors hover:text-white"
          >
            View all projects <Icon name="arrowRight" className="size-5" />
          </Link>
        </Container>

        <div
          ref={trackRef}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:mt-12 lg:px-8 desk:snap-none desk:overflow-visible desk:px-[max(2rem,calc((100vw-1360px)/2+2rem))]"
        >
          {featured.map((p, i) => (
            <div key={p.id} data-feature-card className="w-[84%] max-w-[420px] shrink-0 snap-start sm:w-[46%] lg:w-[31%] desk:w-[400px]">
              <ProjectCard project={p} index={i} tone="dark" />
            </div>
          ))}
          <div data-feature-card className="w-[84%] max-w-[420px] shrink-0 snap-start sm:w-[46%] lg:w-[31%] desk:w-[340px]">
            <Link
              href="/projects"
              className="group flex h-full min-h-[280px] flex-col justify-between rounded-card border border-dashed border-white/25 p-8 transition-colors hover:border-gold"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
                <Icon name="arrowRight" className="size-6" />
              </span>
              <span>
                <span className="block font-display text-2xl font-bold">See all 1,800+ installations</span>
                <span className="mt-2 block text-cream/70">Filter by home, business or farm.</span>
              </span>
            </Link>
          </div>
        </div>
        <p className="mt-4 px-4 text-sm text-cream/55 sm:px-6 desk:hidden" aria-hidden>
          Swipe to see more →
        </p>
      </div>
    </section>
  );
}
