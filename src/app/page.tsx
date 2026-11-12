import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroSlider } from "@/components/home/HeroSlider";
import { NumbersStrip } from "@/components/home/NumbersStrip";
import { PmTeaser } from "@/components/home/PmTeaser";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RecentProjects } from "@/components/home/RecentProjects";
import { BrandsRow } from "@/components/home/BrandsRow";
import { CtaBand } from "@/components/home/CtaBand";
import { SolutionCards } from "@/components/solutions/SolutionCards";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `${site.name} — Rooftop Solar in Sonipat & Delhi NCR`,
  absoluteTitle: true,
  description: `Rooftop solar in Sonipat & Delhi NCR since ${site.foundedYear}: ${site.numbers.installations} installations, up to ₹78,000 PM Surya Ghar subsidy, Havells dealer since ${site.havellsDealerSince}.`,
  path: "/",
});

// Organization / LocalBusiness / WebSite schema is site-wide (layout.tsx)
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <NumbersStrip />

      <section aria-labelledby="solutions-title" className="pb-4">
        <Container>
          <SectionHeading eyebrow="Solar solutions" title={<span id="solutions-title">What we install</span>} />
          <div className="mt-8">
            <SolutionCards />
          </div>
        </Container>
      </section>

      <PmTeaser />
      <HowItWorks />
      <RecentProjects />
      <BrandsRow />
      <CtaBand />
    </>
  );
}
