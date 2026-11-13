import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { mapsUrl, site } from "@/lib/site";
import { Countdown, DaysLeft } from "./Countdown";

const { line1, line2, city, state, pincode } = site.address;

/**
 * Fixed strip above the header (always shown): office area + phone on the left (from lg), PM Surya Ghar countdown on the right.
 * Below lg there is only room for the countdown, centred.
 */
export function SubsidyStrip() {
  return (
    <div role="region" aria-label="Office address and PM Surya Ghar subsidy deadline" className="subsidy-strip fixed inset-x-0 top-0 z-[55] h-[var(--strip-h)] overflow-hidden bg-navy text-cream">
      <div className="mx-auto flex h-full max-w-[1360px] items-center justify-center gap-6 px-4 text-[0.82rem] tracking-[0.01em] whitespace-nowrap sm:px-6 sm:text-sm lg:justify-between lg:px-8">
        <div className="hidden min-w-0 items-center gap-5 text-cream/85 lg:inline-flex">
          <a
            href={mapsUrl(`${line1}, ${line2}, ${city}, ${state} ${pincode}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-gold"
          >
            <Icon name="mapPin" className="size-3.5 shrink-0 text-gold" />
            <span>
              {line2}, {city}
            </span>
            <span className="sr-only"> (office address, opens Google Maps)</span>
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-gold">
            <Icon name="phone" className="size-3.5 shrink-0 text-gold" />
            <span>{site.phone}</span>
          </a>
        </div>
        <Link
          href="/pm-surya-ghar-yojana"
          aria-label="PM Surya Ghar subsidy deadline: check your subsidy"
          className="flex min-w-0 items-center gap-2 hover:text-gold md:gap-4"
        >
          <span className="hidden truncate sm:inline">PM Surya Ghar subsidy closes 31 March 2027</span>
          <span className="truncate sm:hidden">PM Surya Ghar subsidy</span>
          <span aria-hidden className="text-cream/40">
            ·
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-gold">
            <Countdown className="hidden md:inline-flex" />
            <DaysLeft className="md:hidden" />
            <span className="hidden md:inline">left</span>
          </span>
          <span aria-hidden className="hidden text-cream/40 sm:inline">
            ·
          </span>
          <span className="hidden shrink-0 items-center gap-1.5 font-semibold underline-offset-4 hover:underline sm:inline-flex">
            Check your subsidy <Icon name="arrowRight" className="size-3.5" />
          </span>
          <Icon name="arrowRight" className="size-3.5 shrink-0 sm:hidden" />
        </Link>
      </div>
    </div>
  );
}
