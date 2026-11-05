import { Icon } from "./Icon";

type Props = { q: string; a: string; className?: string; as?: "h2" | "h3" };

/** AEO "quick answer" box: a question-style heading and a direct 1–2 sentence answer. */
export function QuickAnswer({ q, a, className = "", as: Heading = "h2" }: Props) {
  return (
    <aside aria-label="Quick answer" className={`relative overflow-hidden rounded-card border border-line bg-white p-5 sm:p-6 ${className}`}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sun to-gold" />
      <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-sun-deep uppercase">
        <Icon name="sparkle" className="size-4" /> Quick answer
      </p>
      <Heading className="mt-2 font-display text-lg font-bold tracking-tight text-ink sm:text-xl">{q}</Heading>
      <p className="mt-2 leading-relaxed text-ink/80">{a}</p>
    </aside>
  );
}
