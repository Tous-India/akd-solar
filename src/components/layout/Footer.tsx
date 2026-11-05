import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { services } from "@/lib/data";
import { getLocation, locations } from "@/lib/locations";

// Most-searched cities shown in the footer (all cities are on /locations)
const FOOTER_CITIES = ["sonipat", "delhi", "gurugram", "noida", "faridabad", "rohtak", "panipat", "karnal"];
import { fullAddress, mailHref, nav, site, telHref } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-navy text-cream">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="panel-grid-dark absolute inset-0" />
        <div className="sun-glow absolute -top-[420px] left-1/2 size-[760px] -translate-x-1/2 rounded-full opacity-40" />
      </div>

      <Container className="relative pt-20 pb-28 lg:pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.15fr_0.65fr_0.95fr_0.75fr_1.15fr] lg:gap-8 xl:gap-10">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex rounded-card bg-cream px-4 py-3" aria-label="AKD Solar — home">
              <Image src="/logo.png" alt="AKD Solar — Balancing The Nature" width={1580} height={642} sizes="160px" className="h-14 w-auto" />
            </Link>
            <p className="mt-6 leading-relaxed text-cream/75">
              Rooftop solar for homes, businesses and farms across Haryana and Delhi NCR — designed honestly, installed by our own crew and looked after for 25 years.
            </p>
            <ul className="mt-6 flex gap-2">
              {site.socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`AKD Solar on ${s.name}`}
                    className="flex size-11 items-center justify-center rounded-full border border-white/15 text-cream/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon name={s.icon as IconName} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2 lg:contents">
            <FooterColumn title="Company">
              {nav.filter((item) => item.href !== "/").map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Services">
              {services.map((s) => (
                <li key={s.slug}>
                  <FooterLink href={`/services/${s.slug}`}>{s.title}</FooterLink>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Areas We Serve">
              {FOOTER_CITIES.map((slug) => {
                const l = getLocation(slug);
                return l ? (
                  <li key={slug}>
                    <FooterLink href={`/solar-panel-installation/${slug}`}>{`Solar in ${l.name}`}</FooterLink>
                  </li>
                ) : null;
              })}
              <li>
                <Link href="/locations" className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-gold hover:text-white">
                  All {locations.length} areas <Icon name="arrowRight" className="size-4" />
                </Link>
              </li>
            </FooterColumn>
          </div>

          <div className="md:col-span-2 md:grid md:grid-cols-2 md:gap-8 lg:col-span-1 lg:block">
            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold">Get in touch</h2>
              <ul className="mt-5 space-y-4 text-cream/80">
                <li>
                  <a href={telHref} className="flex items-start gap-3 hover:text-white">
                    <Icon name="phone" className="mt-0.5 size-5 shrink-0 text-gold" /> {site.phone}
                  </a>
                </li>
                <li>
                  <a href={mailHref} className="flex items-start gap-3 break-all hover:text-white">
                    <Icon name="mail" className="mt-0.5 size-5 shrink-0 text-gold" /> {site.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="mapPin" className="mt-0.5 size-5 shrink-0 text-gold" />
                  <address className="not-italic">{fullAddress}</address>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="clock" className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>
                    {site.hours[0].days}
                    <br />
                    {site.hours[0].time}
                  </span>
                </li>
              </ul>
            </div>
            <div className="mt-8 md:mt-0 lg:mt-8">
              <h2 className="font-display text-base font-semibold">Solar tips, once a month</h2>
              <p className="mt-1 text-sm text-cream/65">Subsidy updates and maintenance tips. No spam.</p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/sitemap" className="inline-flex min-h-10 items-center hover:text-white">
              Sitemap
            </Link>
            <p className="flex items-center gap-2">
              <Icon name="leaf" className="size-4 text-leaf" /> {site.tagline}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold">{title}</h2>
      <ul className="mt-4 space-y-1">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-10 items-center text-cream/75 transition-colors hover:text-white">
      {children}
    </Link>
  );
}
