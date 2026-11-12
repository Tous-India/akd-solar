"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatINR, formatNumber } from "@/lib/format";

/**
 * Lightweight inline charts (no library). Brand colours, direct value labels, role="img" + aria-label with the
 * numbers, a one-time grow-in when scrolled into view (instant with reduced motion), responsive by construction.
 */

const SUN = "#F7931E";
const GREEN = "#2E8B1E";
const TRACK = "#E7DFD0";

/** true once the element has scrolled into view (immediately true with reduced motion or no IntersectionObserver) */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function ChartCard({ title, children, source, className = "" }: { title: string; children: ReactNode; source?: ReactNode; className?: string }) {
  return (
    <figure className={`flex flex-col rounded-card border border-line bg-white p-5 sm:p-6 ${className}`}>
      <figcaption className="font-display text-lg font-bold text-ink">{title}</figcaption>
      <div className="mt-4 flex-1">{children}</div>
      {source ? <p className="mt-4 text-xs text-muted">{source}</p> : null}
    </figure>
  );
}

// ───────────────────────── Donut ─────────────────────────

type DonutProps = {
  title: string;
  value: number;
  total: number;
  valueLabel: string;
  restLabel: string;
  source?: ReactNode;
};

/** Single-series progress donut: the part in brand orange over a neutral track, % in the centre */
export function Donut({ title, value, total, valueLabel, restLabel, source }: DonutProps) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const pct = (value / total) * 100;
  const r = 52;
  const c = 2 * Math.PI * r;
  const rest = total - value;
  const label = `${title}: ${formatNumber(value)} ${valueLabel.toLowerCase()} (${pct.toFixed(1)}%), ${formatNumber(rest)} ${restLabel.toLowerCase()}, out of ${formatNumber(total)}.`;

  return (
    <ChartCard title={title} source={source}>
      <div ref={ref} role="img" aria-label={label} className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
        <svg viewBox="0 0 140 140" className="size-40 shrink-0 sm:size-44" aria-hidden>
          <circle cx="70" cy="70" r={r} fill="none" stroke={TRACK} strokeWidth="18" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={SUN}
            strokeWidth="18"
            strokeLinecap="butt"
            transform="rotate(-90 70 70)"
            strokeDasharray={`${c} ${c}`}
            strokeDashoffset={seen ? c * (1 - pct / 100) : c}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            <title>{`${valueLabel}: ${formatNumber(value)} (${pct.toFixed(1)}%)`}</title>
          </circle>
          <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fill="#101828" fontSize="21" fontWeight="800" fontFamily="var(--font-display)">
            {pct.toFixed(1)}%
          </text>
        </svg>
        <dl className="grid w-full gap-3 text-sm">
          <div className="flex items-start gap-2.5">
            <span aria-hidden className="mt-1 size-3 shrink-0 rounded-sm" style={{ background: SUN }} />
            <div>
              <dt className="text-muted">{valueLabel}</dt>
              <dd className="font-display text-lg font-bold text-ink tabular-nums">{formatNumber(value)}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span aria-hidden className="mt-1 size-3 shrink-0 rounded-sm" style={{ background: TRACK }} />
            <div>
              <dt className="text-muted">{restLabel}</dt>
              <dd className="font-display text-lg font-bold text-ink tabular-nums">{formatNumber(rest)}</dd>
            </div>
          </div>
        </dl>
      </div>
    </ChartCard>
  );
}

// ───────────────────────── Horizontal bars ─────────────────────────

type BarDatum = { label: string; value: number; note?: string };

