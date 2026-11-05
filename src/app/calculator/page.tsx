import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuickAnswer } from "@/components/ui/QuickAnswer";
import { Calculator } from "@/components/calculator/Calculator";
import { FaqList } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/lib/data";
import { faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Solar Savings & Subsidy Calculator",
  description:
    "Work out the right solar system size, cost, PM Surya Ghar subsidy, yearly savings, payback and CO₂ offset for your home or business in Haryana & Delhi NCR.",
  path: "/calculator",
});

const quick = {
  q: "How much subsidy for a 3 kW solar system?",
  a: "₹78,000 under PM Surya Ghar: ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW. That is also the maximum for larger home systems.",
};

const calcFaqs = [quick, ...faqs.filter((_, i) => [0, 1, 4, 6].includes(i))];

export default function CalculatorPage() {
  return (
    <>
      <JsonLd data={faqSchema(calcFaqs)} />
      <PageHero
        crumbs={[{ name: "Solar Calculator", path: "/calculator" }]}
        eyebrow="Solar calculator"
        title={
          <>
            See your savings <span className="text-sun-deep">before</span> you spend a rupee.
          </>
        }
        subtitle="Move the sliders to match your bill and roof. We'll size your system and estimate cost, subsidy, savings and payback instantly."
      />

      <section aria-label="Quick answer" className="pb-10">
        <Container>
          <QuickAnswer className="max-w-3xl" q={quick.q} a={quick.a} />
        </Container>
      </section>

      <section aria-label="Calculator" className="pb-20 sm:pb-28">
        <Container>
          <Calculator />
        </Container>
      </section>

      <section className="bg-sand py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Good to know"
            title="How do we calculate your estimate?"
            subtitle="We use average state tariffs, typical solar yield for your region and current subsidy rules. Your survey refines every number."
          />
          <FaqList items={calcFaqs.slice(1)} />
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
