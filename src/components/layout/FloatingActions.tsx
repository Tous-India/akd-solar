"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { telHref, whatsappHref } from "@/lib/site";

/**
 * Floating WhatsApp button + a thumb-reach CTA bar on mobile/tablet.
 * When the bar shows, the WhatsApp button docks into the space reserved on its right, so nothing overlaps.
 */
export function FloatingActions() {
  const pathname = usePathname();
  const [showBar, setShowBar] = useState(false);
  const barAllowed = pathname !== "/contact";

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 160;
      setShowBar(window.scrollY > 520 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const barVisible = barAllowed && showBar;

  return (
    <>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AKD Solar on WhatsApp"
        className={`fixed right-4 z-[45] flex size-14 items-center justify-center rounded-full bg-wa text-white shadow-[0_12px_30px_-8px_rgb(22_122_66/0.6)] transition-[bottom,transform] duration-500 ease-out-expo hover:scale-105 sm:right-6 lg:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] ${
          barVisible ? "bottom-[calc(0.5rem+env(safe-area-inset-bottom))]" : "bottom-[calc(1rem+env(safe-area-inset-bottom))]"
        }`}
      >
        <span aria-hidden className="pulse-ring absolute inset-0 rounded-full bg-wa" />
        <Icon name="whatsapp" className="relative size-7" />
      </a>

      {barAllowed ? (
        <div
          aria-hidden={!barVisible}
          inert={!barVisible}
          className={`pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 backdrop-blur-md transition-[transform,visibility] duration-500 ease-out-expo lg:hidden ${
            barVisible ? "visible translate-y-0" : "invisible translate-y-full"
          }`}
        >
          <div className="flex items-center gap-3 py-3 pr-[5.5rem] pl-4 sm:pr-24 sm:pl-6">
            <a
              href={telHref()}
              aria-label="Call AKD Solar"
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink"
            >
              <Icon name="phone" className="size-5" />
            </a>
            <Link
              href="/contact"
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-sun px-4 text-[0.95rem] font-semibold whitespace-nowrap text-ink"
            >
              Free Site Survey <Icon name="arrowRight" className="size-5" />
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
