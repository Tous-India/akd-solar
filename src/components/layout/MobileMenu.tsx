"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { nav, site, telHref, whatsappHref } from "@/lib/site";
import { menuLinks } from "./menuLinks";

type Props = { open: boolean; onClose: () => void; pathname: string };

export function MobileMenu({ open, onClose, pathname }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [openSection, setOpenSection] = useState<"solutions" | "locations" | null>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      tl.current = gsap
        .timeline({ paused: true })
        .set(overlayRef.current, { display: "flex", immediateRender: false })
        .fromTo(
          overlayRef.current,
          { clipPath: "circle(0% at 100% 0%)" },
          { clipPath: "circle(150% at 100% 0%)", duration: reduce ? 0 : 0.7, ease: "power3.inOut" },
        )
        .from(
          "[data-mm-item]",
          { yPercent: reduce ? 0 : 60, autoAlpha: 0, stagger: reduce ? 0 : 0.05, duration: reduce ? 0 : 0.55, ease: "power3.out" },
          reduce ? 0 : "-=0.3",
        );
    },
    { scope: overlayRef },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      t.timeScale(1).play();
      closeRef.current?.focus({ preventScroll: true });
    } else {
      t.timeScale(1.8).reverse();
      setOpenSection(null);
    }
  }, [open]);

  // Lock page scroll and support Escape while open
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && overlayRef.current) {
        // simple focus trap
        const focusables = overlayRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
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
    };
  }, [open, onClose]);

  return (
    <div
      ref={overlayRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className="fixed inset-0 z-[70] hidden flex-col overflow-y-auto overscroll-contain bg-cream xl:hidden"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="sun-glow absolute -right-48 -top-48 size-[560px] rounded-full" />
        <div className="panel-grid absolute inset-0" />
      </div>

      <div className="relative flex h-[72px] shrink-0 items-center justify-between px-4 sm:px-6">
        <Link href="/" onClick={onClose} className="rounded-lg" aria-label="AKD Solar — home">
          <Image src="/logo.png" alt="AKD Solar" width={1580} height={642} sizes="130px" className="h-11 w-auto" />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-12 items-center justify-center rounded-full border border-ink/10 bg-white text-ink"
        >
          <Icon name="close" className="size-6" />
        </button>
      </div>

      <nav aria-label="Mobile" className="relative flex-1 px-4 pt-4 pb-6 sm:px-6">
        <ul className="flex flex-col">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.menu === "locations"
                  ? pathname.startsWith("/locations") || pathname.startsWith("/solar-panel-installation")
                  : pathname.startsWith(item.href);
            const base =
              "flex min-h-13 w-full items-center justify-between gap-4 border-b border-line py-2 font-display text-[1.35rem] font-bold tracking-tight sm:text-3xl";
            if (item.menu) {
              const kind = item.menu;
              const expanded = openSection === kind;
              const panelId = `mm-${kind}`;
              return (
                <li key={item.href} className="overflow-hidden">
                  <div data-mm-item>
                    <button
                      type="button"
                      className={`${base} text-left ${active ? "text-sun-deep" : "text-ink"}`}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpenSection((o) => (o === kind ? null : kind))}
                    >
                      {item.label}
                      <span className="flex size-10 items-center justify-center rounded-full bg-sand">
                        <Icon name="plus" className={`size-5 transition-transform duration-300 ${expanded ? "rotate-45" : ""}`} />
                      </span>
                    </button>
                    <div
                      id={panelId}
                      className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden" inert={!expanded}>
                        <ul>
                          {menuLinks[kind].map((l) => (
                            <li key={l.href}>
                              <Link href={l.href} onClick={onClose} className="flex min-h-11 items-center text-base font-medium text-ink/80 hover:text-ink">
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="flex min-h-12 items-center gap-2 pb-3 font-semibold text-panel"
                        >
                          {kind === "solutions" ? "All solar solutions" : "All areas we serve"} <Icon name="arrowRight" className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            }
            return (
              <li key={item.href} className="overflow-hidden">
                <Link
                  data-mm-item
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`${base} ${active ? "text-sun-deep" : "text-ink"}`}
                >
                  {item.label}
                  {active ? <span aria-hidden className="size-2.5 rounded-full bg-sun" /> : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div data-mm-item className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/contact"
            onClick={onClose}
            className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-sun px-6 font-semibold text-ink sm:col-span-2"
          >
            Get Free Quote <Icon name="arrowRight" className="size-5" />
          </Link>
          <a href={telHref()} className="flex min-h-14 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 font-semibold text-ink">
            <Icon name="phone" className="size-5" /> {site.phone}
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-wa px-6 font-semibold text-white"
          >
            <Icon name="whatsapp" className="size-5" /> Chat on WhatsApp
          </a>
        </div>
        <p data-mm-item className="mt-6 text-sm text-muted">
          {site.hours[0].days}: {site.hours[0].time}
        </p>
      </nav>
    </div>
  );
}
