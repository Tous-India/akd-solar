import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Countdown } from "@/components/subsidy/Countdown";
import { PmHeroVisual } from "@/components/subsidy/PmHeroVisual";
import { FaqList } from "@/components/home/Faq";
import { InlineCta } from "@/components/solutions/Blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { BarChart, Donut, StackedBars } from "@/components/charts/Charts";
import {
  akdSubsidyResults,
  applySteps,
  haryanaTariff,
  haryanaTopUp,
  installsByYear,
  pmDocuments,
  pmEligibility,
  pmFaqs,
  pmStatCards,
  pmStats,
  pmStatsAsOn,
  subsidyBreakdown,
  subsidyTable,
} from "@/lib/data";
import { formatINR } from "@/lib/format";
import { faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "PM Surya Ghar Yojana — Subsidy up to ₹78,000",
  description: "PM Surya Ghar Muft Bijli Yojana: up to ₹78,000 central subsidy, Haryana top-up, scheme progress, tariffs, eligibility, documents and the 31 March 2027 deadline.",
  path: "/pm-surya-ghar-yojana",
});

const portalSource = (
  <>
    Source:{" "}
    <a href={site.pmSuryaGharPortal} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
      pmsuryaghar.gov.in
    </a>
    , as on {pmStatsAsOn}.
  </>
);

const [topUpLow, topUpMid] = haryanaTopUp;
const breakdownRows = subsidyBreakdown.flatMap((s) => [
  { group: s.size, label: "Income up to ₹1.8 lakh", a: s.central, b: topUpLow.amount },
  { group: s.size, label: "Income ₹1.8–3 lakh", a: s.central, b: topUpMid.amount },
]);

function SectionTitle({ id, children, sub }: { id: string; children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div>
      <h2 id={id} className="text-h2 font-bold text-ink">
        {children}
      </h2>
      {sub ? <p className="mt-2 max-w-3xl text-muted">{sub}</p> : null}
    </div>
  );
}

