"use client";

import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { AnimatedNumber } from "@/components/motion/AnimatedNumber";
import { calculate, DEFAULT_STATE, LIMITS, STATES, unitsFromBill, type ConsumerType } from "@/lib/calc";
import { formatINR, formatLakh, formatNumber } from "@/lib/format";
import { whatsappHref } from "@/lib/site";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const kwText = (n: number) => formatNumber(n, n % 1 ? 1 : 0);

export function Calculator({ initialStateId = DEFAULT_STATE, initialUnits = 300 }: { initialStateId?: string; initialUnits?: number } = {}) {
  const id = useId();
  const [type, setType] = useState<ConsumerType>("residential");
  const [stateId, setStateId] = useState(initialStateId);
  const [billMode, setBillMode] = useState(false);
  const [units, setUnits] = useState(initialUnits);
  const [bill, setBill] = useState(2500);

  const limits = LIMITS[type];

  // ?units= or ?bill= in the URL pre-fills the calculator
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const u = Number(q.get("units"));
    const b = Number(q.get("bill"));
    if (u > 0) setUnits(clamp(u, LIMITS.residential.unitsMin, LIMITS.residential.unitsMax));
    else if (b > 0) {
      setBillMode(true);
      setBill(clamp(b, LIMITS.residential.billMin, LIMITS.residential.billMax));
    }
  }, []);

  const switchType = (next: ConsumerType) => {
    setType(next);
    const l = LIMITS[next];
    setUnits((u) => clamp(next === "commercial" ? Math.max(u, 2000) : Math.min(u, 600), l.unitsMin, l.unitsMax));
    setBill((b) => clamp(next === "commercial" ? Math.max(b, 20000) : Math.min(b, 5000), l.billMin, l.billMax));
  };

  const effectiveUnits = billMode ? unitsFromBill(bill, stateId, type) : units;
  const r = useMemo(() => calculate({ units: effectiveUnits, stateId, type }), [effectiveUnits, stateId, type]);
  const range = r.recommendedMin === r.recommendedMax ? `${kwText(r.recommendedMin)} kW` : `${kwText(r.recommendedMin)}–${kwText(r.recommendedMax)} kW`;
  const shareText = `Hello AKD Solar! I use about ${formatNumber(effectiveUnits)} units a month (${r.state.name}, ${type}). The calculator suggests ${range}. Please book a free site visit.`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
      <form className="rounded-card border border-line bg-white p-6 sm:p-8" onSubmit={(e) => e.preventDefault()} aria-labelledby={`${id}-inputs`}>
        <h2 id={`${id}-inputs`} className="font-display text-h3 font-bold">
          Your usage
        </h2>

        <fieldset className="mt-6">
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

        {billMode ? (
          <RangeField
            id={`${id}-bill`}
            label="Monthly bill"
            value={bill}
            min={limits.billMin}
            max={limits.billMax}
            step={limits.billStep}
            onChange={setBill}
            valueText={`${formatINR(bill)} per month`}
            minLabel={formatINR(limits.billMin)}
            maxLabel={formatLakh(limits.billMax)}
            prefix="₹"
            hint={`≈ ${formatNumber(effectiveUnits)} units a month`}
          />
        ) : (
          <RangeField
            id={`${id}-units`}
            label="Monthly units (kWh)"
            value={units}
            min={limits.unitsMin}
            max={limits.unitsMax}
            step={limits.unitsStep}
            onChange={setUnits}
            valueText={`${formatNumber(units)} units per month`}
            minLabel={formatNumber(limits.unitsMin)}
            maxLabel={formatNumber(limits.unitsMax)}
            suffix="units"
            hint="Shown as “Units consumed” on your electricity bill."
          />
        )}

        <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-[0.95rem] text-ink">
          <input type="checkbox" checked={billMode} onChange={(e) => setBillMode(e.target.checked)} className="size-5 accent-sun" />I only know my bill (₹)
        </label>

        <div className="mt-6">
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
        </div>
      </form>

      <section
        aria-labelledby={`${id}-results`}
        aria-live="polite"
        className="on-dark relative overflow-hidden rounded-card bg-navy p-6 text-cream sm:p-8 lg:sticky lg:top-32 lg:self-start"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="panel-grid-dark absolute inset-0" />
          <div className="sun-glow absolute -top-48 -right-48 size-[520px] rounded-full opacity-50" />
        </div>
        <div className="relative">
          <h2 id={`${id}-results`} className="text-sm font-bold tracking-[0.16em] text-gold uppercase">
            Recommended system
          </h2>
          <p className="mt-4 font-display text-[clamp(2.5rem,2rem+2.4vw,3.75rem)] leading-none font-extrabold tracking-[-0.04em]" data-kw>
            <AnimatedNumber value={r.recommendedMin} format={kwText} />
            {r.recommendedMax !== r.recommendedMin ? (
              <>
                –<AnimatedNumber value={r.recommendedMax} format={kwText} />
              </>
            ) : null}
            <span className="ml-2 text-[0.45em] text-gold">kW</span>
          </p>
          <p className="mt-2 text-sm text-cream/70">
            {formatNumber(effectiveUnits)} units ÷ 120 = {formatNumber(r.requiredKw, 1)} kW, plus 10–20% for future load
          </p>

          <dl className="mt-6 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            <Stat icon="home" label="Roof area needed">
              {formatNumber(r.roofMin)}–{formatNumber(r.roofMax)} sq ft
            </Stat>
            <Stat icon="rupee" label="Approx. cost">
              <AnimatedNumber value={r.cost} format={formatINR} />
            </Stat>
            <Stat icon="badge" label="PM Surya Ghar subsidy" accent="leaf" note={type === "commercial" ? "Homes only" : undefined}>
              <AnimatedNumber value={r.subsidy} format={formatINR} />
            </Stat>
            <Stat icon="sun" label="Yearly savings" accent="gold">
              <AnimatedNumber value={r.yearlySavings} format={formatINR} />
            </Stat>
            <Stat icon="clock" label="Payback">
              <AnimatedNumber value={r.paybackYears} format={(n) => `${formatNumber(n, 1)} years`} />
            </Stat>
            <Stat icon="leaf" label="25-year savings" accent="gold">
              <AnimatedNumber value={r.lifetimeSavings} format={formatLakh} />
            </Stat>
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" className="flex-1" magnetic>
              Book a free site visit
            </Button>
            <Button href={whatsappHref(shareText)} variant="outline-light" icon={null} iconLeft="whatsapp" className="flex-1">
              Send to WhatsApp
            </Button>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-cream/60">
            Indicative only. Sizing follows the DHBVN/UHBVN guide (1 kW ≈ 120 units a month; 80–100 sq ft per kW). Subsidy: ₹30,000/kW for the first 2 kW and
            ₹18,000 for the 3rd kW, capped at ₹78,000, homes only — subject to current rules. Your quote follows a free site visit.
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
  valueText: string;
  minLabel: string;
  maxLabel: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
};

function RangeField({ id, label, value, min, max, step, onChange, valueText, minLabel, maxLabel, prefix, suffix, hint }: RangeProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const fill = ((value - min) / (max - min)) * 100;

  const commit = () => {
    if (draft === null) return;
    const n = Number(draft.replace(/[^\d]/g, ""));
    if (n > 0) onChange(clamp(Math.round(n / step) * step, min, max));
    setDraft(null);
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <label htmlFor={id} className="font-semibold text-ink">
          {label}
        </label>
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
      {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

function Stat({ icon, label, children, accent, note }: { icon: IconName; label: string; children: ReactNode; accent?: "gold" | "leaf"; note?: string }) {
  return (
    <div className="rounded-card border border-white/10 bg-white/[0.04] p-4">
      <dt className="flex items-center gap-2 text-sm text-cream/70">
        <Icon name={icon} className="size-4 shrink-0 text-gold" />
        {label}
      </dt>
      <dd className={`mt-1.5 font-display text-xl font-bold tracking-tight ${accent === "gold" ? "text-gold" : accent === "leaf" ? "text-leaf" : "text-cream"}`}>{children}</dd>
      {note ? <dd className="mt-1 text-xs text-cream/60">{note}</dd> : null}
    </div>
  );
}
