"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type LightboxItem = { src: string; width: number; height: number; caption: string };

type Props = { items: LightboxItem[]; index: number | null; onChange: (i: number | null) => void };

/** Full-screen image viewer: prev/next, swipe, Esc to close, image counter, focus trap, scroll lock. */
export function Lightbox({ items, index, onChange }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const pointerStart = useRef<number | null>(null);
  const open = index !== null;
  const count = items.length;

  const step = useCallback((d: number) => index !== null && onChange((index + d + count) % count), [index, count, onChange]);
  const close = useCallback(() => onChange(null), [onChange]);

  // Focus, scroll lock and keyboard
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus({ preventScroll: true });
    };
  }, [open, close, step]);

  // Soft fade between images
  useEffect(() => {
    if (index === null || !imgRef.current || prefersReducedMotion()) return;
    gsap.fromTo(imgRef.current, { autoAlpha: 0, scale: 0.98 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" });
  }, [index]);

  if (!open || typeof document === "undefined") return null;
  const item = items[index];

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${count}: ${item.caption}`}
      data-lightbox
      className="fixed inset-0 z-[90] flex flex-col bg-navy/95 text-cream"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="text-sm font-semibold tabular-nums" data-lightbox-counter>
          {index + 1} / {count}
        </p>
        <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
          <Icon name="close" className="size-5" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
        onClick={(e) => e.target === e.currentTarget && close()}
        onPointerDown={(e) => {
          pointerStart.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (pointerStart.current === null) return;
          const dx = e.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        }}
      >
        <div ref={imgRef} className="relative flex h-full max-h-full w-full items-center justify-center">
          <Image
            key={item.src}
            src={item.src}
            alt={item.caption}
            width={item.width}
            height={item.height}
            sizes="100vw"
            className="h-auto max-h-full w-auto max-w-full rounded-card object-contain"
            style={{ maxHeight: "calc(100dvh - 9rem)" }}
          />
        </div>
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous image"
          className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:left-5"
        >
          <Icon name="chevronLeft" className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next image"
          className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:right-5"
        >
          <Icon name="chevronRight" className="size-5" />
        </button>
      </div>

      <p className="px-4 py-4 text-center text-sm text-cream/85">{item.caption}</p>
    </div>,
    document.body,
  );
}
