import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { StandsFor } from "@/components/about/StandsFor";
import { aboutFeatures } from "@/lib/data";
import { site } from "@/lib/site";

const counters = [
  { value: 9, plus: true, label: "Years of experience" },
  { value: 493, plus: true, label: "On-grid installations" },
  { value: 1100, plus: true, label: "Solar customers" },
  { value: Number(site.numbers.subsidyCustomers), plus: false, label: "Customers got PM Surya Ghar subsidy" },
];

/**
 * Home "Welcome" block. Desktop: counters | stands-for + text | feature icons.
 * Tablet: counters 2×2 above, text, icons in a row below. Phone: everything stacks.
 */
export function AboutIntro() {
  return (
    <section aria-labelledby="welcome-title" className="pt-12 pb-16 sm:pt-16 sm:pb-20">
      <Container className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)_220px] lg:gap-10 xl:grid-cols-[250px_minmax(0,1fr)_240px] xl:gap-14">
        <Reveal as="ul" stagger={0.08} className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:self-center">
          {counters.map((c) => (
            <li key={c.label} className="rounded-card border border-line bg-white px-5 py-4">
              <p className="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-none font-extrabold tracking-[-0.03em] text-ink tabular-nums">
                <Counter value={c.value} />
                {c.plus ? <span className="ml-0.5 align-top text-[0.6em] text-[#2E8B1E]">+</span> : null}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-muted">{c.label}</p>
            </li>
          ))}
        </Reveal>

        <div className="min-w-0">
          <StandsFor />
          <h2 id="welcome-title" className="mt-8 text-h2 font-bold text-ink">
            Welcome to AKD Solar
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            {site.legalName} is a solar EPC and O&amp;M company in Sonipat, founded in {site.foundedYear} by Er. (Dr.) Ankush Dahiya — Chartered
            Engineer, M.Tech Power Systems. Authorised Havells dealer since {site.havellsDealerSince}. We design, install and maintain on-grid,
            hybrid and off-grid systems for homes, societies, shops and industries.
          </p>
          <Link href="/about" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-panel hover:text-ink">
            More about us <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>

        <Reveal as="ul" stagger={0.1} className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:self-center">
          {aboutFeatures.map((f) => (
            <li key={f.title} className="flex gap-4 sm:flex-col sm:gap-3 lg:flex-row lg:gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-sun/50 text-sun-deep">
                <Icon name={f.icon} className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-0.5 text-sm leading-snug text-muted">{f.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
