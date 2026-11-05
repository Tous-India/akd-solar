import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./SectionHeading";
import { SunriseBackdrop } from "./SunriseBackdrop";
import { IntroAnimate } from "@/components/motion/IntroAnimate";
import { RisingSun } from "@/components/motion/RisingSun";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

type Props = {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  /** Breadcrumb trail after "Home"; the last item is the current page */
  crumbs: Crumb[];
  children?: ReactNode;
  /** Soft rising sun in the bottom-right corner (tablet and up) */
  sun?: boolean;
};

export function PageHero({ eyebrow, title, subtitle, crumbs, children, sun }: Props) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <SunriseBackdrop glowClass="-top-[30%] right-[-25%] sm:right-[-10%]" />
      {sun ? (
        <div aria-hidden className="pointer-events-none absolute right-[-4%] bottom-0 hidden w-[44%] max-w-[620px] md:block">
          <RisingSun size="md" intensity={0.5} scrub={false} beams={3} sparkles={5} tone="onLight" minWidth={768} />
        </div>
      ) : null}
      <Container className="relative">
        <IntroAnimate className="max-w-4xl">
          <nav aria-label="Breadcrumb" data-intro className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="rounded hover:text-ink">
                  Home
                </Link>
              </li>
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={c.path} className="flex items-center gap-2">
                    <span aria-hidden>/</span>
                    {last ? (
                      <span aria-current="page" className="font-medium text-ink">
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
          <div data-intro>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h1 data-intro className="mt-5 text-display font-extrabold text-ink">
            {title}
          </h1>
          <div data-intro className="mt-6 max-w-2xl text-lead text-muted">
            {subtitle}
          </div>
          {children ? (
            <div data-intro className="mt-8">
              {children}
            </div>
          ) : null}
        </IntroAnimate>
      </Container>
    </section>
  );
}