/** Single-series horizontal bars with the value at the end of each bar (readable on a 360px screen) */
export function BarChart({ title, data, unit, source }: { title: string; data: BarDatum[]; unit: string; source?: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));
  const label = `${title}: ${data.map((d) => `${d.label} ${formatNumber(d.value)}${d.note ? ` (${d.note})` : ""}`).join(", ")} ${unit}.`;

  return (
    <ChartCard title={title} source={source}>
      <div ref={ref} role="img" aria-label={label} className="grid gap-2.5" onMouseLeave={() => setHover(null)}>
        {data.map((d, i) => (
          <div key={d.label} className="grid grid-cols-[3rem_1fr] items-center gap-3" onMouseEnter={() => setHover(i)}>
            <span className="text-sm font-semibold text-ink tabular-nums">{d.label}</span>
            <div className="flex min-w-0 items-center gap-2">
              <div
                className="h-7 rounded-r-[4px] transition-[width,opacity] duration-1000 ease-out"
                style={{
                  width: seen ? `${Math.max((d.value / max) * 72, 1.5)}%` : "0%",
                  background: SUN,
                  transitionDelay: seen ? `${i * 90}ms` : "0ms",
                  opacity: hover === null || hover === i ? 1 : 0.45,
                }}
                title={`${d.label}: ${formatNumber(d.value)} ${unit}${d.note ? ` (${d.note})` : ""}`}
              />
              <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">
                {formatNumber(d.value)}
                {d.note ? <span className="ml-1 font-normal text-muted">*</span> : null}
              </span>
            </div>
          </div>
        ))}
      </div>
      <DataTable head={["Year", unit]} rows={data.map((d) => [d.label, formatNumber(d.value) + (d.note ? ` (${d.note})` : "")])} />
    </ChartCard>
  );
}

// ───────────────────────── Stacked bars ─────────────────────────

type StackRow = { group: string; label: string; a: number; b: number };

/** Two-series stacked horizontal bars (central subsidy + state top-up), total labelled at the end */
export function StackedBars({
  title,
  rows,
  aName,
  bName,
  source,
}: {
  title: string;
  rows: StackRow[];
  aName: string;
  bName: string;
  source?: ReactNode;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const max = Math.max(...rows.map((r) => r.a + r.b));
  const groups = [...new Set(rows.map((r) => r.group))];
  const label = `${title}: ${rows.map((r) => `${r.group}, ${r.label}: ${aName} ${formatINR(r.a)} plus ${bName} ${formatINR(r.b)} equals ${formatINR(r.a + r.b)}`).join("; ")}.`;

  return (
    <ChartCard title={title} source={source}>
      <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink" aria-hidden>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-sm" style={{ background: SUN }} /> {aName}
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-sm" style={{ background: GREEN }} /> {bName}
        </li>
      </ul>
      <div ref={ref} role="img" aria-label={label} className="grid gap-5">
        {groups.map((g, gi) => (
          <div key={g}>
            <p className="font-display text-sm font-bold text-ink">{g}</p>
            <div className="mt-1.5 grid gap-1.5">
              {rows
                .filter((r) => r.group === g)
                .map((r) => {
                  const total = r.a + r.b;
                  return (
                    <div key={r.label} className="grid gap-1 sm:grid-cols-[9.5rem_1fr] sm:items-center sm:gap-3">
                      <span className="text-xs text-muted">{r.label}</span>
                      <div className="flex min-w-0 items-center gap-2">
                        <div
                          className="flex h-7 overflow-hidden transition-[width] duration-1000 ease-out"
                          style={{ width: seen ? `${(total / max) * 74}%` : "0%", transitionDelay: seen ? `${gi * 120}ms` : "0ms" }}
                        >
                          <div className="h-full" style={{ width: `${(r.a / total) * 100}%`, background: SUN }} title={`${aName}: ${formatINR(r.a)}`} />
                          <div
                            className="h-full rounded-r-[4px] border-l-2 border-white"
                            style={{ width: `${(r.b / total) * 100}%`, background: GREEN }}
                            title={`${bName}: ${formatINR(r.b)}`}
                          />
                        </div>
                        <span className="shrink-0 text-sm font-bold text-ink tabular-nums">{formatINR(total)}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <DataTable
        head={["System", "Income", aName, bName, "Total"]}
        rows={rows.map((r) => [r.group, r.label, formatINR(r.a), formatINR(r.b), formatINR(r.a + r.b)])}
      />
    </ChartCard>
  );
}

function DataTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <details className="mt-4 text-sm">
      <summary className="inline-flex min-h-9 cursor-pointer items-center font-semibold text-panel">View as table</summary>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[320px] text-left">
          <thead>
            <tr className="border-b border-line text-muted">
              {head.map((h) => (
                <th key={h} scope="col" className="py-1.5 pr-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.join("|")} className="border-b border-line last:border-0">
                {r.map((c, i) => (
                  <td key={i} className="py-1.5 pr-3 text-ink tabular-nums">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
