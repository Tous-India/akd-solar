import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading, Eyebrow } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { CtaBand } from "@/components/home/CtaBand";
import { certifications, services, stats, team, values, whyUs } from "@/lib/data";
import { locations, locationsByRegion } from "@/lib/locations";
import { BgFade } from "@/components/motion/BgFade";
import { pageMeta } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About Us — Our Story, Mission & Team",
  description: `AKD Solar is a rooftop solar company based in ${site.address.city}, Haryana, serving ${locations.length} cities across Haryana and Delhi NCR. Our story, values and team.`,
  path: "/about",
});

// TODO: PLACEHOLDER MILESTONES — replace with AKD Solar's real history.
const milestones = [
  { year: "2016", text: "Started in Sonipat with a team of four and a single pickup truck." },
  { year: "2019", text: "Crossed 500 rooftop installations and opened our C&I division." },
  { year: "2022", text: "Launched solar pumps for farmers under the PM-KUSUM scheme." },
  { year: "2024", text: "Registered vendor for PM Surya Ghar; 1,000 kW installed in a single year." },
];

const discomNames = Array.from(new Set(locations.map((l) => l.discom.short))).join(", ");

const facts = [
  { label: "Business name", value: `${site.name} — “${site.tagline}”` },
  { label: "What we do", value: "Design, installation and maintenance of rooftop solar, commercial plants and solar water pumps" },
  { label: "Office", value: fullAddress },
  { label: "Founded", value: String(site.foundedYear) },
  { label: "Service area", value: `${locations.length} cities across Haryana (${locationsByRegion("Haryana").length}) and Delhi NCR (${locationsByRegion("Delhi NCR").length})` },
  { label: "Services", value: services.map((s) => s.shortTitle).join(", ") },
  { label: "Subsidy support", value: "PM Surya Ghar Muft Bijli Yojana — up to ₹78,000 for homes" },
  { label: "Net-metering with", value: discomNames },
  { label: "Contact", value: `${site.phone} · ${site.email}` },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About AKD Solar"
        title={
          <>
            Clean power, installed with <span className="text-sun-deep">care</span> — since {site.foundedYear}.
          </>
        }
        subtitle="We started AKD Solar with one belief: going solar should feel as trustworthy as buying from a family business you've known for years. Nearly a decade later, that's still how we work."
      />

      {/* Story */}
      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="clip" className="relative min-h-[320px] overflow-hidden rounded-card bg-navy sm:min-h-[420px]">
            <StoryArt />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="Built on honest quotes and roofs left spotless."
            />
            <Reveal stagger={0.1} className="mt-6 space-y-5 text-lead text-muted">
              <p>
                Our founder spent fifteen years in power distribution watching families pay rising bills while their roofs sat empty under the
                Haryana sun. Most solar companies he met sold the biggest system they could — not the right one.
              </p>
              <p>
                AKD Solar was set up to do the opposite: size every system to the real bill, use only approved components, and stay reachable for the
                full 25-year life of the plant. The name stands for our founding families; the tagline, <em>Balancing The Nature</em>, is the promise.
              </p>
            </Reveal>
            <Reveal as="ol" stagger={0.08} className="mt-10 grid gap-4 sm:grid-cols-2">
              {milestones.map((m) => (
                <li key={m.year} className="rounded-card border border-line bg-white/75 p-5">
                  <span className="font-display text-2xl font-extrabold tracking-tight text-sun-deep">{m.year}</span>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{m.text}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Fact block — citable, consistent facts drawn from site.ts / locations.ts */}
      <section aria-labelledby="facts-title" className="pb-20 sm:pb-28">
        <Container>
          <Reveal className="rounded-card border border-line bg-white p-6 sm:p-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="facts-title" className="font-display text-h3 font-bold">
                AKD Solar at a glance
              </h2>
              <p className="text-sm text-muted">Facts as of {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
            </div>
            <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="border-t border-line pt-4">
                  <dt className="text-sm font-semibold tracking-wide text-muted uppercase">{f.label}</dt>
                  <dd className="mt-1.5 text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* Numbers */}
      <section aria-label="Company in numbers" className="pb-20 sm:pb-28">
        <Container>
          <Reveal as="dl" stagger={0.08} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col rounded-card border border-line bg-white/75 p-6">
                <dt className="order-2 mt-2 text-muted">{s.label}</dt>
                <dd className="order-1 font-display text-[clamp(1.875rem,1.4rem+2vw,3rem)] leading-none font-extrabold tracking-[-0.04em] text-solar-deep">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Mission & vision */}
      <section className="on-dark relative overflow-hidden bg-navy py-20 text-cream sm:py-28 desk:bg-cream">
        <BgFade />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="panel-grid-dark absolute inset-0" />
          <div className="sun-glow absolute -top-1/2 -right-1/4 size-[900px] rounded-full opacity-50" />
        </div>
        <Container className="relative">
          <Reveal as="div" stagger={0.12} className="grid gap-5 md:grid-cols-2">
            <Card tone="dark" className="lg:p-12">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-gold text-ink">
                <Icon name="target" className="size-7" />
              </span>
              <h2 className="mt-8 font-display text-h3 font-bold">Our mission</h2>
              <p className="mt-3 text-lead text-cream/75">
                To make every rooftop in India a source of clean, affordable power — with advice people can trust and service that lasts as long
                as the panels do.
              </p>
            </Card>
            <Card tone="dark" className="lg:p-12">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-leaf text-ink">
                <Icon name="eye" className="size-7" />
              </span>
              <h2 className="mt-8 font-display text-h3 font-bold">Our vision</h2>
              <p className="mt-3 text-lead text-cream/75">
                A country where clean energy is the obvious, everyday choice — and where every installation leaves nature a little more in balance
                than we found it.
              </p>
            </Card>
          </Reveal>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="What we stand for" title="Four values on every job card." align="center" />
          <Reveal as="ul" stagger={0.08} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <li key={v.title} data-tilt className="rounded-card border border-line bg-white/75 p-6 sm:p-7">
                <span className="flex size-12 items-center justify-center rounded-xl bg-sand text-sun-deep">
                  <Icon name={v.icon} className="size-6" />
                </span>
                <h3 className="mt-6 font-display text-lg font-bold tracking-tight">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-sand py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="The team"
            title="The people who'll pick up your call."
            subtitle="Engineers, project managers and technicians — all on our own payroll, all trained in-house."
          />
          <Reveal as="ul" stagger={0.08} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <li key={m.name} className="overflow-hidden rounded-card border border-line bg-white">
                <div className="relative flex aspect-[4/3] items-end justify-center overflow-hidden bg-gradient-to-b from-[#FFE7B8] to-cream">
                  <div aria-hidden className="sun-glow absolute -top-1/3 left-1/2 size-[140%] -translate-x-1/2 rounded-full" />
                  <span
                    className={`relative mb-[-12%] flex aspect-square w-1/2 items-center justify-center rounded-full font-display text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] font-bold ${
                      ["bg-navy text-gold", "bg-panel text-white", "bg-solar-deep text-white", "bg-sun text-ink"][i % 4]
                    }`}
                    aria-hidden
                  >
                    {m.initials}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold tracking-tight">{m.name}</h3>
                  <p className="text-sm font-semibold text-sun-deep">{m.role}</p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{m.bio}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Certifications */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading
            eyebrow="Certifications"
            title="Approved, registered and accountable."
            subtitle="The paperwork that protects you — and makes you eligible for every subsidy available."
          />
          <Reveal as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-2">
            {certifications.map((c) => (
              <li key={c.title} className="flex gap-4 rounded-card border border-line bg-white/75 p-5 sm:p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                  <Icon name={c.icon} className="size-6" />
                </span>
                <div>
                  <h3 className="font-display font-bold tracking-tight">{c.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{c.text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="bg-sand py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Why choose us" title="What makes AKD different." />
            <Reveal>
              <Button href="/projects" variant="secondary">
                See our work
              </Button>
            </Reveal>
          </div>
          <Reveal as="ul" stagger={0.07} className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((w) => (
              <li key={w.title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-solar-deep ring-1 ring-line">
                  <Icon name={w.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight">{w.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">{w.text}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}

function StoryArt() {
  return (
    <div className="absolute inset-0 flex flex-col gap-5 p-8 text-cream sm:p-10">
      <div aria-hidden className="absolute inset-0">
        <div className="panel-grid-dark absolute inset-0" />
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[62%] w-full">
          <defs>
            <radialGradient id="story-sun" cx="50%" cy="100%" r="60%">
              <stop offset="0" stopColor="#FFC93C" />
              <stop offset="0.5" stopColor="#F7931E" stopOpacity="0.6" />
              <stop offset="1" stopColor="#F7931E" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="80" width="400" height="220" fill="url(#story-sun)" />
          <circle cx="200" cy="300" r="90" fill="#FFC93C" />
          {Array.from({ length: 11 }, (_, i) => {
            const a = Math.PI + (i / 10) * Math.PI;
            return (
              <line
                key={i}
                x1={200 + Math.cos(a) * 110}
                y1={300 + Math.sin(a) * 110}
                x2={200 + Math.cos(a) * 150}
                y2={300 + Math.sin(a) * 150}
                stroke="#FFC93C"
                strokeWidth="7"
                strokeLinecap="round"
              />
            );
          })}
          <path d="M0 300V270c60-14 120-16 200-6s140 8 200-4v40z" fill="#2E8B1E" />
        </svg>
      </div>
      <div className="relative">
        <Eyebrow tone="dark">Since {site.foundedYear}</Eyebrow>
      </div>
      <p className="relative max-w-sm font-display text-2xl leading-snug font-bold sm:text-3xl">
        “Size it for the bill, not for the bill-board.”
      </p>
    </div>
  );
}
