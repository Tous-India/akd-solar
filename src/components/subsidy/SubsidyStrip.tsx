"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Countdown, DaysLeft } from "./Countdown";
import { STRIP_KEY } from "./stripKey";

/**
 * Sticky PM Surya Ghar countdown strip above the header. Dismissed for the browser session.
 * The <head> script in layout.tsx sets html[data-strip="off"] before paint, so a dismissed strip never flashes.
 */
export function SubsidyStrip() {
  const dismiss = () => {
    try {
      sessionStorage.setItem(STRIP_KEY, "1");
    } catch {}
    document.documentElement.dataset.strip = "off";
  };

  return (
    <div
      role="region"
      aria-label="PM Surya Ghar subsidy deadline"
      className="subsidy-strip fixed inset-x-0 top-0 z-[55] h-[var(--strip-h)] overflow-hidden bg-navy text-cream"
    >
      <div className="mx-auto flex h-full max-w-[1360px] items-center justify-center gap-3 pr-11 pl-4 text-[0.82rem] sm:text-sm">
        <Link href="/pm-surya-ghar-yojana" className="flex min-w-0 items-center gap-2 hover:text-gold">
          <span className="hidden truncate sm:inline">PM Surya Ghar subsidy closes 31 March 2027</span>
          <span className="truncate sm:hidden">PM Surya Ghar subsidy</span>
          <span aria-hidden className="text-cream/40">
            ·
          </span>
          <span className="font-semibold text-gold">
            <Countdown className="hidden md:inline" />
            <DaysLeft className="md:hidden" />
            <span className="hidden md:inline"> left</span>
          </span>
          <span aria-hidden className="hidden text-cream/40 sm:inline">
            ·
          </span>
          <span className="hidden shrink-0 items-center gap-1 font-semibold underline-offset-4 hover:underline sm:inline-flex">
            Check your subsidy <Icon name="arrowRight" className="size-3.5" />
          </span>
          <Icon name="arrowRight" className="size-3.5 shrink-0 sm:hidden" />
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hide subsidy countdown"
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-cream/70 hover:bg-white/10 hover:text-cream"
      >
        <Icon name="close" className="size-4" />
      </button>
    </div>
  );
}
