import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Countdown } from "@/components/subsidy/Countdown";
import { FaqList } from "@/components/home/Faq";
import { InlineCta } from "@/components/solutions/Blocks";
import { JsonLd } from "@/components/seo/JsonLd";
import { applySteps, haryanaTopUp, pmFaqs, subsidyTable } from "@/lib/data";
import { formatINR } from "@/lib/format";
import { faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "PM Surya Ghar Yojana — Subsidy up to ₹78,000",
  description: "PM Surya Ghar Muft Bijli Yojana: up to ₹78,000 central subsidy for home rooftop solar, Haryana top-up, how to apply and the 31 March 2027 deadline.",
  path: "/pm-surya-ghar-yojana",
});

export default function PmSuryaGharPage() {
  return (
    <>
      <JsonLd data={faqSchema(pmFaqs)} />
      <PageHero
        crumbs={[{ name: "PM Surya Ghar Yojana", path: "/pm-surya-ghar-yojana" }]}
        title="PM Surya Ghar Yojana"
        subtitle="Up to ₹78,000 central subsidy for home rooftop solar. Applications close 31 March 2027."
      />

      <Container>
        <Reveal as="section" aria-labelledby="countdown-title" className="on-dark rounded-card bg-navy p-5 text-cream sm:p-8">
          <h2 id="countdown-title" className="text-center font-display text-sm font-bold tracking-[0.16em] text-gold uppercase">
            Time left to apply
          </h2>
          <Countdown variant="big" tone="dark" className="mx-auto mt-5 max-w-2xl" />
        </Reveal>

        <section aria-labelledby="subsidy-title" className="mt-14">
          <h2 id="subsidy-title" className="text-h2 font-bold text-ink">
            Central subsidy
          </h2>
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

        <Reveal as="section" aria-labelledby="haryana-title" className="mt-10 rounded-card border border-sun/50 bg-gold/10 p-5 sm:p-6">
          <h2 id="haryana-title" className="font-display text-h3 font-bold text-ink">
            Haryana state top-up
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {haryanaTopUp.map((t) => (
              <li key={t.income} className="text-ink/85">
                <strong className="text-ink">Extra {formatINR(t.amount)}</strong> — {t.income.toLowerCase()}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">As announced by the Haryana Government in June 2024. Confirm current status with DHBVN/UHBVN.</p>
        </Reveal>

        <section aria-labelledby="apply-title" className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="apply-title" className="text-h2 font-bold text-ink">
              How to apply
            </h2>
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
          <p className="mt-5 flex items-start gap-2 text-ink/85">
            <Icon name="badge" className="mt-0.5 size-5 shrink-0 text-solar-deep" />
            In September 2024 we handed state subsidy cheques to our customers in Sonipat.
          </p>
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
