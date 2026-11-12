import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatDate, posts, readingMinutes } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";
import { ORG_ID } from "@/lib/schema";

export const metadata: Metadata = pageMeta({
  title: "Solar Blog — Subsidy, Costs & Guides",
  description: "Plain-English guides to PM Surya Ghar subsidy, solar costs, net-metering and system types for homes and businesses in Haryana and Delhi NCR.",
  path: "/blog",
});

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} Blog`,
    url: absoluteUrl("/blog"),
    publisher: { "@id": ORG_ID },
    blogPost: sorted.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/blog/${p.slug}`), datePublished: p.date })),
  };

  return (
    <>
      <JsonLd data={blogSchema} />
      <PageHeader
        breadcrumb={[{ name: "Blog", path: "/blog" }]}
        eyebrow="Blog"
        title="Solar guides"
        intro="Subsidy, costs and net metering, explained simply."
      />

      <section aria-label="Articles" className="pb-20 sm:pb-28">
        <Container>
          <Reveal as="ul" stagger={0.08} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p, i) => (
              <li key={p.slug} className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white p-6 transition-colors hover:border-sun sm:p-8">
                  {i === 0 ? <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full sun-glow opacity-60" /> : null}
                  <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <span className="rounded-full bg-sand px-3 py-1 font-semibold text-sun-deep">{p.category}</span>
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                    <span aria-hidden>·</span>
                    <span>{readingMinutes(p)} min read</span>
                  </div>
                  <h2 className={`relative mt-5 font-display font-bold tracking-tight text-ink ${i === 0 ? "text-[clamp(1.5rem,1.2rem+1vw,2rem)]" : "text-h3"}`}>
                    <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="relative mt-3 leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="relative mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-panel">
                    Read article <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </article>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
