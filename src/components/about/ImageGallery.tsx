"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";

type Props = { items: LightboxItem[]; className?: string; itemClassName?: string; sizes: string; contain?: boolean };

/** Grid of thumbnails that open in the lightbox (certificates, documents) */
export function ImageGallery({ items, className = "", itemClassName = "", sizes, contain }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className={className}>
        {items.map((item, i) => (
          <li key={item.src} className={itemClassName}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`View: ${item.caption}`}
              className="group block h-full w-full overflow-hidden rounded-card border border-line bg-white text-left"
            >
              <span className={`relative block aspect-[4/3] overflow-hidden ${contain ? "bg-cream p-2" : ""}`}>
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes={sizes}
                  className={`transition-transform duration-500 group-hover:scale-[1.03] ${contain ? "object-contain" : "object-cover"}`}
                />
              </span>
              <span className="block px-3 py-2.5 text-xs leading-snug text-muted sm:text-sm">{item.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={open} onChange={setOpen} />
    </>
  );
}
