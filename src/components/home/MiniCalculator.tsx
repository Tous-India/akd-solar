"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { SunriseBackdrop } from "@/components/ui/SunriseBackdrop";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { Reveal } from "@/components/motion/Reveal";
import { calculate, DEFAULT_STATE, LIMITS } from "@/lib/calc";
import { formatINR, formatLakh, formatNumber } from "@/lib/format";

const { billMin, billMax, billStep } = LIMITS.residential;

export function MiniCalculator() {
  const id = useId();
  const [bill, setBill] = useState(3000);
  const result = useMemo(() => calculate({ bill, stateId: DEFAULT_STATE, roofArea: 2000, type: "residential" }), [bill]);
  const fill = ((bill - billMin) / (billMax - billMin)) * 100;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-card border border-line bg-white">
          <SunriseBackdrop glowClass="-bottom-[60%] -left-[30%]" />
          <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
            <div>
              <Eyebrow>Savings in 10 seconds</Eyebrow>
              <h2 className="mt-4 text-h2 font-bold text-ink">How much could your roof save you?</h2>
              <p className="mt-4 text-lead text-muted">Slide to your average monthly electricity bill. We&apos;ll size a system and estimate the subsidy instantly.</p>

              <div className="mt-10">
                <div className="flex items-end justify-between gap-4">
                  <label htmlFor={`${id}-bill`} className="font-semibold text-ink">
                    Monthly electricity bill
                  </label>
                  <output htmlFor={`${id}-bill`} className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    {formatINR(bill)}
                  </output>
                </div>
                <input
                  id={`${id}-bill`}
                  type="range"
                  className="range mt-3"
                  min={billMin}
                  max={billMax}
                  step={billStep}
                  value={bill}
                  aria-valuetext={`${formatINR(bill)} per month`}
                  onChange={(e) => setBill(Number(e.target.value))}
                  style={{ "--fill": `${fill}%` } as CSSProperties}
                />
                <div className="mt-1 flex justify-between text-sm text-muted">
                  <span>{formatINR(billMin)}</span>
                  <span>{formatINR(billMax)}+</span>
                </div>
              </div>
            </div>

            <div className="on-dark flex flex-col rounded-card bg-navy p-6 text-cream sm:p-8">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
                <div className="col-span-2">
                  <dt className="text-sm text-cream/65">Recommended system</dt>
                  <dd className="mt-1 font-display text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none font-extrabold tracking-[-0.04em] text-gold">
                    <AnimatedNumber value={result.kw} format={(n) => `${formatNumber(n, 1)} kW`} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-cream/65">Monthly savings</dt>
                  <dd className="mt-1 font-display text-xl font-bold sm:text-2xl">
                    <AnimatedNumber value={result.monthlySavings} format={formatINR} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-cream/65">Govt. subsidy</dt>
                  <dd className="mt-1 font-display text-xl font-bold text-leaf sm:text-2xl">
                    <AnimatedNumber value={result.subsidy} format={formatINR} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-cream/65">Payback</dt>
                  <dd className="mt-1 font-display text-xl font-bold sm:text-2xl">
                    <AnimatedNumber value={result.paybackYears} format={(n) => `${formatNumber(n, 1)} yrs`} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-cream/65">25-year savings</dt>
                  <dd className="mt-1 font-display text-xl font-bold sm:text-2xl">
                    <AnimatedNumber value={result.lifetimeSavings} format={formatLakh} />
                  </dd>
                </div>
              </dl>
              <div className="mt-8 border-t border-white/10 pt-6">
                <Button href={`/calculator?bill=${bill}`} variant="primary" className="w-full">
                  See full breakdown
                </Button>
                <p className="mt-3 text-center text-xs text-cream/55">Indicative estimate for Haryana tariffs. Final figures after site survey.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
