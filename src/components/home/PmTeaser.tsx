import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Countdown } from "@/components/subsidy/Countdown";
import { Reveal } from "@/components/motion/Reveal";

/** One-line PM Surya Ghar teaser: the full section lives on /pm-surya-ghar-yojana */
export function PmTeaser() {
  return (
    <section aria-labelledby="pm-teaser" className="py-12 sm:py-16">
      <Container>
        <Reveal className="flex flex-col gap-5 rounded-card border border-line bg-white p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 id="pm-teaser" className="font-display text-h3 font-bold text-ink">
              Up to ₹78,000 PM Surya Ghar subsidy
            </h2>
            <p className="mt-1 text-muted">
              Closes 31 March 2027 · <Countdown className="font-semibold text-sun-deep" /> left
            </p>
          </div>
          <Button href="/pm-surya-ghar-yojana" className="self-start lg:self-auto">
            Check your subsidy
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
