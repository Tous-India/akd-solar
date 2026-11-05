import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/home/Hero";
import { StatsBand } from "@/components/home/StatsBand";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SubsidySection } from "@/components/home/SubsidySection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BillStory } from "@/components/home/BillStory";
import { MiniCalculator } from "@/components/home/MiniCalculator";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqList } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs } from "@/lib/data";
import { faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: `${site.name} — Rooftop Solar in Haryana & Delhi NCR`,
  absoluteTitle: true,
  description:
    "Rooftop solar in Haryana & Delhi NCR: up to ₹78,000 PM Surya Ghar subsidy, MNRE-approved panels, net-metering handled and installation in about 7 days.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* Organization / LocalBusiness / WebSite schema is site-wide (layout); FAQs are specific to this page */}
      <JsonLd data={faqSchema(faqs)} />
      <Hero />
      <StatsBand />
      <div className="mt-16 sm:mt-20">
        <TrustMarquee />
      </div>
      <TrustStrip />
      <SubsidySection />
      <ServicesPreview />
      <HowItWorks />
      <BillStory />
      <MiniCalculator />
      <FeaturedProjects />
      <Testimonials />

      <section className="bg-sand py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="FAQ"
              title="What do people ask before going solar?"
              subtitle="Still unsure? Our engineers are happy to explain anything — on call, on WhatsApp or on your roof."
            />
            <div className="mt-8">
              <Button href="/contact" variant="secondary">
                Ask us anything
              </Button>
            </div>
          </div>
          <FaqList items={faqs} />
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
