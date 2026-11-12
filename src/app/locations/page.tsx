import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { menuLinks } from "@/components/layout/menuLinks";
import { getLocation } from "@/lib/locations";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl, formatOffice, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Areas We Serve — Sonipat & Delhi NCR",
  description: "AKD Solar installs rooftop solar in Delhi NCR, Gurugram, Faridabad, Sonipat, Rohtak, Panipat and Karnal, from our two offices in Sonipat.",
  path: "/locations",
});

export default function LocationsPage() {
  const cities = menuLinks.locations.map((l) => getLocation(l.href.split("/").pop()!)!).filter(Boolean);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Areas served by AKD Solar",
    itemListElement: cities.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: `Solar panel installation in ${l.name}`, url: absoluteUrl(`/solar-panel-installation/${l.slug}`) })),
  };

  return (
    <>
      <JsonLd data={itemList} />
      <PageHeader breadcrumb={[{ name: "Areas We Serve", path: "/locations" }]} eyebrow="Locations" title="Areas we serve" intro={`Seven areas across Haryana and Delhi NCR, all served from our offices in ${site.address.city}.`} />

      <Container className="pb-16 sm:pb-20">
        <Reveal as="ul" stagger={0.05} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/solar-panel-installation/${l.slug}`}
                className="group flex h-full items-center justify-between gap-4 rounded-card border border-line bg-white p-5 transition-colors hover:border-sun"
              >
                <span>
                  <span className="block font-display text-h3 font-bold text-ink">{l.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">Net metering: {l.discom.short}</span>
                </span>
                <Icon name="arrowRight" className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </Reveal>

        <Reveal as="ul" stagger={0.06} className="mt-8 grid gap-3 md:grid-cols-2">
          {site.offices.map((o) => (
            <li key={o.label} className="flex gap-3 rounded-card bg-sand p-5">
              <Icon name="mapPin" className="mt-0.5 size-5 shrink-0 text-sun-deep" />
              <span>
                <span className="block font-semibold text-ink">{o.label}</span>
                <span className="text-muted">{formatOffice(o)}</span>
              </span>
            </li>
          ))}
        </Reveal>
      </Container>
    </>
  );
}
