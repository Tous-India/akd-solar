"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { projectCaption, projects, type ProjectCategory } from "@/lib/data";

type Filter = "all" | ProjectCategory;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
];

/** Every photo of every project, captioned "6 kW · Residential · Sonipat" (never a customer name) */
const allItems = projects.flatMap((p) => p.images.map((img) => ({ ...img, caption: projectCaption(p), category: p.category })));

export function ProjectsGallery() {
  const gridRef = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);

  const items = useMemo(() => (filter === "all" ? allItems : allItems.filter((i) => i.category === filter)), [filter]);
  const lightboxItems: LightboxItem[] = items;

  const counts = {
    all: allItems.length,
    residential: allItems.filter((i) => i.category === "residential").length,
    commercial: allItems.filter((i) => i.category === "commercial").length,
  };

  // Fade the photos in after each filter change
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-photo]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.02, ease: "power2.out", clearProps: "transform" });
    },
    { dependencies: [filter], scope: gridRef },
  );

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = f.id === filter;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-[0.95rem] font-semibold transition-colors ${
                active ? "border-navy bg-navy text-cream" : "border-line bg-white text-ink hover:border-ink/30"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/15 text-gold" : "bg-sand text-muted"}`}>{counts[f.id]}</span>
            </button>
          );
        })}
        <p aria-live="polite" className="ml-auto text-sm text-muted">
          {items.length} photos
        </p>
      </div>

      <ul ref={gridRef} className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <li key={item.src} data-photo className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${item.caption}`}
              className="group block w-full overflow-hidden rounded-card border border-line bg-white text-left"
            >
              <span className="block overflow-hidden">
                <Image
                  src={item.src}
                  alt={`Solar installation: ${item.caption}`}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />
              </span>
              <span className="block px-4 py-3 text-sm font-medium text-ink">{item.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox items={lightboxItems} index={open} onChange={setOpen} />
    </div>
  );
}
