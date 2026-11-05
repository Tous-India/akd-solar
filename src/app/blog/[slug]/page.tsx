import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { QuickAnswer } from "@/components/ui/QuickAnswer";
import { FaqList } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatDate, getPost, posts, readingMinutes, type Block } from "@/lib/blog";
import { articleSchema, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const base = pageMeta({ title: post.metaTitle, description: post.description, path: `/blog/${post.slug}` });
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", publishedTime: post.date, modifiedTime: post.updated ?? post.date, authors: [post.author.name] },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "h2":
      return <h2 key={i}>{b.text}</h2>;
    case "h3":
      return <h3 key={i}>{b.text}</h3>;
    case "p":
      return <p key={i}>{b.text}</p>;
    case "ul":
      return (
        <ul key={i}>
          {b.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i}>
          {b.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <p key={i} className="flex gap-3 rounded-card border border-line bg-sand/70 p-4 text-[0.95rem]">
          <Icon name="sparkle" className="mt-1 size-4 shrink-0 text-sun-deep" />
          <span>{b.text}</span>
        </p>
      );
    case "table":
      return (
        <div key={i} className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full min-w-[480px] text-left text-[0.95rem]">
            <caption className="border-b border-line px-4 py-3 text-left text-sm font-semibold text-muted">{b.caption}</caption>
            <thead>
              <tr className="border-b border-line bg-sand/50">
                {b.head.map((h, j) => (
                  <th key={j} scope="col" className="px-4 py-3 font-display font-semibold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} className="border-b border-line last:border-0">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="px-4 py-3 font-semibold text-ink">
                        {cell}
                      </th>
                    ) : (
                      <td key={c} className="px-4 py-3 text-ink/80">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const minutes = readingMinutes(post);
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={[articleSchema(post), faqSchema([post.quickAnswer, ...post.faqs])]} />
      <PageHero
        crumbs={[
          { name: "Blog", path: "/blog" },
          { name: post.metaTitle, path: `/blog/${post.slug}` },
        ]}
        eyebrow={post.category}
        title={post.title}
        subtitle={
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base">
            <span className="font-semibold text-ink">{post.author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{minutes} min read</span>
          </p>
        }
      />

      <article className="pb-20 sm:pb-28">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="min-w-0 max-w-3xl">
            <QuickAnswer q={post.quickAnswer.q} a={post.quickAnswer.a} />
            <div className="prose-akd mt-10">{post.blocks.map(renderBlock)}</div>

            <section aria-labelledby="post-faq" className="mt-16">
              <h2 id="post-faq" className="font-display text-h3 font-bold">
                Frequently asked questions
              </h2>
              <div className="mt-6">
                <FaqList items={post.faqs} />
              </div>
            </section>

            <p className="mt-10 text-sm text-muted">
              Published {formatDate(post.date)}
              {post.updated ? ` · Updated ${formatDate(post.updated)}` : ""} by {post.author.name} ({post.author.role}). Figures are indicative and
              checked against current rules at the time of writing.
            </p>
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <nav aria-labelledby="related-title" className="rounded-card border border-line bg-white p-6">
              <h2 id="related-title" className="font-display text-lg font-bold">
                Related
              </h2>
              <ul className="mt-4 space-y-1">
                {post.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="group flex min-h-11 items-center justify-between gap-3 font-medium text-panel">
                      {r.label}
                      <Icon name="arrowRight" className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="on-dark rounded-card bg-navy p-6 text-cream">
              <p className="font-display text-lg font-bold">See your own numbers</p>
              <p className="mt-2 text-sm text-cream/75">System size, subsidy and payback for your bill in under a minute.</p>
              <Link href="/calculator" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-gold hover:text-white">
                Open the calculator <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          </aside>
        </Container>
      </article>

      <section aria-labelledby="more-title" className="bg-sand py-16 sm:py-20">
        <Container>
          <h2 id="more-title" className="font-display text-h3 font-bold">
            More from the blog
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-card border border-line bg-white p-5 transition-colors hover:border-sun">
                  <span className="text-xs font-semibold tracking-wide text-sun-deep uppercase">{p.category}</span>
                  <span className="mt-2 font-display font-semibold text-ink">{p.title}</span>
                  <span className="mt-auto pt-4 text-sm text-muted">{readingMinutes(p)} min read</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
