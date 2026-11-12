import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { FaqList } from "@/components/home/Faq";
import { ContactForm } from "@/components/contact/ContactForm";
import { ProjectPhoto } from "@/components/projects/ProjectPhoto";
import { JsonLd } from "@/components/seo/JsonLd";
import { projectCaption, projects } from "@/lib/data";
import { cityFaqs, getLocation, locations, nearbyLocations } from "@/lib/locations";
import { cityServiceSchema, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site, telHref } from "@/lib/site";

type Props = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }));
}

/** Under 155 characters: drops the DISCOM name when it would make the description too long */
function cityDescription(name: string, discom: string) {
  const long = `Rooftop solar in ${name} by AKD Solar, Sonipat: up to ₹78,000 PM Surya Ghar subsidy, ${discom} net metering, installed in as little as 3 days.`;
  return long.length <= 155 ? long : `Rooftop solar in ${name} by AKD Solar, Sonipat: up to ₹78,000 PM Surya Ghar subsidy, net metering handled, installed in as little as 3 days.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) return {};
  return {
    ...pageMeta({
      title: `Solar Panel Installation in ${loc.name}`,
      description: cityDescription(loc.name, loc.discom.short),
      path: `/solar-panel-installation/${loc.slug}`,
    }),
    other: { "geo.region": loc.state === "Haryana" ? "IN-HR" : "IN-DL", "geo.placename": loc.name, "geo.position": `${loc.lat};${loc.lng}`, ICBM: `${loc.lat}, ${loc.lng}` },
  };
}

/** Real project photos whose confirmed location mentions this city */
const cityProjects = (name: string) => projects.filter((p) => p.location?.toLowerCase().includes(name.toLowerCase()));

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) notFound();
  const isOffice = loc.slug === site.address.citySlug;
  const faqs = cityFaqs(loc);
  const local = cityProjects(loc.name).slice(0, 3);
  const path = `/solar-panel-installation/${loc.slug}`;

  return (
    <>
      <JsonLd data={[cityServiceSchema(loc), faqSchema(faqs)]} />
      <PageHeader
        eyebrow={loc.region}
        breadcrumb={[
          { name: "Areas We Serve", path: "/locations" },
          { name: loc.name, path },
        ]}
        title={`Solar Panel Installation in ${loc.name}`}
        intro={loc.heroLine}
      />

      <Container>
        <section aria-labelledby="local-title" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <Reveal>
            <h2 id="local-title" className="text-h2 font-bold text-ink">
              Solar in {loc.name}
            </h2>
            <p className="mt-3 text-muted">{loc.intro[0]}</p>
            <p className="mt-3 text-muted">{loc.sunshine}</p>
            <h3 className="mt-6 font-display text-h3 font-bold text-ink">Areas we cover</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {loc.localities.map((l) => (
                <li key={l} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink">
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="flex flex-col gap-3 self-start rounded-card border border-line bg-white p-5 sm:p-6">
            <p className="flex items-start gap-2.5 text-ink/85">
              <Icon name="gauge" className="mt-1 size-4 shrink-0 text-sun-deep" /> Net metering with {loc.discom.name}
            </p>
            <p className="flex items-start gap-2.5 text-ink/85">
              <Icon name="mapPin" className="mt-1 size-4 shrink-0 text-sun-deep" />
              {isOffice ? "Our head and branch offices are in Sonipat." : `Served from our ${site.address.city} offices.`}
            </p>
            <p className="flex items-start gap-2.5 text-ink/85">
              <Icon name="rupee" className="mt-1 size-4 shrink-0 text-sun-deep" />
              <span>
                Up to ₹78,000 subsidy —{" "}
                <Link href="/pm-surya-ghar-yojana" className="font-semibold text-panel underline-offset-4 hover:underline">
                  how it works
                </Link>
              </span>
            </p>
            <a href={telHref()} className="mt-1 inline-flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-panel">
              <Icon name="phone" className="size-5 text-sun-deep" /> {site.phone}
            </a>
          </Reveal>
        </section>

        {local.length ? (
          <section aria-labelledby="local-projects" className="mt-14">
            <h2 id="local-projects" className="text-h2 font-bold text-ink">
              Our work in {loc.name}
            </h2>
            <Reveal as="ul" stagger={0.06} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {local.map((p) => (
                <li key={p.id}>
                  <ProjectPhoto image={p.images[0]} caption={projectCaption(p)} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </Reveal>
          </section>
        ) : null}

        <section aria-labelledby="faq-title" className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <h2 id="faq-title" className="text-h2 font-bold text-ink">
            Questions
          </h2>
          <FaqList items={faqs} />
        </section>

        <section aria-labelledby="nearby-title" className="mt-14">
          <h2 id="nearby-title" className="font-display text-h3 font-bold text-ink">
            Nearby areas
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {nearbyLocations(loc, 4).map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/solar-panel-installation/${n.slug}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink hover:border-sun"
                >
                  {n.name} <span className="font-normal text-muted">{n.km} km</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="quote" aria-label="Request a quote" className="scroll-mt-32 py-14">
          <ContactForm defaultCity={loc.name} title={`Free site visit in ${loc.name}`} />
        </section>
      </Container>
    </>
  );
}
