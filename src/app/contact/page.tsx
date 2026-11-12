import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { formatOffice, mailHref, mapsUrl, site, telHref } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact AKD Solar — Sonipat",
  description: `Call ${site.phones.join(" or ")} or visit AKD Solar at Shop No. 46, Main Market, Sector 14, Sonipat. Book a free solar site visit.`,
  path: "/contact",
});

const head = site.offices[0];
const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(head.mapsQuery)}&z=16&output=embed`;

export default function ContactPage() {
  return (
    <>
      <PageHeader breadcrumb={[{ name: "Contact", path: "/contact" }]} eyebrow="Contact" title="Contact us" intro="Book a free site visit. We usually reply the same day." />

      <section aria-label="Enquiry form and contact details" className="pb-16 sm:pb-20">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
          <Reveal>
            <ContactForm />
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal className="rounded-card border border-line bg-white p-5 sm:p-6">
              <h2 className="font-display text-h3 font-bold text-ink">Call or email</h2>
              <ul className="mt-3 space-y-1">
                {site.phones.map((p) => (
                  <li key={p}>
                    <a href={telHref(p)} className="inline-flex min-h-11 items-center gap-3 font-semibold text-ink hover:text-panel">
                      <Icon name="phone" className="size-5 text-sun-deep" /> {p}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={mailHref} className="inline-flex min-h-11 items-center gap-3 font-semibold break-all text-ink hover:text-panel">
                    <Icon name="mail" className="size-5 text-sun-deep" /> {site.email}
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {site.offices.map((o) => (
                <li key={o.label} className="rounded-card border border-line bg-white p-5 sm:p-6">
                  <h2 className="flex items-center gap-2 font-display text-h3 font-bold text-ink">
                    <Icon name="mapPin" className="size-5 text-sun-deep" /> {o.label}
                  </h2>
                  <address className="mt-2 text-ink/85 not-italic">{formatOffice(o)}</address>
                  <a
                    href={mapsUrl(o.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-panel"
                  >
                    Get directions <Icon name="arrowUpRight" className="size-4" />
                  </a>
                </li>
              ))}
            </Reveal>

            <Reveal className="rounded-card border border-line bg-white p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-h3 font-bold text-ink">
                <Icon name="clock" className="size-5 text-sun-deep" /> Office hours
              </h2>
              <dl className="mt-2 divide-y divide-line">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2.5">
                    <dt className="text-muted">{h.days}</dt>
                    <dd className="font-semibold text-ink">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-labelledby="map-title" className="pb-16 sm:pb-20">
        <Container>
          <h2 id="map-title" className="text-h2 font-bold text-ink">
            Find our head office
          </h2>
          <Reveal className="mt-5 overflow-hidden rounded-card border border-line bg-sand">
            <iframe
              title={`Map: AKD Solar head office, ${formatOffice(head)}`}
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[360px] w-full border-0 sm:h-[420px]"
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
