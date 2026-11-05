"use client";

import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { calculate, DEFAULT_STATE, LIMITS, STATES, type ConsumerType } from "@/lib/calc";
import { formatINR, formatLakh, formatNumber } from "@/lib/format";
import { whatsappHref } from "@/lib/site";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

type CalculatorProps = { initialStateId?: string; initialBill?: number; cityName?: string };

export function Calculator({ initialStateId = DEFAULT_STATE, initialBill = 3000, cityName }: CalculatorProps = {}) {
  const id = useId();
  const [type, setType] = useState<ConsumerType>("residential");
  const [bill, setBill] = useState(initialBill);
  const [stateId, setStateId] = useState(initialStateId);
  const [roofArea, setRoofArea] = useState(600);

  const limits = LIMITS[type];

  // Pre-fill the bill from ?bill= (used by the home page mini calculator)
  useEffect(() => {
    const fromUrl = Number(new URLSearchParams(window.location.search).get("bill"));
    if (fromUrl > 0) setBill(clamp(fromUrl, LIMITS.residential.billMin, LIMITS.residential.billMax));
  }, []);

  const switchType = (next: ConsumerType) => {
    setType(next);
    const l = LIMITS[next];
    setBill((b) => clamp(next === "commercial" ? Math.max(b, 25000) : Math.min(b, 3000), l.billMin, l.billMax));
    setRoofArea((r) => clamp(next === "commercial" ? Math.max(r, 5000) : Math.min(r, 600), l.roofMin, l.roofMax));
  };

  const r = useMemo(() => calculate({ bill, stateId, roofArea, type }), [bill, stateId, roofArea, type]);

  const shareText = `Hello AKD Solar! I used your calculator: ${cityName ? `${cityName}, ` : ""}${r.state.name}, ${type}, monthly bill ${formatINR(bill)}, roof ${formatNumber(roofArea)} sq ft. Suggested system: ${formatNumber(r.kw, 1)} kW. Please book a free site survey.`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
      {/* Inputs */}
      <form
        className="rounded-card border border-line bg-white p-6 sm:p-8 lg:p-10"
        onSubmit={(e) => e.preventDefault()}
        aria-labelledby={`${id}-inputs`}
      >
        <h2 id={`${id}-inputs`} className="font-display text-h3 font-bold">
          Tell us about your property
        </h2>

        <fieldset className="mt-8">
          <legend className="font-semibold text-ink">Property type</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-full bg-sand p-1.5">
            {(["residential", "commercial"] as const).map((t) => (
              <label
                key={t}
                className={`relative flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-[0.95rem] font-semibold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-panel ${
                  type === t ? "bg-white text-ink shadow-sm" : "text-ink/65 hover:text-ink"
                }`}
              >
                <input type="radio" name={`${id}-type`} value={t} checked={type === t} onChange={() => switchType(t)} className="sr-only" />
                <Icon name={t === "residential" ? "home" : "factory"} className="size-[18px]" />
                {t === "residential" ? "Residential" : "Commercial"}
              </label>
            ))}
          </div>
        </fieldset>

        <RangeField
          id={`${id}-bill`}
          label="Average monthly bill"
          value={bill}
          min={limits.billMin}
          max={limits.billMax}
          step={limits.billStep}
          onChange={setBill}
          display={formatINR(bill)}
          valueText={`${formatINR(bill)} per month`}
          minLabel={formatINR(limits.billMin)}
          maxLabel={formatLakh(limits.billMax)}
          prefix="₹"
        />

        <div className="mt-8">
          <label htmlFor={`${id}-state`} className="font-semibold text-ink">
            State
          </label>
          <div className="relative mt-3">
            <select
              id={`${id}-state`}
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="min-h-13 w-full appearance-none rounded-xl border border-line bg-cream px-4 pr-12 text-base text-ink focus:border-panel focus:outline-none"
            >
              {STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted" />
          </div>
          <p className="mt-2 text-sm text-muted">
            Avg. tariff ~₹{formatNumber(r.tariff, 1)}/unit · ~{formatNumber(r.state.yield, 1)} units per kW per day
          </p>
        </div>

        <RangeField
          id={`${id}-roof`}
          label="Shadow-free roof area"
          value={roofArea}
          min={limits.roofMin}
          max={limits.roofMax}
          step={limits.roofStep}
          onChange={setRoofArea}
          display={`${formatNumber(roofArea)} sq ft`}
          valueText={`${formatNumber(roofArea)} square feet`}
          minLabel={`${formatNumber(limits.roofMin)} sq ft`}
          maxLabel={`${formatNumber(limits.roofMax)} sq ft`}
          suffix="sq ft"
        />
      </form>

      {/* Results */}
      <section
        aria-labelledby={`${id}-results`}
        aria-live="polite"
        className="on-dark relative overflow-hidden rounded-card bg-navy p-6 text-cream sm:p-8 lg:sticky lg:top-28 lg:self-start lg:p-10"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="panel-grid-dark absolute inset-0" />
          <div className="sun-glow absolute -top-48 -right-48 size-[520px] rounded-full opacity-60" />
        </div>
        <div className="relative">
          <h2 id={`${id}-results`} className="text-sm font-bold tracking-[0.16em] text-gold uppercase">
            Your solar estimate
          </h2>
          <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
            <p className="font-display text-[clamp(3rem,2.2rem+3.4vw,4.75rem)] leading-none font-extrabold tracking-[-0.045em]">
              <AnimatedNumber value={r.kw} format={(n) => formatNumber(n, 1)} />
              <span className="ml-2 text-[0.45em] text-gold">kW</span>
            </p>
            <p className="pb-2 text-cream/70">recommended system</p>
          </div>
          {r.roofLimited ? (
            <p className="mt-4 flex gap-2 rounded-card bg-white/5 p-3 text-sm text-gold">
              <Icon name="sparkle" className="mt-0.5 size-4 shrink-0" />
              Your roof limits the system size. Ideal size for your bill needs ~{formatNumber(Math.ceil((r.monthlyUnits / (r.state.yield * 30)) * 100))} sq ft.
            </p>
          ) : null}

          <dl className="mt-8 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            <Stat icon="rupee" label="Approx. system cost">
              <AnimatedNumber value={r.cost} format={formatINR} />
            </Stat>
            <Stat icon="badge" label="PM Surya Ghar subsidy" accent="leaf" note={type === "commercial" ? "Not applicable for commercial" : undefined}>
              <AnimatedNumber value={r.subsidy} format={formatINR} />
            </Stat>
            <Stat icon="sun" label="Yearly savings" accent="gold">
              <AnimatedNumber value={r.yearlySavings} format={formatINR} />
            </Stat>
            <Stat icon="clock" label="Payback period">
              <AnimatedNumber value={r.paybackYears} format={(n) => `${formatNumber(n, 1)} years`} />
            </Stat>
            <Stat icon="sparkle" label="25-year net savings" accent="gold">
              <AnimatedNumber value={r.lifetimeSavings} format={formatLakh} />
            </Stat>
            <Stat icon="leaf" label="CO₂ offset (25 yrs)" accent="leaf" note={`≈ ${formatNumber(r.treesEquivalent)} trees planted`}>
              <AnimatedNumber value={r.co2Lifetime} format={(n) => `${formatNumber(n, 0)} t`} />
            </Stat>
          </dl>

          <div className="mt-6 rounded-card border border-white/10 p-4 text-sm text-cream/75">
            <p className="flex justify-between gap-4">
              <span>Net cost after subsidy</span>
              <span className="font-display font-bold text-cream">
                <AnimatedNumber value={r.netCost} format={formatINR} />
              </span>
            </p>
            <p className="mt-2 flex justify-between gap-4">
              <span>Generation per year</span>
              <span className="font-semibold text-cream">{formatNumber(r.yearlyUnits)} units</span>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" className="flex-1" magnetic>
              Book free site survey
            </Button>
            <Button href={whatsappHref(shareText)} variant="outline-light" icon={null} iconLeft="whatsapp" className="flex-1">
              Send to WhatsApp
            </Button>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-cream/55">
            Figures are indicative and based on average state tariffs, typical solar yield and current PM Surya Ghar rules (₹30,000/kW for the
            first 2 kW and ₹18,000 for the 3rd kW, capped at ₹78,000; residential only). Subsidy and tariffs are subject to current government and
            DISCOM rules. Your exact quote follows a free site survey.
          </p>
        </div>
      </section>
    </div>
  );
}

type RangeProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
  valueText: string;
  minLabel: string;
  maxLabel: string;
  prefix?: string;
  suffix?: string;
};

function RangeField({ id, label, value, min, max, step, onChange, display, valueText, minLabel, maxLabel, prefix, suffix }: RangeProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const fill = ((value - min) / (max - min)) * 100;

  const commit = () => {
    if (draft === null) return;
    const n = Number(draft.replace(/[^\d]/g, ""));
    if (n > 0) onChange(clamp(Math.round(n / step) * step, min, max));
    setDraft(null);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <label htmlFor={id} className="font-semibold text-ink">
          {label}
        </label>
        <span className="sr-only" aria-live="polite">
          {display}
        </span>
        <div className="flex min-h-11 items-center gap-1 rounded-xl border border-line bg-cream px-3 focus-within:border-panel">
          {prefix ? <span className="text-muted">{prefix}</span> : null}
          <input
            type="text"
            inputMode="numeric"
            aria-label={`${label} (exact value)`}
            value={draft ?? formatNumber(value)}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="w-24 bg-transparent text-right font-display text-base font-bold text-ink focus:outline-none"
          />
          {suffix ? <span className="text-sm text-muted">{suffix}</span> : null}
        </div>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-3"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
      <div className="mt-1 flex justify-between text-sm text-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

function Stat({ icon, label, children, accent, note }: { icon: IconName; label: string; children: ReactNode; accent?: "gold" | "leaf"; note?: string }) {
  return (
    <div className="rounded-card border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <dt className="flex items-center gap-2 text-sm text-cream/70">
        <Icon name={icon} className="size-4 shrink-0 text-gold" />
        {label}
      </dt>
      <dd className={`mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl ${accent === "gold" ? "text-gold" : accent === "leaf" ? "text-leaf" : "text-cream"}`}>
        {children}
      </dd>
      {note ? <dd className="mt-1 text-xs text-cream/55">{note}</dd> : null}
    </div>
  );
}
