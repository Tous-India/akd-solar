import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Calculator } from "@/components/calculator/Calculator";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Solar Calculator — Size & Subsidy",
  description: "Enter your monthly units to see the right solar system size, roof area, cost, PM Surya Ghar subsidy, savings and payback. Based on the DHBVN/UHBVN guide.",
  path: "/calculator",
});

export default function CalculatorPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Solar Calculator", path: "/calculator" }]} title="Solar calculator" subtitle="Enter your monthly units. 1 kW of solar covers about 120 units a month." />
      <section aria-label="Calculator" className="pb-16 sm:pb-20">
        <Container>
          <Calculator />
        </Container>
      </section>
    </>
  );
}
