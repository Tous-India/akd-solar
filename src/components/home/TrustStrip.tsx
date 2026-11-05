import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { trustPoints } from "@/lib/data";

export function TrustStrip() {
  return (
    <section aria-label="Why homeowners trust us" className="py-16 sm:py-20">
      <Container>
        <Reveal as="ul" stagger={0.08} className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((t) => (
            <li key={t.title} className="flex gap-4 bg-cream p-6 sm:p-7">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-panel ring-1 ring-line">
                <Icon name={t.icon} className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">{t.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{t.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
