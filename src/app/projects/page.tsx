import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { CtaBand } from "@/components/home/CtaBand";
import { projects } from "@/lib/data";
import { formatLakh, formatNumber } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Solar Projects in Haryana & Delhi NCR",
  description:
    "Solar installations for homes, factories, schools and farms across Haryana and Delhi NCR, with capacity and annual savings.",
  path: "/projects",
});

export default function ProjectsPage() {
  const totalKw = projects.reduce((s, p) => s + p.capacityKw, 0);
  const totalSavings = projects.reduce((s, p) => s + p.annualSavings, 0);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Projects", path: "/projects" }]}
        eyebrow="Our work"
        title={
          <>
            Real roofs. Real <span className="text-solar">savings</span>.
          </>
        }
        subtitle="A selection of recent installations. Every number below comes from the customer's own bills after one full year of generation."
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="text-sm text-muted">Capacity shown</dt>
            <dd className="font-display text-2xl font-bold tracking-tight">{formatNumber(totalKw, 1)} kW</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Combined yearly savings</dt>
            <dd className="font-display text-2xl font-bold tracking-tight text-solar-deep">{formatLakh(totalSavings)}</dd>
          </div>
        </dl>
      </PageHero>

      <section aria-label="Project gallery" className="pb-8">
        <Container>
          <ProjectsGallery />
        </Container>
      </section>

      <CtaBand title="Want your roof in this gallery next?" />
    </>
  );
}
