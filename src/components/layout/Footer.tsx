import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { formatOffice, mailHref, site, telHref } from "@/lib/site";
import { menuLinks } from "./menuLinks";
import { NewsletterForm } from "./NewsletterForm";

const company = [
  { label: "About", href: "/about" },
  { label: "PM Surya Ghar Yojana", href: "/pm-surya-ghar-yojana" },
  { label: "Projects", href: "/projects" },
  { label: "Calculator", href: "/calculator" },
  { label: "Blog", href: "/blog" },
  { label: "How solar works", href: "/blog/how-on-grid-rooftop-solar-works" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-navy text-cream">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="panel-grid-dark absolute inset-0" />
      </div>

      <Container className="relative pt-16 pb-28 xl:pb-10">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.7fr_0.8fr_0.7fr_1.3fr] xl:gap-8">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex rounded-card bg-cream px-4 py-3" aria-label="AKD Solar — home">
              <Image src="/logo.png" alt="AKD Solar — Balancing The Nature" width={1580} height={642} sizes="160px" className="h-12 w-auto" />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-cream/75">
              Rooftop solar in Sonipat and Delhi NCR since {site.foundedYear}. Authorised Havells dealer since {site.havellsDealerSince}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2 xl:contents">
            <FooterColumn title="Company">
              {company.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Solar Solutions">
              {menuLinks.solutions.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Areas We Serve">
              {menuLinks.locations.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </FooterColumn>
          </div>

          <div className="md:col-span-2 xl:col-span-1">
            <h2 className="font-display text-sm font-semibold tracking-[0.14em] text-gold uppercase">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-cream/80">
              {site.phones.map((p) => (
                <li key={p}>
                  <a href={telHref(p)} className="inline-flex min-h-8 items-center gap-3 hover:text-white">
                    <Icon name="phone" className="size-4 shrink-0 text-gold" /> {p}
                  </a>
                </li>
              ))}
              <li>
                <a href={mailHref} className="inline-flex min-h-8 items-center gap-3 break-all hover:text-white">
                  <Icon name="mail" className="size-4 shrink-0 text-gold" /> {site.email}
                </a>
              </li>
              {site.offices.map((o) => (
                <li key={o.label} className="flex items-start gap-3">
                  <Icon name="mapPin" className="mt-0.5 size-4 shrink-0 text-gold" />
                  <address className="not-italic">
                    <span className="block font-semibold text-cream">{o.label}</span>
                    {formatOffice(o)}
                  </address>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h2 className="font-display text-sm font-semibold">Solar tips, once a month</h2>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-cream/60 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {site.legalName} · CIN {site.cin} · GSTIN {site.gstin}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/sitemap" className="inline-flex min-h-8 items-center hover:text-white">
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
      <h2 className="font-display text-sm font-semibold tracking-[0.14em] text-gold uppercase">{title}</h2>
      <ul className="mt-3 space-y-0.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-10 items-center text-sm text-cream/75 transition-colors hover:text-white">
      {children}
    </Link>
  );
}
