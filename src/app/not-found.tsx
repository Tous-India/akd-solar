import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SunriseBackdrop } from "@/components/ui/SunriseBackdrop";
import { CloudySun } from "@/components/notfound/CloudySun";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page is taking a little shade break.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-28">
      <SunriseBackdrop glowClass="-top-[30%] left-1/2 -translate-x-1/2" />
      <Container className="relative flex flex-col items-center text-center">
        <CloudySun />
        <p className="mt-6 font-display text-sm font-bold tracking-[0.2em] text-sun-deep uppercase">Error 404</p>
        <h1 className="mt-3 max-w-2xl text-display font-extrabold">Oops — the sun went behind a cloud.</h1>
        <p className="mt-5 max-w-lg text-lead text-muted">
          The page you&apos;re looking for has moved or never existed. Don&apos;t worry, there&apos;s plenty of sunshine elsewhere.
        </p>
        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href="/" size="lg" magnetic>
            Back to home
          </Button>
          <Button href="/calculator" size="lg" variant="secondary" icon="sun">
            Calculate savings
          </Button>
        </div>
      </Container>
    </section>
  );
}
