import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { InlineCta } from "@/components/solutions/Blocks";
import { offgridVillages } from "@/lib/data";
import { imageDims } from "@/lib/projects.generated";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Our Projects — Solar Installations",
  description: "Photos of AKD Solar rooftop installations for homes and businesses in Sonipat, Rohtak, Jhajjar and nearby, plus off-grid systems in 21 villages.",
  path: "/projects",
});

const COLLAGE = "/images/projects/offgrid-villages-collage.jpg";

export default function ProjectsPage() {
  const collage = imageDims[COLLAGE];
  return (
    <>
      <PageHeader breadcrumb={[{ name: "Projects", path: "/projects" }]} eyebrow="Our work" title="Our Projects" intro="Rooftop systems we have installed across Sonipat, Rohtak and nearby." />

      <Container>
        <ProjectsGallery />

        <section aria-labelledby="offgrid-title" className="mt-16 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <Reveal variant="clip" className="overflow-hidden rounded-card border border-line">
            <Image
              src={COLLAGE}
              alt="Off-grid solar installations in villages around Sonipat"
              width={collage.width}
              height={collage.height}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="h-auto w-full"
            />
          </Reveal>
          <Reveal>
            <h2 id="offgrid-title" className="text-h2 font-bold text-ink">
              Off-grid in villages
            </h2>
            <p className="mt-2 text-muted">Battery-backed systems where grid supply is unreliable.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {offgridVillages.map((v) => (
                <li key={v} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink">
                  {v}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <InlineCta title="Want your roof here next?" />
      </Container>
    </>
  );
}
