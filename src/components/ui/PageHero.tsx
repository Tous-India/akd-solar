import type { ReactNode } from "react";
import { Container } from "./Container";
import { IntroAnimate } from "@/components/motion/IntroAnimate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; path: string };

type Props = {
  title: ReactNode;
  /** One line, max two short sentences */
  subtitle?: ReactNode;
  /** Breadcrumb trail after "Home" — emitted as BreadcrumbList JSON-LD only (no visible breadcrumb UI) */
  crumbs: Crumb[];
  children?: ReactNode;
};

/** Compact page start for inner pages: h1 + one-line intro on the cream background. */
export function PageHero({ title, subtitle, crumbs, children }: Props) {
  return (
    <section className="pt-28 pb-8 sm:pt-32 sm:pb-10 xl:pt-36">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Container>
        <IntroAnimate className="max-w-3xl">
          <h1 data-intro className="text-display font-extrabold text-ink">
            {title}
          </h1>
          {subtitle ? (
            <div data-intro className="mt-3 max-w-2xl text-lead text-muted">
              {subtitle}
            </div>
          ) : null}
          {children ? (
            <div data-intro className="mt-6">
              {children}
            </div>
          ) : null}
        </IntroAnimate>
      </Container>
    </section>
  );
}
