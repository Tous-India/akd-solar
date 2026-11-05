import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { comparison } from "@/lib/data";

const valueTone = (v: string) => {
  if (v === "Yes" || v === "Eligible" || v === "Eligible*") return "yes";
  if (v === "No" || v === "Not eligible") return "no";
  return "text";
};

function ValueCell({ value }: { value: string }) {
  const tone = valueTone(value);
  if (tone === "yes")
    return (
      <span className="inline-flex items-center gap-2 font-medium text-solar-deep">
        <span className="flex size-6 items-center justify-center rounded-full bg-solar/15">
          <Icon name="check" className="size-4" />
        </span>
        {value}
      </span>
    );
  if (tone === "no")
    return (
      <span className="inline-flex items-center gap-2 font-medium text-muted">
        <span className="flex size-6 items-center justify-center rounded-full bg-ink/5">
          <Icon name="close" className="size-3.5" />
        </span>
        {value}
      </span>
    );
  return <span className="font-medium text-ink">{value}</span>;
}

/** On-grid vs off-grid vs hybrid: a real table on tablet/desktop, stacked cards on phones. */
export function ComparisonTable() {
  return (
    <>
      <Reveal className="mt-12 hidden overflow-x-auto rounded-card border border-line bg-white md:block">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <caption className="sr-only">Comparison of on-grid, off-grid and hybrid solar systems</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="w-[28%] p-5 text-sm font-semibold text-muted lg:p-6">
                Feature
              </th>
              {comparison.columns.map((c, i) => (
                <th key={c} scope="col" className={`p-5 font-display text-lg font-bold lg:p-6 ${i === 2 ? "bg-gold/10" : ""}`}>
                  {c}
                  {i === 2 ? <span className="ml-2 rounded-full bg-sun px-2 py-0.5 align-middle text-[0.7rem] font-bold tracking-wide uppercase">Popular</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-0">
                <th scope="row" className="p-5 font-medium text-ink lg:p-6">
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className={`p-5 lg:p-6 ${i === 2 ? "bg-gold/10" : ""}`}>
                    <ValueCell value={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal as="div" stagger={0.1} className="mt-10 grid gap-4 md:hidden">
        {comparison.columns.map((col, ci) => (
          <article key={col} className={`rounded-card border bg-white p-5 ${ci === 2 ? "border-sun" : "border-line"}`}>
            <h3 className="flex items-center justify-between font-display text-xl font-bold">
              {col}
              {ci === 2 ? <span className="rounded-full bg-sun px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">Popular</span> : null}
            </h3>
            <dl className="mt-4 divide-y divide-line">
              {comparison.rows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 py-3 text-[0.95rem]">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="text-right">
                    <ValueCell value={row.values[ci]} />
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </Reveal>
      <p className="mt-5 text-sm text-muted">{comparison.note} Costs are indicative before subsidy and vary by brand and site.</p>
    </>
  );
}
