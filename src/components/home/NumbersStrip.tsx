import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

const items = [
  { value: site.numbers.years, label: "Years in solar" },
  { value: site.numbers.installations, label: "On-grid installations" },
  { value: site.numbers.customers, label: "Solar customers" },
  { value: `Since ${site.havellsDealerSince}`, label: "Havells authorised dealer" },
];

export function NumbersStrip() {
  return (
    <section aria-label="AKD Solar in numbers" className="pb-16 sm:pb-20">
      <Container>
        <div className="on-dark relative overflow-hidden rounded-card bg-navy text-cream">
          <div aria-hidden className="panel-grid-dark pointer-events-none absolute inset-0" />
          <dl className="relative grid grid-cols-2 lg:grid-cols-4">
            {items.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 p-5 sm:p-7 ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${
                  i === 2 ? "lg:border-l" : ""
                }`}
              >
                <dt className="order-2 text-sm text-cream/75 sm:text-base">{s.label}</dt>
                <dd className="order-1 font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-none font-extrabold tracking-[-0.03em] text-gold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
