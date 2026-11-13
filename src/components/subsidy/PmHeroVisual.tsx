import { getImageProps } from "next/image";

/**
 * PM Surya Ghar banner shown inside the page header band (art-directed: 3:1 on desktop, ~3:2 on phones).
 * The banner carries the page title in the artwork, so the header's h1 stays visually hidden but present for SEO.
 * Entrance: a slow settle-in zoom plus one light sheen sweep (CSS only; disabled for reduced motion).
 */
export function PmHeroVisual() {
  const alt =
    "PM Surya Ghar Yojana — up to ₹78,000 subsidy for home rooftop solar. Apply by 31 March 2027.";
  const common = { alt, sizes: "(min-width: 1280px) 1216px, 100vw", priority: true, quality: 85 };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: "/images/pm/pm-hero.jpg", width: 1920, height: 640 });
  const { props: mobile } = getImageProps({ ...common, src: "/images/pm/pm-hero-mobile.jpg", width: 1200, height: 780 });

  return (
    <div className="pm-hero relative mt-4 aspect-[1200/780] overflow-hidden rounded-card bg-[#eaf4fd] shadow-[0_28px_60px_-28px_rgb(10_23_48/0.45)] ring-1 ring-[rgb(16_24_40/0.06)] sm:mt-5 md:aspect-[3/1]">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes={common.sizes} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...mobile} fetchPriority="high" className="pm-hero-img absolute inset-0 size-full object-cover" />
      </picture>
      <span aria-hidden className="pm-hero-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3" />
    </div>
  );
}
