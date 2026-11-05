import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { QuickAnswer } from "@/components/ui/QuickAnswer";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/home/CtaBand";
import { ServiceArt } from "@/components/services/ServiceArt";
import { ComparisonTable } from "@/components/services/ComparisonTable";
import { services } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Solar Services for Homes, Business & Farms",
  description:
    "Rooftop solar for homes, commercial plants, hybrid systems, solar water pumps and AMC across Haryana & Delhi NCR — installed by AKD Solar's own crew.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Our services"
        title={
          <>
            Solar that fits your roof, your bill and your <span className="text-solar">life</span>.
          </>
        }
        subtitle="Five services, one standard: engineered properly, installed by our own crew and supported for the full life of your system."
      >
        <ul className="flex flex-wrap gap-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-semibold text-ink transition-colors hover:border-sun"
              >
                <Icon name={s.icon} className="size-4 text-sun-deep" />
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      <section aria-label="Quick answer" className="pb-4">
        <Container>
          <QuickAnswer
            className="max-w-3xl"
            q="Which solar service do I need?"
            a="Most homes need an on-grid rooftop system with PM Surya Ghar subsidy. Businesses with daytime loads suit a commercial plant, farms suit solar pumps, and homes with frequent power cuts should choose hybrid."
          />
        </Container>
      </section>

      <div className="pb-8">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`} className="scroll-mt-24 py-12 sm:py-16">
            <Container>
              <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <Reveal variant="clip" className="relative aspect-[4/3] overflow-hidden rounded-card sm:aspect-[16/11]">
                  <ServiceArt slug={s.slug} />
                </Reveal>

                <div>
                  <Reveal stagger={0.08}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-sm font-semibold text-sun-deep">
                      <Icon name={s.icon} className="size-4" /> {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                    </span>
                    <h2 id={`${s.slug}-title`} className="mt-5 text-h2 font-bold">
                      <Link href={`/services/${s.slug}`} className="hover:text-sun-deep">
                        {s.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-lead text-muted">{s.description}</p>
                  </Reveal>

                  <Reveal as="ul" stagger={0.05} className="mt-8 grid gap-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-solar/15 text-solar-deep">
                          <Icon name="check" className="size-4" />
                        </span>
                        <span className="text-ink/85">{f}</span>
                      </li>
                    ))}
                  </Reveal>

                  <Reveal className="mt-8 rounded-card border border-line bg-white/75 p-5 sm:p-6">
                    <h3 className="text-sm font-bold tracking-[0.14em] text-muted uppercase">Ideal for</h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {s.idealFor.map((x) => (
                        <li key={x} className="rounded-full bg-sand px-3 py-1.5 text-sm font-medium text-ink">
                          {x}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button href={`/services/${s.slug}`} magnetic>
                      Full details
                    </Button>
                    <Button href={`/contact?service=${s.slug}`} variant="secondary" icon={null}>
                      Get a quote
                    </Button>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-solar-deep">
                      <Icon name="sparkle" className="size-4" /> {s.highlight}
                    </span>
                  </Reveal>
                </div>
              </div>
            </Container>
          </section>
        ))}
      </div>

      <section aria-labelledby="compare-title" className="bg-sand py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Compare systems"
            title={<span id="compare-title">On-grid, off-grid or hybrid?</span>}
            subtitle="A quick, honest comparison. During your free survey we'll recommend the right one for your location and budget."
          />
          <ComparisonTable />
        </Container>
      </section>

      <CtaBand title="Not sure which system you need?" text="Tell us your bill and location. We'll recommend the right system and show you the numbers — no jargon, no pressure." />
    </>
  );
}
