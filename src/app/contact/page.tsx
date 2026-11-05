import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { fullAddress, mailHref, site, telHref, whatsappHref } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { locations } from "@/lib/locations";
import Link from "next/link";

export const metadata: Metadata = pageMeta({
  title: "Contact Us — Book a Free Solar Site Survey",
  description: `Talk to AKD Solar about rooftop solar for your home or business. Call ${site.phone}, chat on WhatsApp or book a free site survey online.`,
  path: "/contact",
});

const cards: { icon: IconName; title: string; value: string; href?: string; action: string }[] = [
  { icon: "phone", title: "Call us", value: site.phone, href: telHref, action: "Call now" },
  { icon: "mail", title: "Email", value: site.email, href: mailHref, action: "Send an email" },
  { icon: "mapPin", title: "Visit our office", value: fullAddress, href: site.mapsUrl, action: "Get directions" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact us"
        title={
          <>
            Let&apos;s light up your <span className="text-sun-deep">roof</span>.
          </>
        }
        subtitle="Tell us a little about your property and we'll arrange a free, no-obligation site survey — usually within 48 hours."
      >
        <Button href={whatsappHref()} variant="dark" iconLeft="whatsapp" icon="arrowUpRight">
          Chat on WhatsApp
        </Button>
      </PageHero>

      <section aria-label="Enquiry form and contact details" className="pb-20 sm:pb-28">
        <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
          <Reveal>
            <ContactForm />
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {cards.map((c) => (
                <li key={c.title}>
                  <a
                    href={c.href}
                    {...(c.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex h-full gap-4 rounded-card border border-line bg-white/75 p-5 transition-colors hover:border-sun sm:flex-col lg:flex-row"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                      <Icon name={c.icon} className="size-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-muted">{c.title}</span>
                      <span className="mt-0.5 block font-semibold break-words text-ink">{c.value}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-panel">
                        {c.action} <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </Reveal>

            <Reveal className="on-dark rounded-card bg-wa p-6 text-white">
              <div className="flex items-start gap-4">
                <Icon name="whatsapp" className="size-10 shrink-0" />
                <div>
                  <h2 className="font-display text-lg font-bold">Prefer WhatsApp?</h2>
                  <p className="mt-1 text-white/85">Send a photo of your bill and roof — we&apos;ll reply with a rough estimate within hours.</p>
                  <a
                    href={whatsappHref("Hello AKD Solar! Here's a photo of my electricity bill and roof for a quick estimate.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 font-semibold text-wa"
                  >
                    Start chat <Icon name="arrowUpRight" className="size-4" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal className="rounded-card border border-line bg-white/75 p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Icon name="clock" className="size-5 text-sun-deep" /> Office hours
              </h2>
              <dl className="mt-4 divide-y divide-line">
                {site.hours.map((h) => (
                  <div key={h.days} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3">
                    <dt className="text-muted">{h.days}</dt>
                    <dd className="font-semibold text-ink">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Map placeholder */}
      <section aria-labelledby="map-title" className="pb-20 sm:pb-28">
        <Container>
          <Reveal variant="clip" className="relative overflow-hidden rounded-card border border-line bg-sand">
            <MapPlaceholder />
            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-4 rounded-card border border-line bg-white/95 p-5 backdrop-blur sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-sm sm:p-6">
              <div>
                <h2 id="map-title" className="font-display text-lg font-bold">
                  AKD Solar, {site.address.city}
                </h2>
                <p className="mt-1 text-[0.95rem] text-muted">{fullAddress}</p>
              </div>
              <Button href={site.mapsUrl} variant="dark" icon="arrowUpRight" className="w-full sm:w-auto">
                Open in Google Maps
              </Button>
            </div>
          </Reveal>
          <p className="mt-4 text-sm text-muted">
            We serve {locations.length} cities across Haryana and Delhi NCR —{" "}
            <Link href="/locations" className="font-semibold text-panel underline-offset-4 hover:underline">
              see all areas we serve
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}

function MapPlaceholder() {
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" className="h-[440px] w-full sm:h-[460px]" role="img" aria-label="Map showing the AKD Solar office location">
      <rect width="1200" height="520" fill="#F1EADC" />
      {/* blocks */}
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 14 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 90 + 12} y={r * 70 + 10} width="70" height="50" rx="6" fill={(r * 3 + c) % 7 === 0 ? "#DDEBC8" : "#E8DFCD"} />
        )),
      )}
      {/* roads */}
      <path d="M0 290 C300 260 500 330 760 280 S1100 240 1200 270" stroke="#fff" strokeWidth="26" fill="none" />
      <path d="M560 0 C540 160 620 300 590 520" stroke="#fff" strokeWidth="20" fill="none" />
      <path d="M0 120 L1200 160" stroke="#fff" strokeWidth="12" fill="none" />
      <path d="M900 0 L860 520" stroke="#fff" strokeWidth="12" fill="none" />
      {/* park + lake */}
      <ellipse cx="260" cy="420" rx="140" ry="70" fill="#C7E3A6" />
      <ellipse cx="1010" cy="420" rx="110" ry="60" fill="#BFE3F5" />
      {/* pin */}
      <g transform="translate(600 250)">
        <circle r="70" fill="#F7931E" opacity="0.15" />
        <circle r="38" fill="#F7931E" opacity="0.25" />
        <path d="M0 0 C-8 -18 -36 -34 -36 -60 a36 36 0 0 1 72 0 C36 -34 8 -18 0 0z" fill="#D7141A" />
        <circle cy="-60" r="13" fill="#fff" />
      </g>
    </svg>
  );
}
