import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SunriseBackdrop } from "@/components/ui/SunriseBackdrop";
import { Reveal } from "@/components/motion/Reveal";
import { BgFade } from "@/components/motion/BgFade";
import { subsidyTiers } from "@/lib/data";
import { formatINR } from "@/lib/format";

const eligibility = [
  "You own the house and the roof",
  "Electricity connection is in your name",
  "No earlier rooftop solar subsidy claimed",
];

export function SubsidySection() {
  return (
    <section id="subsidy" className="on-dark relative overflow-hidden bg-navy py-20 text-cream sm:py-28 desk:bg-cream">
      <BgFade />
      <SunriseBackdrop tone="dark" glowClass="-top-[40%] left-1/2 -translate-x-1/2" />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            tone="dark"
            eyebrow="PM Surya Ghar Muft Bijli Yojana"
            title={
              <>
                The government pays up to <span className="text-gold">₹78,000</span> of your solar system.
              </>
            }
            subtitle="Central subsidy is credited straight to your bank account after commissioning. We register you on the national portal and chase every step — you never stand in a queue."
          />
          <Reveal className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button href="/calculator" variant="primary" size="lg" magnetic>
              Check my subsidy
            </Button>
            <Button href="/contact" variant="outline-light" size="lg" icon="arrowUpRight">
              Apply with AKD Solar
            </Button>
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.12} className="mt-14 grid gap-5 md:grid-cols-3">
          {subsidyTiers.map((t) => (
            <li
              key={t.kw}
              data-tilt
              className={`relative flex flex-col rounded-card border p-7 sm:p-8 ${
                t.popular ? "border-gold/70 bg-gradient-to-b from-gold/[0.12] to-white/[0.03]" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              {t.popular ? (
                <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wide text-ink uppercase">
                  Most homes
                </span>
              ) : null}
              <p className="font-display text-lg font-semibold text-cream/80">{t.kw} system</p>
              <p className="mt-3 font-display text-[clamp(2.25rem,1.8rem+1.6vw,3rem)] leading-none font-extrabold tracking-[-0.04em] text-cream">
                {formatINR(t.amount)}
              </p>
              <p className="mt-2 text-sm text-cream/60">central subsidy</p>
              <div className="my-6 h-px bg-white/10" />
              <ul className="space-y-2.5 text-[0.95rem] text-cream/80">
                <li className="flex gap-2.5">
                  <Icon name="bolt" className="mt-0.5 size-[18px] shrink-0 text-gold" /> {t.usage}
                </li>
                <li className="flex gap-2.5">
                  <Icon name="rupee" className="mt-0.5 size-[18px] shrink-0 text-gold" /> {t.bill}
                </li>
              </ul>
            </li>
          ))}
        </Reveal>

        <Reveal className="mt-10 flex flex-col gap-4 rounded-card border border-white/10 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-display text-lg font-semibold">Are you eligible?</p>
          <ul className="flex flex-col gap-3 text-cream/80 md:flex-row md:gap-8">
            {eligibility.map((e) => (
              <li key={e} className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-leaf/20 text-leaf">
                  <Icon name="check" className="size-4" />
                </span>
                {e}
              </li>
            ))}
          </ul>
        </Reveal>
        <p className="mt-5 text-sm text-cream/55">
          Subsidy amounts follow current MNRE guidelines and may change. Some states offer an additional state subsidy on top.
        </p>
      </Container>
    </section>
  );
}
