import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";
import { Countdown, DaysLeft } from "./Countdown";

const { line2, city } = site.address;

/**
 * Fixed strip above the header (always shown): office area + phone on the left (from lg), PM Surya Ghar countdown on the right.
 * Below lg there is only room for the countdown, centred.
 */
export function SubsidyStrip() {
  return (
    <div role="region" aria-label="Office address and PM Surya Ghar subsidy deadline" className="subsidy-strip fixed inset-x-0 top-0 z-[55] h-[var(--strip-h)] overflow-hidden bg-[#D7141A] text-white">
      <div className="mx-auto flex h-full max-w-[1360px] items-center justify-center gap-6 px-4 text-[0.82rem] tracking-[0.01em] whitespace-nowrap sm:px-6 sm:text-sm lg:justify-between lg:px-8">
        <div className="hidden min-w-0 items-center gap-5 text-white/90 lg:inline-flex">
          <a
            href={site.offices[0].mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:underline underline-offset-4"
          >
            <Icon name="mapPin" className="size-3.5 shrink-0 text-white" />
            <span>
              {line2}, {city}
            </span>
            <span className="sr-only"> (office address, opens Google Maps)</span>
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:underline underline-offset-4">
            <Icon name="phone" className="size-3.5 shrink-0 text-white" />
            <span>{site.phone}</span>
          </a>
        </div>
        <p className="flex min-w-0 items-center gap-2 md:gap-4">
          <span className="hidden truncate sm:inline">PM Surya Ghar subsidy closes 31 March 2027</span>
          <span className="truncate sm:hidden">PM Surya Ghar subsidy</span>
          <span aria-hidden className="text-white/50">
            ·
          </span>
          <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-white">
            <Countdown className="hidden md:inline-flex" />
            <DaysLeft className="md:hidden" />
            <span className="hidden md:inline">left</span>
          </span>
        </p>
      </div>
    </div>
  );
}
