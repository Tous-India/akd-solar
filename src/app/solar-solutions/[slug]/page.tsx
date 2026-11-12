import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { FaqList } from "@/components/home/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { AmcBlock, InlineCta, LoanInfo, MsmeBlock, PumpsBlock, SocietySubsidy, SystemTypes } from "@/components/solutions/Blocks";
import { getSolution, projects, solutions } from "@/lib/data";
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
  const img = projects.flatMap((p) => p.images).find((i) => i.src === s.image) ?? { src: s.image, width: 1280, height: 960 };

  return (
    <>
      <JsonLd data={[solutionSchema(s), faqSchema(s.faqs)]} />
      <PageHero
        crumbs={[
          { name: "Solar Solutions", path: "/solar-solutions" },
          { name: s.title, path: `/solar-solutions/${s.slug}` },
        ]}
        title={s.heading}
        subtitle={s.intro}
      />

      <Container className="pb-4">
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <Reveal variant="clip" className="relative aspect-[4/3] overflow-hidden rounded-card">
            <Image src={img.src} alt={`${s.title} solar installation by AKD Solar`} width={img.width} height={img.height} sizes="(min-width: 1024px) 55vw, 100vw" priority className="h-full w-full object-cover" />
          </Reveal>
          <Reveal as="section" aria-labelledby="what-you-get">
            <h2 id="what-you-get" className="text-h2 font-bold text-ink">
              What you get
            </h2>
            <ul className="mt-5 space-y-3">
              {s.whatYouGet.map((w) => (
                <li key={w} className="flex gap-3 text-ink/85">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-solar/15 text-solar-deep">
                    <Icon name="check" className="size-4" />
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
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