export default function PmSuryaGharPage() {
  return (
    <>
      <JsonLd data={faqSchema(pmFaqs)} />
      <PageHeader
        breadcrumb={[{ name: "PM Surya Ghar Yojana", path: "/pm-surya-ghar-yojana" }]}
        eyebrow="Government subsidy"
        title="PM Surya Ghar Yojana"
        intro="Up to ₹78,000 subsidy for home rooftop solar. Apply by 31 March 2027."
        visual={<PmHeroVisual />}
      />

      <Container>
        <Reveal as="section" aria-labelledby="countdown-title" className="on-dark rounded-card bg-navy p-5 text-cream sm:p-8">
          <h2 id="countdown-title" className="text-center font-display text-sm font-bold tracking-[0.16em] text-gold uppercase">
            Time left to apply
          </h2>
          <Countdown variant="big" tone="dark" className="mx-auto mt-5 max-w-2xl" />
        </Reveal>

        {/* Central subsidy cards */}
        <section aria-labelledby="subsidy-title" className="mt-14">
          <SectionTitle id="subsidy-title">Central subsidy</SectionTitle>
          <Reveal as="ul" stagger={0.06} className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {subsidyTable.map((t) => (
              <li key={t.kw} className="rounded-card border border-line bg-white p-5">
                <p className="text-sm font-semibold text-muted">{t.kw} system</p>
                <p className="mt-1 font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold tracking-tight text-ink">{formatINR(t.amount)}</p>
              </li>
            ))}
          </Reveal>
          <p className="mt-3 text-sm text-muted">Central subsidy is capped at ₹78,000 for 3 kW and above.</p>
        </section>

        {/* e) Subsidy breakdown */}
        <section aria-labelledby="breakdown-title" className="mt-14">
          <SectionTitle id="breakdown-title" sub="In Haryana, eligible families can add a state top-up to the central subsidy.">
            Central + Haryana subsidy
          </SectionTitle>
          <div className="mt-6">
            <StackedBars
              title="Total subsidy by system size and family income"
              rows={breakdownRows}
              aName="Central subsidy"
              bName="Haryana top-up"
              source="Central subsidy: pmsuryaghar.gov.in. Haryana top-up as announced June 2024 — confirm with DHBVN/UHBVN."
            />
          </div>
        </section>

        {/* d) Our results */}
        <Reveal as="section" aria-labelledby="results-title" className="on-dark mt-14 overflow-hidden rounded-card bg-navy text-cream">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.16em] text-gold uppercase">Our results</p>
              <h2 id="results-title" className="mt-2 font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] leading-tight font-extrabold">
                We helped <span className="text-gold">{akdSubsidyResults.customers} customers</span> receive{" "}
                <span className="text-gold">{formatINR(akdSubsidyResults.amount)}</span> in subsidy
              </h2>
              <p className="mt-3 text-cream/75">As on {akdSubsidyResults.asOn}. AKD Solar records.</p>
            </div>
            <figure>
              <div className="overflow-hidden rounded-card border border-white/15">
                <Image
                  src="/images/pm/subsidy-cheques-sep-2024.jpg"
                  alt="AKD Solar customers holding their subsidy cheque folders at the handover, September 2024"
                  width={1400}
                  height={210}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-2 text-sm text-cream/70">Subsidy cheque handover to our customers, September 2024.</figcaption>
            </figure>
          </div>
        </Reveal>

        {/* a) Scheme at a glance */}
        <section aria-labelledby="glance-title" className="mt-14">
          <SectionTitle id="glance-title">Scheme at a glance — as on {pmStatsAsOn}</SectionTitle>
          <Reveal as="ul" stagger={0.05} className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {pmStatCards.map((s) => (
              <li key={s.label} className="rounded-card border border-line bg-white p-4 sm:p-5">
                <p className="font-display text-[clamp(1.35rem,1.05rem+1.2vw,2rem)] leading-tight font-extrabold tracking-tight text-ink tabular-nums">{s.value}</p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </li>
            ))}
          </Reveal>
          <p className="mt-3 text-xs text-muted">{portalSource}</p>

          {/* b) Donuts */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Donut
              title="Progress towards 1 crore homes"
              value={pmStats.installations}
              total={pmStats.target}
              valueLabel="Homes with rooftop solar installed"
              restLabel="Homes still to go"
              source={portalSource}
            />
            <Donut
              title="Applications converted to installations"
              value={pmStats.installations}
              total={pmStats.applications}
              valueLabel="Installations"
              restLabel="Applications not yet installed"
              source={portalSource}
            />
          </div>

          {/* c) Installs by year */}
          <div className="mt-4">
            <BarChart
              title="Rooftop solar installations in India by year"
              unit="installations"
              data={installsByYear.map((d) => ({ label: d.year, value: d.value, note: d.year === "2024" ? "as on 24 Dec 2024" : undefined }))}
              source="Source: MNRE. * 2024 figure as on 24 Dec 2024."
            />
          </div>
        </section>

        {/* f) Why solar pays */}
        <section aria-labelledby="tariff-title" className="mt-14">
          <SectionTitle id="tariff-title" sub="Haryana domestic tariff 2026-27 (w.e.f. 01.04.2026), simplified. Energy charges per unit (kWh).">
            Why solar pays in Haryana
          </SectionTitle>
          <Reveal className="mt-6 overflow-x-auto rounded-card border border-line bg-white">
            <table className="w-full text-left text-[0.95rem] sm:min-w-[560px]">
              <thead>
                <tr className="border-b border-line bg-sand/60">
                  <th scope="col" className="px-3 py-3 font-display font-semibold text-ink sm:px-4">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 font-display font-semibold text-ink">
                    Monthly units
                  </th>
                  <th scope="col" className="px-4 py-3 font-display font-semibold text-ink">
                    Rate per unit
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-display font-semibold text-ink sm:table-cell">
                    Fixed charge
                  </th>
                </tr>
              </thead>
              {haryanaTariff.map((c) => (
                <tbody key={c.category} className="border-b border-line last:border-0">
                  {c.slabs.map((sl, i) => (
                    <tr key={sl.units} className={i < c.slabs.length - 1 ? "border-b border-line/60" : ""}>
                      {i === 0 ? (
                        <th scope="rowgroup" rowSpan={c.slabs.length} className="px-3 py-2.5 align-top font-semibold text-ink sm:px-4">
                          {c.category}
                          <span className="block text-sm font-normal text-muted">{c.load}</span>
                          {c.fixed !== "—" ? <span className="mt-1 block text-xs font-normal text-muted sm:hidden">Fixed: {c.fixed}</span> : null}
                        </th>
                      ) : null}
                      <td className="px-4 py-2.5 text-ink/85 tabular-nums">{sl.units}</td>
                      <td className="px-4 py-2.5 font-semibold text-ink tabular-nums">{sl.rate}</td>
                      {i === 0 ? (
                        <td rowSpan={c.slabs.length} className="hidden px-4 py-2.5 align-top text-ink/85 sm:table-cell">
                          {c.fixed}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </Reveal>
          <p className="mt-4 flex items-start gap-2 font-semibold text-ink">
            <Icon name="sun" className="mt-0.5 size-5 shrink-0 text-sun-deep" />
            Every unit your panels make is a unit you don&apos;t buy at these rates.
          </p>
          <p className="mt-1 text-xs text-muted">Source: Haryana domestic tariff schedule 2026-27 (DHBVN/UHBVN), simplified.</p>
        </section>

        {/* g) Eligibility + documents */}
        <section aria-label="Eligibility and documents" className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal as="div" className="rounded-card border border-line bg-white p-5 sm:p-6">
            <h2 className="font-display text-h3 font-bold text-ink">Who is eligible</h2>
            <ul className="mt-4 space-y-2.5">
              {pmEligibility.map((e) => (
                <li key={e} className="flex gap-2.5 text-ink/85">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-solar/15 text-solar-deep">
                    <Icon name="check" className="size-3.5" />
                  </span>
                  {e}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal as="div" className="rounded-card border border-line bg-white p-5 sm:p-6">
            <h2 className="font-display text-h3 font-bold text-ink">Documents needed</h2>
            <ul className="mt-4 space-y-2.5">
              {pmDocuments.map((d) => (
                <li key={d} className="flex gap-2.5 text-ink/85">
                  <Icon name="document" className="mt-0.5 size-5 shrink-0 text-sun-deep" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section aria-labelledby="apply-title" className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle id="apply-title">How to apply</SectionTitle>
            <Button href={site.pmSuryaGharPortal} variant="secondary" icon="arrowUpRight" className="self-start sm:self-auto">
              pmsuryaghar.gov.in
            </Button>
          </div>
          <Reveal as="ol" stagger={0.06} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {applySteps.map((s, i) => (
              <li key={s.title} className="rounded-card border border-line bg-white p-5">
                <span className="flex size-8 items-center justify-center rounded-full bg-sun font-display text-sm font-bold text-ink">{i + 1}</span>
                <p className="mt-3 font-display font-bold text-ink">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </Reveal>
        </section>

        <section aria-labelledby="pm-faq" className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <h2 id="pm-faq" className="text-h2 font-bold text-ink">
            Questions
          </h2>
          <FaqList items={pmFaqs} />
        </section>

        <InlineCta title="Apply with AKD Solar" text="We register you, install the system and follow up until the subsidy reaches your bank." />
      </Container>
    </>
  );
}
