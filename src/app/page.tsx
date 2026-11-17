import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BannerSlider } from "@/components/home/BannerSlider";
import { Taglines } from "@/components/home/Taglines";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { AboutIntro } from "@/components/home/AboutIntro";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RecentProjects } from "@/components/home/RecentProjects";
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
      <h1 className="sr-only">AKD Solar — rooftop solar in Sonipat &amp; Delhi NCR</h1>
      <div className="pt-[68px] xl:pt-[76px]">
        <BannerSlider />
      </div>
      <TrustMarquee />
      <Taglines />
      <AboutIntro />

      <section aria-labelledby="solutions-title" className="pb-4">
        <Container>
          <SectionHeading title={<span id="solutions-title">Where can we install solar?</span>} />
          <div className="mt-8">
            <SolutionCards />
          </div>
        </Container>
      </section>

      <HowItWorks />
      <RecentProjects />
      <CtaBand />
    </>
  );
}
