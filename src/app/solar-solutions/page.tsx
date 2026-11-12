import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SolutionCards } from "@/components/solutions/SolutionCards";
import { InlineCta } from "@/components/solutions/Blocks";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Solar Solutions for Homes, Business & RWAs",
  description: "Residential rooftop, commercial & individual, and housing society solar in Sonipat, Haryana and Delhi NCR — installed by AKD Solar's own crew.",
  path: "/solar-solutions",
});

export default function SolarSolutionsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Solar Solutions", path: "/solar-solutions" }]} title="Solar solutions" subtitle="Pick the setup that fits your roof and bill." />
      <section aria-label="Solutions" className="pb-4">
        <Container>
          <SolutionCards headingLevel="h2" />
          <InlineCta />
        </Container>
      </section>
    </>
  );
}
