import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { blogRoutes, cityRoutes, serviceRoutes, staticRoutes } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Sitemap",
  description: "Every page on the AKD Solar website: services, the 22 cities we serve in Haryana and Delhi NCR, guides and tools.",
  path: "/sitemap",
});

const groups = [
  { title: "Main pages", links: staticRoutes.filter((r) => r.path !== "/sitemap") },
  { title: "Services", links: serviceRoutes },
  { title: "Areas we serve", links: cityRoutes },
  { title: "Blog", links: blogRoutes },
];

export default function SitemapPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Sitemap", path: "/sitemap" }]} eyebrow="Sitemap" title="Every page, in one place." subtitle="Use this page to find any service, city or guide on our website." />
      <section aria-label="All pages" className="pb-20 sm:pb-28">
        <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="font-display text-lg font-bold">{g.title}</h2>
              <ul className="mt-4 space-y-1">
                {g.links.map((l) => (
                  <li key={l.path}>
                    <Link href={l.path} className="inline-flex min-h-10 items-center text-panel underline-offset-4 hover:underline">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
