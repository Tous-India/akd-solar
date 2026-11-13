import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { InlineCta } from "@/components/solutions/Blocks";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Our Projects — Solar Installations",
  description: "Photos of AKD Solar rooftop installations for homes and businesses in Sonipat, Rohtak, Jhajjar and nearby.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHeader breadcrumb={[{ name: "Projects", path: "/projects" }]} eyebrow="Our work" title="Our Projects" intro="Rooftop systems we have installed across Sonipat, Rohtak and nearby." />

      <Container>
        <ProjectsGallery />

        <InlineCta title="Want your roof here next?" />
      </Container>
    </>
  );
}
