"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

type Item = { q: string; a: string };

export function FaqList({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <Reveal as="ul" stagger={0.06} className="divide-y divide-line rounded-card border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={`${id}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 px-5 py-5 text-left font-display text-[1.05rem] font-semibold tracking-tight text-ink sm:px-7 sm:text-lg"
              >
                {item.q}
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    isOpen ? "bg-sun text-ink" : "bg-sand text-ink/70"
                  }`}
                >
                  <Icon name="plus" className={`size-5 transition-transform duration-500 ease-out-expo ${isOpen ? "rotate-45" : ""}`} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a-${i}`}
              role="region"
              aria-labelledby={`${id}-q-${i}`}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-500 ease-out-expo motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl px-5 pb-6 leading-relaxed text-muted sm:px-7">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </Reveal>
  );
}
