import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./SectionHeading";
import { IntroAnimate } from "@/components/motion/IntroAnimate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

type Props = {
  /** Trail after "Home"; the last item is the current page. Also emitted as BreadcrumbList JSON-LD. */
  breadcrumb: Crumb[];
  eyebrow: string;
  title: ReactNode;
  /** One line on desktop */
  intro?: ReactNode;
  children?: ReactNode;
};

/**
 * Compact inner-page header: breadcrumb → eyebrow → h1 → one-line intro on a full-width "sunrise" gradient band
 * (gold → cream → light green) with a soft sun glow on the right, faint grid lines and a 1px bottom edge.
 * The band starts directly under the strip, so the transparent fixed header sits on the same gradient.
 * Top padding = fixed header height (68px / 76px at xl) + 40px (28px on phones); bottom 32px (24px on phones).
 * Text colours are AA on every part of the band, glow included: breadcrumb ink/65 (4.8:1), eyebrow #8F4400 (4.9:1),
 * intro ink/70 (5.6:1), h1 ink (12.5:1).
 */
export function PageHeader({ breadcrumb, eyebrow, title, intro, children }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-[rgb(16_24_40/0.06)] bg-[linear-gradient(120deg,#FFF3D6_0%,#FFE6BF_35%,#FDF0E2_65%,#E9F5E1_100%)] pt-[96px] pb-6 sm:pt-[108px] sm:pb-8 xl:pt-[116px]">
      <JsonLd data={breadcrumbSchema(breadcrumb)} />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(16_24_40/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(16_24_40/0.06)_1px,transparent_1px)] bg-[size:64px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="absolute -top-[200px] right-[-160px] aspect-square w-[min(620px,120vw)] rounded-full bg-[radial-gradient(circle,rgb(247_147_30/0.25)_0%,rgb(247_147_30/0.12)_35%,transparent_68%)] blur-2xl sm:right-[-80px]" />
      </div>
      <Container className="relative">
        <IntroAnimate className="max-w-4xl">
          <nav aria-label="Breadcrumb" data-intro className="text-sm text-ink/65">
            <ol className="flex items-center gap-x-2 overflow-hidden whitespace-nowrap">
              <li className="shrink-0">
                <Link href="/" className="rounded hover:text-ink">
                  Home
                </Link>
              </li>
              {breadcrumb.map((c, i) => {
                const last = i === breadcrumb.length - 1;
                return (
                  <li key={c.path} className={`flex items-center gap-2 ${last ? "min-w-0" : "shrink-0"}`}>
                    <span aria-hidden className="text-ink/30">
                      /
                    </span>
                    {last ? (
                      <span aria-current="page" className="truncate font-medium text-ink">
                        {c.name}
                      </span>
                    ) : (
                      <Link href={c.path} className="rounded hover:text-ink">
                        {c.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <div data-intro className="mt-3 sm:mt-4">
            <Eyebrow tone="band">{eyebrow}</Eyebrow>
          </div>
          <h1 data-intro className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-ink">
            {title}
          </h1>
          {intro ? (
            <div data-intro className="mt-1.5 max-w-3xl text-[0.95rem] leading-snug text-ink/70 sm:mt-2 sm:text-lg sm:leading-relaxed">
              {intro}
            </div>
          ) : null}
          {children ? (
            <div data-intro className="mt-4">
              {children}
            </div>
          ) : null}
        </IntroAnimate>
      </Container>
    </section>
  );
}
