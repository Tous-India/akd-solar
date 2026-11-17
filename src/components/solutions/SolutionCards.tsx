import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { projects, solutions } from "@/lib/data";

const dims = (src: string) => projects.flatMap((p) => p.images).find((i) => i.src === src) ?? { width: 1280, height: 960 };

/** The four solar solutions as photo cards (home + /solar-solutions) */
export function SolutionCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <Reveal as="ul" stagger={0.08} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {solutions.map((s) => {
        const d = s.imageSize ?? dims(s.image);
        return (
          <li key={s.slug}>
            <Link
              href={`/solar-solutions/${s.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-sun"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.imageAlt ?? `${s.title} solar installation by AKD Solar`}
                  width={d.width}
                  height={d.height}
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <Heading className="font-display text-h3 font-bold tracking-tight text-ink">{s.title}</Heading>
                <p className="mt-1.5 text-[0.95rem] text-muted">{s.short}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-panel">
                  Learn more <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </Reveal>
  );
}
