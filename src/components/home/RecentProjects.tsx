import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectPhoto } from "@/components/projects/ProjectPhoto";
import { featuredProjectIds, projectCaption, projects } from "@/lib/data";

export function RecentProjects() {
  const featured = featuredProjectIds.map((id) => projects.find((p) => p.id === id)).filter((p): p is (typeof projects)[number] => Boolean(p));
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Projects" title="Recent installations" />
          <Button href="/projects" variant="secondary" className="self-start sm:self-auto">
            All projects
          </Button>
        </div>
        <Reveal as="ul" stagger={0.06} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <li key={p.id}>
              <ProjectPhoto image={p.images[0]} caption={projectCaption(p)} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
