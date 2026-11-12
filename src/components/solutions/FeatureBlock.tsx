import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import type { SolutionBlock } from "@/lib/data";

type Props = {
  block: SolutionBlock;
  /** Overrides block.bullets (used for "What you get") */
  bullets?: string[];
  /** Image on the right (desktop) */
  flip?: boolean;
  priority?: boolean;
  id: string;
};

/**
 * Image + text block. Desktop: 12-column grid, image 5/12 and text 7/12, equal height (stretch), text vertically
 * centred, image capped at 420px. Mobile: image on top at 16/10, then text.
 */
export function FeatureBlock({ block, bullets = block.bullets, flip = false, priority = false, id }: Props) {
  return (
    <Reveal
      as="section"
      aria-labelledby={id}
      className="grid items-stretch overflow-hidden rounded-card border border-line bg-white lg:grid-cols-12"
    >
      <div className={`relative aspect-[16/10] lg:col-span-5 lg:aspect-auto lg:h-full lg:min-h-[340px] ${flip ? "lg:order-2" : ""}`}>
        <Image src={block.image} alt={block.imageAlt} fill priority={priority} sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center p-5 sm:p-7 lg:col-span-7 lg:px-9 lg:py-7">
        <h2 id={id} className="font-display text-h3 font-bold text-ink">
          {block.title}
        </h2>
        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{block.intro}</p>
        <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2.5 text-[0.93rem] leading-snug text-ink/85">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-solar/15 text-solar-deep">
                <Icon name="check" className="size-3.5" />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-card bg-cream">
          {block.specs.map((sp) => (
            <div key={sp.label} className="px-3 py-2.5 sm:px-4">
              <dt className="text-[0.7rem] font-semibold tracking-wide text-muted uppercase">{sp.label}</dt>
              <dd className="mt-0.5 font-display text-[0.95rem] leading-tight font-bold text-ink sm:text-base">{sp.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Reveal>
  );
}
