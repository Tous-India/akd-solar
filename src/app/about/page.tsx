import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { NumbersStrip } from "@/components/home/NumbersStrip";
import { ImageGallery } from "@/components/about/ImageGallery";
import { StandsFor, StandsForList } from "@/components/about/StandsFor";
import { InlineCta } from "@/components/solutions/Blocks";
import { certificates, vision } from "@/lib/data";
import { imageDims } from "@/lib/projects.generated";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About AKD Solar — Since 2017, Sonipat",
  description: `${site.legalName}, Sonipat: rooftop solar since ${site.foundedYear}, authorised Havells dealer since ${site.havellsDealerSince}, founded by ${site.founder.name}.`,
  path: "/about",
});

const dim = (src: string) => imageDims[src] ?? { width: 1200, height: 900 };
const withDims = (src: string, caption: string) => ({ src, caption, ...dim(src) });

const office = withDims("/images/about/office-sonipat-sector14.jpg", "Head office — Shop No. 46, Main Market, Sector 14, Sonipat");

export default function AboutPage() {
  const doctorate = withDims("/images/about/honorary-doctorate.jpg", `Honorary Doctorate in Technology awarded to ${site.founder.name} (2026)`);
  return (
    <>
      <PageHeader
        breadcrumb={[{ name: "About", path: "/about" }]}
        eyebrow="About us"
        title="About AKD Solar"
        intro={`Solar EPC and O&M from Sonipat since ${site.foundedYear}. Authorised Havells dealer since ${site.havellsDealerSince}.`}
      />

      <Container>
        {/* Founder */}
        <section aria-labelledby="founder-title" className="grid items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <Reveal className="flex flex-col gap-5 rounded-card border border-line bg-white p-6 sm:flex-row sm:p-8">
            {/* TODO: add a founder photo (none was provided) */}
            <span aria-hidden className="flex size-24 shrink-0 items-center justify-center rounded-full bg-navy font-display text-3xl font-bold text-gold">
              AD
            </span>
            <div>
              <h2 id="founder-title" className="font-display text-h3 font-bold text-ink">
                {site.founder.name}
              </h2>
              <p className="text-sm font-semibold text-sun-deep">{site.founder.role}</p>
              <ul className="mt-4 space-y-1.5 text-ink/85">
                {site.founder.qualifications.map((q) => (
                  <li key={q} className="flex gap-2.5">
                    <Icon name="check" className="mt-1 size-4 shrink-0 text-solar-deep" /> {q}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-muted">{site.founder.experience}.</p>
            </div>
          </Reveal>
          <ImageGallery items={[doctorate]} className="max-w-sm lg:ml-auto" sizes="(min-width: 1024px) 384px, 90vw" contain />
        </section>

        {/* Vision */}
        <Reveal as="section" aria-label="Our vision" className="my-14 text-center">
          <p className="text-sm font-bold tracking-[0.16em] text-sun-deep uppercase">Our vision</p>
          <blockquote className="mx-auto mt-3 max-w-3xl font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-snug font-bold text-ink">“{vision}”</blockquote>
        </Reveal>

        {/* Havells partnership */}
        <Reveal as="section" aria-labelledby="partner-title" className="mb-14 grid items-center gap-8 overflow-hidden rounded-card border border-line bg-white p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-sun-deep uppercase">Business partners since {site.havellsDealerSince}</p>
            <h2 id="partner-title" className="mt-2 text-h2 font-bold text-ink">
              Authorised Havells dealer
            </h2>
            <p className="mt-3 text-muted">
              Since {site.havellsDealerSince}, AKD Solar has been an authorised dealer of Havells India Ltd. Our plants use Havells inverters, DCDBs and
              ACDBs backed by the brand&apos;s warranty and service network — and our own team stays with you after installation.
            </p>
            <ul className="mt-5 grid gap-2 text-ink/85 sm:grid-cols-2">
              {[`${site.numbers.years} years in solar`, `${site.numbers.installations} on-grid installations`, `${site.numbers.customers} solar customers`, "Together Everyone Achieves More"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Icon name="check" className="mt-1 size-4 shrink-0 text-leaf" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Image
            src="/images/about/havells-partner-2018.jpg"
            alt="AKD Solar and Havells — business partners since 2018"
            width={1400}
            height={955}
            sizes="(min-width: 1024px) 560px, 90vw"
            className="h-auto w-full rounded-card border border-line"
          />
        </Reveal>
      </Container>

      <NumbersStrip />

      <Container>
        <section aria-labelledby="stands-title" className="mb-14">
          <h2 id="stands-title" className="text-h2 font-bold text-ink">
            What AKD Solar stands for
          </h2>
          <StandsFor size="lg" label={false} className="mt-6 max-w-3xl" />
          <div className="mt-8">
            <StandsForList />
          </div>
        </section>

        <section aria-labelledby="certs-title">
          <h2 id="certs-title" className="text-h2 font-bold text-ink">
            Certificates
          </h2>
          <ImageGallery
            items={certificates.map((c) => withDims(c.src, c.title))}
            className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3"
            sizes="(min-width: 768px) 33vw, 50vw"
            contain
          />
        </section>

        <section aria-labelledby="office-title" className="mt-14">
          <h2 id="office-title" className="text-h2 font-bold text-ink">
            Our office
          </h2>
          <Reveal className="mt-6 max-w-4xl">
            <figure className="overflow-hidden rounded-card border border-line bg-white">
              <Image
                src={office.src}
                alt={office.caption}
                width={office.width}
                height={office.height}
                sizes="(min-width: 960px) 896px, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-3 text-sm text-muted">{office.caption}</figcaption>
            </figure>
          </Reveal>
        </section>

        <InlineCta />
      </Container>
    </>
  );
}
