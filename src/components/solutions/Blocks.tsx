import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { amc, msme, pumps, systemTypes } from "@/lib/data";
import { site, telHref } from "@/lib/site";

function Block({ title, children, id }: { title: string; children: ReactNode; id: string }) {
  return (
    <Reveal as="section" aria-labelledby={id} className="rounded-card border border-line bg-white p-5 sm:p-6">
      <h2 id={id} className="font-display text-h3 font-bold text-ink">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </Reveal>
  );
}

export function SystemTypes() {
  return (
    <Block title="System types" id="system-types">
      <ul className="grid gap-3 md:grid-cols-3">
        {systemTypes.map((t) => (
          <li key={t.name} className="rounded-card bg-cream p-4">
            <p className="font-display font-bold text-ink">{t.name}</p>
            <p className="mt-1 text-sm text-muted">{t.text}</p>
          </li>
        ))}
      </ul>
    </Block>
  );
}

export function LoanInfo({ kinds }: { kinds: ("residential" | "industrial")[] }) {
  return (
    <Block title="Solar loans" id="solar-loans">
      <ul className="space-y-2 text-ink/85">
        {kinds.includes("residential") ? (
          <li className="flex gap-2.5">
            <Icon name="rupee" className="mt-1 size-4 shrink-0 text-sun-deep" />
            <span>
              Residential at <strong>{site.loans.residential.rate}</strong> via {site.loans.residential.banks.join(", ")}
            </span>
          </li>
        ) : null}
        {kinds.includes("industrial") ? (
          <li className="flex gap-2.5">
            <Icon name="rupee" className="mt-1 size-4 shrink-0 text-sun-deep" />
            <span>
              Industrial at <strong>{site.loans.industrial.rate}</strong>
            </span>
          </li>
        ) : null}
      </ul>
    </Block>
  );
}

export function TextBlock({ title, text, id }: { title: string; text: string; id: string }) {
  return (
    <Block title={title} id={id}>
      <p className="text-muted">{text}</p>
    </Block>
  );
}

export const AmcBlock = () => <TextBlock id="amc" title={amc.title} text={amc.text} />;
export const PumpsBlock = () => <TextBlock id="pumps" title={pumps.title} text={pumps.text} />;

/** MSME support over a commercial-buildings photo that fades from cream (text side) to transparent */
export function MsmeBlock() {
  return (
    <Reveal as="section" aria-labelledby="msme" className="relative isolate overflow-hidden rounded-card border border-line bg-cream">
      <Image
        src="/images/solutions/commercial-buildings.jpg"
        alt=""
        fill
        sizes="(min-width: 1024px) 1280px, 100vw"
        className="-z-20 object-cover object-right"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-cream via-cream/95 to-cream/70 md:bg-gradient-to-r md:from-cream md:from-45% md:via-cream/85 md:via-60% md:to-cream/0" />
      <div className="p-5 sm:p-6 md:max-w-[60%] md:py-8">
        <h2 id="msme" className="font-display text-h3 font-bold text-ink">
          {msme.title}
        </h2>
        <ul className="mt-3 space-y-2 text-ink/85">
          {msme.points.map((p) => (
            <li key={p} className="flex gap-2.5">
              <Icon name="check" className="mt-1 size-4 shrink-0 text-solar-deep" /> {p}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">{msme.note}</p>
      </div>
    </Reveal>
  );
}

export function SocietySubsidy() {
  return (
    <Block title="Subsidy for societies" id="society-subsidy">
      <p className="text-ink/85">
        <strong>₹18,000 per kW</strong> for common facilities, up to 500 kW (3 kW per house), under PM Surya Ghar.
      </p>
      <p className="mt-2 text-sm text-muted">Subject to current scheme rules.</p>
    </Block>
  );
}

/** Compact call to action for inner pages */
export function InlineCta({ title = "Get a free site visit", text = "We check your roof and bills, then send a clear quote." }: { title?: string; text?: string }) {
  return (
    <section aria-labelledby="inline-cta" className="py-12 sm:py-16">
      <Reveal className="flex flex-col gap-5 rounded-card bg-navy p-6 text-cream sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="inline-cta" className="font-display text-h3 font-bold">
            {title}
          </h2>
          <p className="mt-1 text-cream/75">{text}</p>
        </div>
        <div className="on-dark flex flex-col gap-3 sm:flex-row">
          <Button href="/contact">Get Free Quote</Button>
          <Button href={telHref()} variant="outline-light" icon={null} iconLeft="phone">
            {site.phone}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
