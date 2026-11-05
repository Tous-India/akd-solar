import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { stats } from "@/lib/data";

export function StatsBand() {
  return (
    <section aria-label="AKD Solar in numbers" className="relative">
      <Container>
        <Reveal className="on-dark relative overflow-hidden rounded-card bg-navy text-cream">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="panel-grid-dark absolute inset-0" />
            <div className="sun-glow absolute -top-64 -right-40 size-[520px] rounded-full opacity-50" />
          </div>
          <dl className="relative grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 p-6 sm:p-8 lg:p-10 ${i % 2 === 1 ? "border-l border-white/10" : ""} ${
                  i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""
                } ${i === 2 ? "lg:border-l" : ""}`}
              >
                <dt className="order-2 font-medium text-cream sm:text-lg">{s.label}</dt>
                <dd className="order-1 font-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] leading-none font-extrabold tracking-[-0.04em] text-gold">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dd className="order-3 text-sm text-cream/60">{s.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
