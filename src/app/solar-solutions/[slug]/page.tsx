import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { QuickEnquiry } from "@/components/contact/QuickEnquiry";
import { PageHeader } from "@/components/ui/PageHeader";
import { FeatureBlock } from "@/components/solutions/FeatureBlock";
import { FaqList } from "@/components/home/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { AmcBlock, InlineCta, LoanInfo, MsmeBlock, PumpsBlock, SocietySubsidy, SystemTypes } from "@/components/solutions/Blocks";
import { getSolution, solutions } from "@/lib/data";
import { faqSchema, solutionSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/solar-solutions/${s.slug}` });
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  return (
    <>
      <JsonLd data={[solutionSchema(s), faqSchema(s.faqs)]} />
      <PageHeader
        eyebrow="Solar solutions"
        breadcrumb={[
          { name: "Solar Solutions", path: "/solar-solutions" },
          { name: s.title, path: `/solar-solutions/${s.slug}` },
        ]}
        title={s.heading}
        intro={s.short}
        aside={<QuickEnquiry service={s.title} />}
      />

      <Container className="pb-4">
        <div className="grid gap-6">
          {s.blocks.map((block, i) => (
            <FeatureBlock key={block.title} id={`block-${i}`} block={block} bullets={i === 0 ? s.whatYouGet : block.bullets} flip={i % 2 === 1} priority={i === 0} />
          ))}
        </div>

        <div className="mt-10 grid gap-4">
          <SystemTypes />
          {s.msme ? <MsmeBlock /> : null}
          {s.societySubsidy ? <SocietySubsidy /> : null}
          <div className={`grid gap-4 ${s.pumps ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            <LoanInfo kinds={s.loans} />
            {s.pumps ? <PumpsBlock /> : null}
            <AmcBlock />
          </div>
        </div>

        <section aria-labelledby="faq-title" className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <h2 id="faq-title" className="text-h2 font-bold text-ink">
            Questions
          </h2>
          <FaqList items={s.faqs} />
        </section>

        <InlineCta />
      </Container>
    </>
  );
}
