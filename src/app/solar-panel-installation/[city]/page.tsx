import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading, Eyebrow } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { QuickAnswer } from "@/components/ui/QuickAnswer";
import { SunriseBackdrop } from "@/components/ui/SunriseBackdrop";
import { Reveal } from "@/components/motion/Reveal";
import { BgFade } from "@/components/motion/BgFade";
import { FaqList } from "@/components/home/Faq";
import { Calculator } from "@/components/calculator/Calculator";
import { ContactForm } from "@/components/contact/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { services, subsidyTiers } from "@/lib/data";
import { calculate } from "@/lib/calc";
import { formatINR, formatLakh, formatNumber } from "@/lib/format";
import { cityFaqs, getLocation, locations, nearbyLocations } from "@/lib/locations";
import { cityServiceSchema, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { fullAddress, officeLabel, site, telHref, whatsappHref } from "@/lib/site";

type Props = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }));
}

function metaDescription(name: string, discom: string) {
  const long = `Solar panel installation in ${name}: up to ₹78,000 PM Surya Ghar subsidy, ${discom} net-metering handled, free site survey and ~7-day install.`;
  return long.length <= 155 ? long : `Solar panel installation in ${name}: up to ₹78,000 PM Surya Ghar subsidy, net-metering handled, free site survey and ~7-day install.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) return {};
  return {
    ...pageMeta({ title: `Solar Panel Installation in ${loc.name}`, description: metaDescription(loc.name, loc.discom.short), path: `/solar-panel-installation/${loc.slug}` }),
    other: { "geo.region": loc.state === "Haryana" ? "IN-HR" : loc.state === "Delhi" ? "IN-DL" : "IN-UP", "geo.placename": loc.name, "geo.position": `${loc.lat};${loc.lng}`, ICBM: `${loc.lat}, ${loc.lng}` },
  };
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(toRad(b.lat - a.lat) / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(toRad(b.lng - a.lng) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)));
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const loc = getLocation(city);
  if (!loc) notFound();

  const isOffice = loc.slug === site.address.citySlug;
  const officeKm = distanceKm(site.geo, loc);
  const est = calculate({ bill: loc.typicalBill, stateId: loc.calcState, roofArea: 1500, type: "residential" });
  const faqs = cityFaqs(loc);
  const nearby = nearbyLocations(loc, 5);
  const path = `/solar-panel-installation/${loc.slug}`;

  return (
    <>
      <JsonLd data={[cityServiceSchema(loc), faqSchema(faqs)]} />

      <PageHero
        crumbs={[
          { name: "Areas We Serve", path: "/locations" },
          { name: loc.name, path },
        ]}
        sun
        eyebrow={`${loc.region} · ${loc.discom.short}`}
        title={
          <>
            Solar Panel Installation in <span className="text-sun-deep">{loc.name}</span>
          </>
        }
        subtitle={loc.heroLine}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href="#quote" size="lg" magnetic>
            Get a free quote in {loc.name}
          </Button>
          <Button href={whatsappHref(`Hello AKD Solar! I'd like a free solar site survey in ${loc.name}.`)} size="lg" variant="secondary" iconLeft="whatsapp" icon={null}>
            WhatsApp us
          </Button>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink/80">
          <li className="flex items-center gap-2">
            <Icon name="gauge" className="size-4 text-sun-deep" /> Net-metering with {loc.discom.short}
          </li>
          <li className="flex items-center gap-2">
            <Icon name="mapPin" className="size-4 text-sun-deep" /> {isOffice ? "Our office city" : `Served from our ${site.address.city} office`}
          </li>
          <li className="flex items-center gap-2">
            <Icon name="rupee" className="size-4 text-sun-deep" /> Up to ₹78,000 subsidy
          </li>
        </ul>
      </PageHero>

      <section aria-label="Quick answer" className="pb-14">
        <Container>
          <QuickAnswer
            className="max-w-3xl"
            q={`How much does rooftop solar cost in ${loc.name}?`}
            a={`For a typical ${loc.name} home with a ${formatINR(loc.typicalBill)} monthly bill, a ${formatNumber(est.kw, 1)} kW on-grid system costs about ${formatLakh(est.cost)} before subsidy and around ${formatLakh(est.netCost)} after the ${formatINR(est.subsidy)} PM Surya Ghar subsidy — paying back in roughly ${formatNumber(est.paybackYears, 1)} years.`}
          />
        </Container>
      </section>

      {/* Local intro */}
      <section aria-labelledby="intro-title" className="pb-20 sm:pb-28">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow={`Solar in ${loc.name}`} title={<span id="intro-title">Why go solar in {loc.name}?</span>} />
            <Reveal stagger={0.1} className="mt-6 space-y-5 text-lead text-muted">
              <p>{loc.intro[0]}</p>
              <p>{loc.intro[1]}</p>
            </Reveal>
            <Reveal className="mt-8 flex gap-4 rounded-card border border-line bg-white/75 p-5">
              <Icon name="sun" className="mt-0.5 size-6 shrink-0 text-sun-deep" />
              <div>
                <h3 className="font-display font-bold">How much sun does {loc.name} get?</h3>
                <p className="mt-1 text-muted">{loc.sunshine}</p>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4">
            <Reveal className="rounded-card border border-line bg-white p-6">
              <h3 className="font-display text-lg font-bold">Who we install for in {loc.name}</h3>
              <ul className="mt-4 space-y-2.5">
                {loc.customers.map((c) => (
                  <li key={c} className="flex gap-2.5 text-ink/85">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-solar-deep" /> {c}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="on-dark rounded-card bg-navy p-6 text-cream">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <Icon name="mapPin" className="size-5 text-gold" /> {isOffice ? `Our ${loc.name} office` : `Serving ${loc.name} from ${site.address.city}`}
              </h3>
              <p className="mt-2 text-cream/75">
                {isOffice
                  ? `AKD Solar is based in ${officeLabel}, so ${loc.name} customers get the quickest surveys and service visits.`
                  : `We serve ${loc.name} from our ${site.address.city} office, about ${officeKm} km away, with scheduled survey and service days.`}
              </p>
              <p className="mt-3 text-sm text-cream/60">{fullAddress}</p>
              <a href={telHref} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-gold hover:text-white">
                <Icon name="phone" className="size-5" /> {site.phone}
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Subsidy + net-metering */}
      <section aria-labelledby="subsidy-title" className="on-dark relative overflow-hidden bg-navy py-20 text-cream sm:py-28 desk:bg-cream">
        <BgFade />
        <SunriseBackdrop tone="dark" glowClass="-top-[40%] left-1/2 -translate-x-1/2" />
        <Container className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="PM Surya Ghar"
              title={<span id="subsidy-title">How much subsidy can you get in {loc.name}?</span>}
              subtitle={`Homes in ${loc.name} on a ${loc.discom.short} connection can claim the central PM Surya Ghar subsidy, credited to your bank account after commissioning.`}
            />
            <Reveal as="ul" stagger={0.08} className="mt-8 grid gap-3 sm:grid-cols-3">
              {subsidyTiers.map((t) => (
                <li key={t.kw} className={`rounded-card border p-5 ${t.popular ? "border-gold/70 bg-gold/[0.08]" : "border-white/10 bg-white/[0.04]"}`}>
                  <p className="text-sm text-cream/70">{t.kw}</p>
                  <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">{formatINR(t.amount)}</p>
                  <p className="mt-1 text-xs text-cream/60">{t.usage}</p>
                </li>
              ))}
            </Reveal>
            <p className="mt-4 text-sm text-cream/55">Amounts follow current MNRE guidelines and may change.</p>
          </div>
          <div>
            <Eyebrow tone="dark">Net-metering in {loc.name}</Eyebrow>
            <h3 className="mt-4 font-display text-h3 font-bold">How does net-metering work with {loc.discom.short}?</h3>
            <p className="mt-3 text-cream/75">
              Your connection is with {loc.discom.name}. {loc.discom.note ?? ""} A bi-directional meter records what you import and export, so you only pay for the
              net units.
            </p>
            <Reveal as="ol" stagger={0.08} className="mt-6 space-y-3">
              {[
                "We register you on the PM Surya Ghar portal and select your DISCOM.",
                `${loc.discom.short} checks technical feasibility for your connection.`,
                "Our crew installs the system — usually in about 7 days.",
                `${loc.discom.short} inspects the system and fits the net meter.`,
                "Commissioning is confirmed and the subsidy is released to your bank.",
              ].map((step, i) => (
                <li key={step} className="flex gap-4 rounded-card border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-ink">{i + 1}</span>
                  <span className="text-cream/85">{step}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Calculator */}
      <section aria-labelledby="calc-title" className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Savings calculator"
            title={<span id="calc-title">Estimate your solar savings in {loc.name}</span>}
            subtitle={`Pre-set for ${loc.state} tariffs and a typical ${loc.name} bill. Adjust the sliders to match yours.`}
          />
          <div className="mt-10">
            <Calculator initialStateId={loc.calcState} initialBill={loc.typicalBill} cityName={loc.name} />
          </div>
        </Container>
      </section>

      {/* Services + localities + nearby */}
      <section aria-labelledby="services-title" className="bg-sand py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="What we offer" title={<span id="services-title">Solar services in {loc.name}</span>} />
          <Reveal as="ul" stagger={0.06} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  data-tilt
                  className="group flex h-full items-start gap-4 rounded-card border border-line bg-white p-5 transition-colors hover:border-sun"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-ink">{s.title}</span>
                    <span className="mt-1 block text-sm text-muted">{s.short}</span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-h3 font-bold">Which areas of {loc.name} do we cover?</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {loc.localities.map((l) => (
                  <li key={l} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-medium text-ink">
                    <Icon name="mapPin" className="size-4 text-sun-deep" /> {l}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Not listed? We cover the whole of {loc.name} and nearby villages — just ask.</p>
            </div>
            <div>
              <h2 className="font-display text-h3 font-bold">Nearby cities we serve</h2>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {nearby.map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/solar-panel-installation/${n.slug}`}
                      className="group flex min-h-12 items-center justify-between gap-3 rounded-card border border-line bg-white px-4 py-2 transition-colors hover:border-sun"
                    >
                      <span className="font-semibold text-ink">Solar in {n.name}</span>
                      <span className="flex items-center gap-1 text-sm text-muted">
                        {n.km} km <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/locations" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-panel">
                All areas we serve <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="FAQ"
            title={<span id="faq-title">Solar in {loc.name}: your questions answered</span>}
            subtitle={
              <>
                More detail in our guides to <Link href="/blog/pm-surya-ghar-subsidy-haryana" className="font-semibold text-panel underline-offset-4 hover:underline">PM Surya Ghar subsidy</Link> and{" "}
                <Link href="/blog/3kw-solar-system-cost-delhi-ncr" className="font-semibold text-panel underline-offset-4 hover:underline">3 kW system costs</Link>.
              </>
            }
          />
          <FaqList items={faqs} />
        </Container>
      </section>

      {/* Quote */}
      <section id="quote" aria-labelledby="quote-title" className="scroll-mt-24 pb-20 sm:pb-28">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
          <div className="lg:pt-6">
            <Eyebrow>Free site survey</Eyebrow>
            <h2 id="quote-title" className="mt-4 text-h2 font-bold">
              Get your {loc.name} solar quote
            </h2>
            <p className="mt-4 text-lead text-muted">
              Tell us about your property. An engineer will call to schedule a free survey and send a written quote with subsidy and savings.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button href={telHref} variant="dark" iconLeft="phone" icon={null}>
                Call {site.phone}
              </Button>
              <Button href={whatsappHref(`Hello AKD Solar! I'd like a solar quote for my property in ${loc.name}.`)} variant="secondary" iconLeft="whatsapp" icon={null}>
                WhatsApp
              </Button>
            </div>
          </div>
          <ContactForm defaultCity={loc.name} title={`Request a free survey in ${loc.name}`} />
        </Container>
      </section>
    </>
  );
}
