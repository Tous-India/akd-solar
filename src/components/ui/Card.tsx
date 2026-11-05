import type { ElementType, ReactNode } from "react";

type Props = { as?: ElementType; className?: string; children: ReactNode; tilt?: boolean; tone?: "light" | "dark" };

export function Card({ as: Tag = "div", className = "", children, tilt, tone = "light" }: Props) {
  const toneClass = tone === "dark" ? "border-white/10 bg-white/[0.04] text-cream" : "border-line bg-white/75";
  return (
    <Tag {...(tilt ? { "data-tilt": "" } : {})} className={`rounded-card border p-6 sm:p-8 ${toneClass} ${className}`}>
      {children}
    </Tag>
  );
}
