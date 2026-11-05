import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/lib/data";
import { formatLakh, formatNumber } from "@/lib/format";
import { ProjectArt } from "./ProjectArt";

const labels = { residential: "Residential", commercial: "Commercial", agricultural: "Agricultural" } as const;
const badgeTone = {
  residential: "bg-panel text-white",
  commercial: "bg-navy text-gold",
  agricultural: "bg-solar-deep text-white",
} as const;

type Props = { project: Project; index: number; tone?: "light" | "dark"; headingLevel?: "h3" | "h2" };

export function ProjectCard({ project, index, tone = "light", headingLevel = "h3" }: Props) {
  const Heading = headingLevel;
  const dark = tone === "dark";
  return (
    <article
      data-tilt
      className={`group flex h-full flex-col overflow-hidden rounded-card border ${dark ? "border-white/10 bg-navy-2" : "border-line bg-white"}`}
    >
      <div data-clip className="relative aspect-[4/3] overflow-hidden">
        <ProjectArt category={project.category} seed={index} id={`art-${project.id}`} className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]" />
        <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${badgeTone[project.category]}`}>
          {labels[project.category]}
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">{project.year}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Heading className={`font-display text-xl font-bold tracking-tight ${dark ? "text-cream" : "text-ink"}`}>{project.title}</Heading>
        <p className={`mt-1.5 flex items-center gap-1.5 text-sm ${dark ? "text-cream/65" : "text-muted"}`}>
          <Icon name="mapPin" className="size-4 shrink-0" /> {project.location}
        </p>
        <p className={`mt-3 mb-5 text-[0.95rem] leading-relaxed ${dark ? "text-cream/75" : "text-muted"}`}>{project.summary}</p>
        <dl className={`mt-auto grid grid-cols-2 gap-3 border-t pt-5 ${dark ? "border-white/10" : "border-line"}`}>
          <div>
            <dt className={`text-xs font-medium tracking-wide uppercase ${dark ? "text-cream/55" : "text-muted"}`}>Capacity</dt>
            <dd className={`mt-1 font-display text-lg font-bold ${dark ? "text-gold" : "text-ink"}`}>{formatNumber(project.capacityKw, project.capacityKw % 1 ? 1 : 0)} kW</dd>
          </div>
          <div>
            <dt className={`text-xs font-medium tracking-wide uppercase ${dark ? "text-cream/55" : "text-muted"}`}>Saves / year</dt>
            <dd className={`mt-1 font-display text-lg font-bold ${dark ? "text-leaf" : "text-solar-deep"}`}>{formatLakh(project.annualSavings)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
