import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

/** Brands we install, as a simple typographic row (no third-party logo files) */
export function BrandsRow() {
  const groups = [
    { label: "Panels", brands: site.brands.panels },
    { label: "Inverters", brands: site.brands.inverters },
  ];
  return (
    <section aria-labelledby="brands-title" className="border-y border-line bg-white/60 py-10">
      <Container>
        <h2 id="brands-title" className="text-center font-display text-sm font-bold tracking-[0.16em] text-muted uppercase">
          Brands we install
        </h2>
        <Reveal stagger={0.08} className="mt-6 grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.label} className="text-center">
              <p className="text-xs font-semibold tracking-wide text-sun-deep uppercase">{g.label}</p>
              <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                {g.brands.map((b) => (
                  <li key={b} className="font-display text-xl font-extrabold tracking-tight text-ink/70 sm:text-2xl">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
