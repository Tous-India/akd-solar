import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data";

export function ServicesPreview() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title="One partner for every kind of solar."
            subtitle="From a 2 kW family rooftop to a 500 kW factory plant and the borewell on your farm — designed by engineers, installed by our own crew."
          />
          <Reveal className="shrink-0">
            <Button href="/services" variant="secondary">
              Explore all services
            </Button>
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.08} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug} className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
              <Link
                href={`/services/${s.slug}`}
                data-tilt
                className={`group relative flex h-full flex-col overflow-hidden rounded-card border border-line p-6 transition-colors duration-300 hover:border-sun/60 sm:p-8 ${
                  i === 0 ? "bg-sand" : "bg-white/75"
                }`}
              >
                {i === 0 ? (
                  <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full sun-glow opacity-70" />
                ) : null}
                <div className="relative flex items-start justify-between gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-navy text-gold transition-colors duration-300 group-hover:bg-sun group-hover:text-ink">
                    <Icon name={s.icon} className="size-7" />
                  </span>
                  <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-solar-deep">{s.highlight}</span>
                </div>
                <h3 className={`relative mt-8 font-display font-bold tracking-tight text-ink ${i === 0 ? "text-[clamp(1.5rem,1.2rem+1vw,2rem)]" : "text-h3"}`}>
                  {s.title}
                </h3>
                <p className={`relative mt-3 leading-relaxed text-muted ${i === 0 ? "max-w-xl text-lead" : ""}`}>{s.short}</p>
                <span className="relative mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-panel">
                  Learn more
                  <Icon name="arrowRight" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
