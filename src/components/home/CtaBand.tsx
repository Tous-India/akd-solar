import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { RisingSun } from "@/components/motion/RisingSun";
import { site, telHref } from "@/lib/site";

type Props = { title?: string; text?: string };

// Final (fully warmed) gradient stops — also the no-JS / reduced-motion look. RisingSun tweens these variables.
const warmStyle = {
  "--sun-a": "#FFC93C",
  "--sun-b": "#FFAA30",
  "--sun-c": "#F58A1F",
  backgroundImage: "linear-gradient(135deg, var(--sun-a) 0%, var(--sun-b) 55%, var(--sun-c) 100%)",
} as CSSProperties;

export function CtaBand({
  title = "Your roof could start paying you back next month.",
  text = "Book a free, no-obligation site survey. An AKD engineer will visit, check your roof and give you a written quote with subsidy and savings — within 48 hours.",
}: Props) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div
            data-sun-scene
            data-sun-warm
            style={warmStyle}
            className="relative overflow-hidden rounded-card px-6 pt-14 sm:px-12 sm:pt-16 md:pb-16 lg:px-16 lg:py-20"
          >
            {/* Faint panel grid (0.08 effective line opacity), brightened to 0.18 as the sun rises */}
            <div
              aria-hidden
              data-sun-grid
              className="pointer-events-none absolute inset-0 opacity-[0.36]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(10 23 48 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(10 23 48 / 0.5) 1px, transparent 1px)",
                backgroundSize: "64px 44px",
                maskImage: "linear-gradient(to left, #000, transparent 75%)",
              }}
            />

            <div className="relative max-w-2xl md:max-w-[56%] lg:max-w-[54%] xl:max-w-2xl">
              <div data-sun-parallax>
                <h2 className="text-h2 font-extrabold text-ink">{title}</h2>
                <p className="mt-5 text-lead text-ink/80">{text}</p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div data-sun-reveal className="flex flex-col">
                  <Button href="/contact" variant="dark" size="lg" magnetic>
                    Get Free Site Survey
                  </Button>
                </div>
                <div data-sun-reveal className="flex flex-col">
                  <Button href={telHref} variant="light" size="lg" icon={null} iconLeft="phone">
                    Call {site.phone}
                  </Button>
                </div>
              </div>
            </div>

            {/* The sun: below the copy on phones (~60% width), bottom-right behind the copy from tablets up */}
            <div className="pointer-events-none relative mx-auto mt-10 w-[60%] max-w-[300px] md:absolute md:right-0 md:bottom-0 md:mt-0 md:w-[46%] md:max-w-[600px] lg:w-[50%]">
              <RisingSun size="lg" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
