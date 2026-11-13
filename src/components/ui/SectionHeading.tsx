import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubHeading } from "@/components/motion/ScrubHeading";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
};

/** tone "band": deeper orange that keeps 4.9:1 on the page-header gradient band, glow included */
export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" | "band" }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-[0.8rem] font-bold uppercase tracking-[0.16em] ${
        tone === "dark" ? "text-gold" : tone === "band" ? "text-[#8F4400]" : "text-sun-deep"
      }`}
    >
      <svg viewBox="0 0 20 12" className="h-3 w-5 shrink-0" aria-hidden>
        <path d="M2 11a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="10" cy="11" r="3" fill="currentColor" />
      </svg>
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left", tone = "light", className = "", as = "h2" }: Props) {
  const centered = align === "center";
  return (
    <Reveal stagger={0.1} className={`flex flex-col gap-4 ${centered ? "mx-auto items-center text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <ScrubHeading as={as} className={`text-h2 font-bold ${tone === "dark" ? "text-cream" : "text-ink"}`}>
        {title}
      </ScrubHeading>
      {subtitle ? <p className={`text-lead ${tone === "dark" ? "text-cream/75" : "text-muted"}`}>{subtitle}</p> : null}
    </Reveal>
  );
}
