import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { QuickAnswer } from "@/components/ui/QuickAnswer";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/home/CtaBand";
import { FaqList } from "@/components/home/Faq";
import { ServiceArt } from "@/components/services/ServiceArt";
import { ComparisonTable } from "@/components/services/ComparisonTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { getService, services } from "@/lib/data";
import { locations, regions } from "@/lib/locations";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { whatsappHref } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  // Keep "<title> | AKD Solar" under 60 characters
  const long = `${service.shortTitle} in Haryana & Delhi NCR`;
  const title = long.length <= 47 ? long : `${service.shortTitle} in Haryana & NCR`;
  return pageMeta({ title, description: service.metaDescription, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const others = services.filter((s) => s.slug !== service.slug);
  const allFaqs = [service.quickAnswer, ...service.faqs];

  return (
    <>
      <JsonLd data={[serviceSchema(service), faqSchema(allFaqs)]} />
      <PageHero
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.shortTitle, path: `/services/${service.slug}` },
        ]}
        eyebrow={service.highlight}
        title={service.title}
        subtitle={service.short}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href={`/contact?service=${service.slug}`} size="lg" magnetic>
            Get a free quote
          </Button>
          <Button href="/calculator" size="lg" variant="secondary" icon="sun">
            Calculate savings
          </Button>
        </div>
      </PageHero>

      <section aria-label="Quick answer" className="pb-12">
        <Container>
          <QuickAnswer className="max-w-3xl" q={service.quickAnswer.q} a={service.quickAnswer.a} />
        </Container>
      </section>

      <section aria-labelledby="overview-title" className="pb-20 sm:pb-28">
        <Container className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="clip" className="relative aspect-[4/3] overflow-hidden rounded-card lg:sticky lg:top-28">
            <ServiceArt slug={service.slug} />
          </Reveal>
          <div>
            <SectionHeading eyebrow="What's included" title={<span id="overview-title">What do you get with {service.shortTitle.toLowerCase()}?</span>} />
            <p className="mt-5 text-lead text-muted">{service.description}</p>
            <Reveal as="ul" stagger={0.05} className="mt-8 grid gap-3">
              {service.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-solar/15 text-solar-deep">
                    <Icon name="check" className="size-4" />
                  </span>
                  <span className="text-ink/85">{f}</span>
                </li>
              ))}
            </Reveal>
            <Reveal className="mt-8 rounded-card border border-line bg-white/75 p-5 sm:p-6">
              <h3 className="text-sm font-bold tracking-[0.14em] text-muted uppercase">Who is it for?</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.idealFor.map((x) => (
                  <li key={x} className="rounded-full bg-sand px-3 py-1.5 text-sm font-medium text-ink">
                    {x}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {service.slug === "on-grid-off-grid-hybrid-solar" ? (
        <section aria-labelledby="compare-title" className="pb-20 sm:pb-28">
          <Container>
            <SectionHeading eyebrow="Compare" title={<span id="compare-title">How do on-grid, off-grid and hybrid compare?</span>} />
            <ComparisonTable />
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="areas-title" className="bg-sand py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Where we install"
            title={<span id="areas-title">Where is {service.shortTitle.toLowerCase()} available?</span>}
            subtitle={`We install ${service.title.toLowerCase()} in ${locations.length} cities across Haryana and Delhi NCR.`}
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {regions.map((region) => (
              <div key={region}>
                <h3 className="font-display text-lg font-bold">{region}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {locations
                    .filter((l) => l.region === region)
                    .map((l) => (
                      <li key={l.slug}>
                        <Link
                          href={`/solar-panel-installation/${l.slug}`}
                          className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 text-sm font-medium text-ink transition-colors hover:border-sun"
                        >
                          {service.shortTitle} in {l.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-title" className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="FAQ" title={<span id="faq-title">{service.shortTitle}: common questions</span>} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button href={whatsappHref(`Hi AKD Solar, I have a question about ${service.title}.`)} variant="secondary" iconLeft="whatsapp" icon={null}>
                Ask on WhatsApp
              </Button>
            </div>
          </div>
          <FaqList items={allFaqs} />
        </Container>
      </section>

      <section aria-labelledby="other-title" className="pb-8">
        <Container>
          <h2 id="other-title" className="font-display text-h3 font-bold">
            Other solar services
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  data-tilt
                  className="group flex h-full items-start gap-4 rounded-card border border-line bg-white/75 p-5 transition-colors hover:border-sun"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-ink">{s.title}</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-panel">
                      Learn more <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
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
