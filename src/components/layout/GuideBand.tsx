"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { ON_GRID_GUIDE } from "@/lib/blog";

/** Slim site-wide link to the on-grid explainer, shown above the footer on every page except the guide itself. */
export function GuideBand() {
  const pathname = usePathname();
  if (pathname === ON_GRID_GUIDE.href) return null;
  return (
    <aside aria-label="Learn how solar works" className="border-t border-line bg-sand/70">
      <Container className="py-5">
        <Link
          href={ON_GRID_GUIDE.href}
          className="group flex flex-col gap-1 rounded-card sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <span className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun/15 text-sun-deep">
              <Icon name="bolt" className="size-4" />
            </span>
            <span>
              <span className="block text-xs font-bold tracking-[0.14em] text-sun-deep uppercase">Solar guide</span>
              <span className="block font-display font-semibold text-ink group-hover:text-panel">{ON_GRID_GUIDE.label}</span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 pl-12 text-sm font-semibold text-panel sm:pl-0">
            Panels, inverter, net meter &amp; earthing explained
            <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </Container>
    </aside>
  );
}
