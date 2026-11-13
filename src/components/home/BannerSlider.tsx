"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { banners, type Banner } from "@/lib/banners";

const INTERVAL = 5000;

function BannerPicture({ banner, first }: { banner: Banner; first: boolean }) {
  const contain = banner.fit === "contain";
  const common = { alt: banner.alt, sizes: "100vw", priority: first, quality: 80 };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: banner.desktop, width: 1920, height: 640 });
  const { props: mobile } = getImageProps({ ...common, src: banner.mobile ?? banner.desktop, width: banner.mobile ? 1200 : 1920, height: banner.mobile ? 800 : 640 });

  return (
    <picture>
      {/* a contained 3:2 image in the 3:1 slot is half the viewport wide */}
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes={contain ? "50vw" : "100vw"} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img
        {...mobile}
        loading={first ? "eager" : "lazy"}
        fetchPriority={first ? "high" : "auto"}
        className={`absolute inset-0 size-full object-cover ${contain ? "object-center md:object-contain" : "object-left"}`}
      />
    </picture>
  );
}

/** Full-width banner slider: images only, arrows on the sides, dots inside. */
export function BannerSlider() {
  const count = banners.length;
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Autoplay; the timer restarts after every change so manual navigation gets a full 5s
  useEffect(() => {
    if (reduced || hovered || count < 2) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, hovered, reduced, count, go]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  };

  if (!count) return null;

  const arrow =
    "absolute top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_4px_14px_rgb(0_0_0/0.18)] transition-colors hover:bg-[#e9e6df] md:size-11";

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Highlights"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative aspect-[3/2] w-full overflow-hidden bg-navy outline-none focus-visible:ring-4 focus-visible:ring-gold focus-visible:ring-inset md:aspect-[3/1]"
    >
      {banners.map((b, i) => {
        const active = i === index;
        const picture = <BannerPicture banner={b} first={i === 0} />;
        return (
          <div
            key={b.desktop}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
            inert={!active}
            className={`absolute inset-0 ease-out ${reduced ? "" : "transition-opacity duration-[600ms]"} ${active ? "z-[1] opacity-100" : "opacity-0"} ${
              b.fit === "contain" ? "md:bg-[linear-gradient(180deg,#CFE6FB_0%,#EAF4FD_60%,#F7FBFF_100%)]" : ""
            }`}
          >
            {b.href ? (
              <Link href={b.href} className="absolute inset-0 block" tabIndex={active ? 0 : -1}>
                {picture}
              </Link>
            ) : (
              picture
            )}
          </div>
        );
      })}

      {count > 1 ? (
        <>
          <button type="button" aria-label="Previous banner" onClick={() => go(index - 1)} className={`${arrow} left-2 md:left-4`}>
            <Icon name="chevronLeft" className="size-5" />
          </button>
          <button type="button" aria-label="Next banner" onClick={() => go(index + 1)} className={`${arrow} right-2 md:right-4`}>
            <Icon name="chevronRight" className="size-5" />
          </button>
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center md:bottom-3" role="group" aria-label="Choose banner">
            {banners.map((b, i) => (
              <button
                key={b.desktop}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === index}
                className="flex h-6 items-center px-1"
              >
                <span
                  className={`block h-2 rounded-full bg-white shadow-[0_1px_4px_rgb(0_0_0/0.35)] transition-all duration-300 ${
                    i === index ? "w-6" : "w-2 opacity-60 hover:opacity-90"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
