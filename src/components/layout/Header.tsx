"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { nav, site, type NavItem } from "@/lib/site";
import { services } from "@/lib/data";
import { locations, locationsByRegion } from "@/lib/locations";
import dynamic from "next/dynamic";

// Loaded on the first tap of the menu button, so the full menu (35+ links) is not hydrated on every page load
const MobileMenu = dynamic(() => import("./MobileMenu").then((m) => m.MobileMenu), { ssr: false });

type MenuKind = NonNullable<NavItem["menu"]>;

const desktopNav = nav.filter((n) => !n.mobileOnly);

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  if (item.menu === "locations") return pathname.startsWith("/locations") || pathname.startsWith("/solar-panel-installation");
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtons = useRef<Partial<Record<MenuKind, HTMLButtonElement | null>>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedAt = useRef(0);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKind | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  const activeIndex = desktopNav.findIndex((item) => isActive(pathname, item));

  const moveIndicator = useCallback((index: number) => {
    const el = itemRefs.current[index];
    if (!el || index < 0) {
      setIndicator((s) => ({ ...s, visible: false }));
      return;
    }
    setIndicator({ left: el.offsetLeft + 12, width: el.offsetWidth - 24, visible: true });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    moveIndicator(activeIndex);
    const onResize = () => moveIndicator(activeIndex);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, moveIndicator]);

  useEffect(() => {
    setOpenMenu(null);
    setMenuOpen(false);
  }, [pathname]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        gsap.fromTo(headerRef.current, { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, delay: 0.05 });
      });
      return () => mm.revert();
    },
    { scope: headerRef },
  );

  const hoverOpen = (kind: MenuKind) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    hoverOpenedAt.current = Date.now();
    setOpenMenu(kind);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };
  // A mouse click right after hover-opening (even in the same frame) keeps the menu open
  const toggle = (kind: MenuKind) => {
    if (Date.now() - hoverOpenedAt.current < 600) {
      setOpenMenu(kind);
      return;
    }
    setOpenMenu((o) => (o === kind ? null : kind));
  };

  const closeMobile = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        data-intro
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled || openMenu
            ? "border-line bg-cream/85 shadow-[0_6px_30px_-20px_rgb(16_24_40/0.25)] backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
          <Link href="/" className="relative z-10 flex shrink-0 items-center rounded-lg" aria-label="AKD Solar — home">
            <Image src="/logo.png" alt="AKD Solar — Balancing The Nature" width={1580} height={642} priority sizes="130px" className="h-11 w-auto lg:h-[52px]" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="relative flex items-center" onMouseLeave={() => moveIndicator(activeIndex)}>
              {desktopNav.map((item, i) => {
                const active = i === activeIndex;
                const linkClass = `relative flex min-h-11 items-center gap-1 rounded-full px-3 text-[0.95rem] font-medium whitespace-nowrap transition-colors xl:px-4 ${
                  active ? "text-ink" : "text-ink/70 hover:text-ink"
                }`;
                const setRef = (el: HTMLElement | null) => {
                  itemRefs.current[i] = el;
                };
                if (item.menu) {
                  const kind = item.menu;
                  const open = openMenu === kind;
                  return (
                    <li
                      key={item.href}
                      ref={setRef}
                      onMouseEnter={() => {
                        moveIndicator(i);
                        hoverOpen(kind);
                      }}
                      onMouseLeave={scheduleClose}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu((o) => (o === kind ? null : o));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape" && open) {
                          setOpenMenu(null);
                          menuButtons.current[kind]?.focus();
                        }
                      }}
                    >
                      <button
                        ref={(el) => {
                          menuButtons.current[kind] = el;
                        }}
                        type="button"
                        className={linkClass}
                        aria-expanded={open}
                        aria-controls={`${kind}-menu`}
                        aria-current={active ? "page" : undefined}
                        onClick={() => toggle(kind)}
                      >
                        {item.label}
                        <Icon name="chevronDown" className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open ? <MegaMenu kind={kind} onNavigate={() => setOpenMenu(null)} /> : null}
                    </li>
                  );
                }
                return (
                  <li key={item.href} ref={setRef} onMouseEnter={() => moveIndicator(i)}>
                    <Link href={item.href} className={linkClass} aria-current={active ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li aria-hidden className="pointer-events-none absolute bottom-0.5 left-0 h-[3px]">
                <span
                  className="block h-full rounded-full bg-sun transition-[transform,width,opacity] duration-500 ease-out-expo"
                  style={{ width: indicator.width, transform: `translateX(${indicator.left}px)`, opacity: indicator.visible ? 1 : 0 }}
                />
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button href="/contact" size="md" magnetic className="whitespace-nowrap">
                Get Free Quote
              </Button>
            </div>
            <button
              ref={menuButtonRef}
              type="button"
              className="flex size-12 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition-colors hover:bg-white lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => {
                setMenuMounted(true);
                setMenuOpen(true);
              }}
              onPointerEnter={() => setMenuMounted(true)}
            >
              <Icon name="menu" className="size-6" />
            </button>
          </div>
        </div>
      </header>
      {menuMounted ? <MobileMenu open={menuOpen} onClose={closeMobile} pathname={pathname} /> : null}
    </>
  );
}

function MegaMenu({ kind, onNavigate }: { kind: MenuKind; onNavigate: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(ref.current, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
        gsap.from("[data-mega-item]", { autoAlpha: 0, y: 8, stagger: 0.03, duration: 0.4, delay: 0.05 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} id={`${kind}-menu`} className="absolute left-1/2 top-full w-[min(940px,calc(100vw-4rem))] -translate-x-1/2 pt-3">
      <div className="grid grid-cols-[1.6fr_1fr] gap-3 rounded-card border border-line bg-cream p-3 shadow-[0_30px_80px_-30px_rgb(10_23_48/0.35)]">
        {kind === "services" ? <ServicesPanel onNavigate={onNavigate} /> : <LocationsPanel onNavigate={onNavigate} />}
        <div data-mega-item className="on-dark relative overflow-hidden rounded-card bg-navy p-6 text-cream">
          <div aria-hidden className="sun-glow absolute -top-24 -right-24 size-72 rounded-full" />
          <div aria-hidden className="panel-grid-dark absolute inset-0" />
          {kind === "services" ? (
            <div className="relative flex h-full flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-akd px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">Govt. subsidy</span>
              <p className="mt-4 font-display text-2xl leading-tight font-bold">
                Up to <span className="text-gold">₹78,000</span> back under PM Surya Ghar
              </p>
              <p className="mt-3 text-sm text-cream/75">See your system size, subsidy and payback in under a minute.</p>
              <Link href="/calculator" onClick={onNavigate} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-semibold text-gold hover:text-white">
                Calculate my savings <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="relative flex h-full flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wider text-ink uppercase">
                {locations.length} cities
              </span>
              <p className="mt-4 font-display text-2xl leading-tight font-bold">Serving Haryana &amp; Delhi NCR from {site.address.city}</p>
              <p className="mt-3 text-sm text-cream/75">One in-house crew, one standard of work — wherever your roof is.</p>
              <Link href="/locations" onClick={onNavigate} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-semibold text-gold hover:text-white">
                View all areas <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServicesPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <ul className="grid grid-cols-2 gap-1">
      {services.map((s) => (
        <li key={s.slug} data-mega-item>
          <Link href={`/services/${s.slug}`} onClick={onNavigate} className="group flex h-full gap-3.5 rounded-card p-4 transition-colors hover:bg-white">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sand text-panel transition-colors group-hover:bg-sun group-hover:text-ink">
              <Icon name={s.icon} className="size-5" />
            </span>
            <span>
              <span className="block font-display text-[0.95rem] font-semibold text-ink">{s.title}</span>
              <span className="mt-1 block text-sm leading-snug text-muted">{s.short}</span>
            </span>
          </Link>
        </li>
      ))}
      <li data-mega-item>
        <Link
          href="/services"
          onClick={onNavigate}
          className="flex h-full items-center justify-between gap-3 rounded-card border border-dashed border-ink/15 p-4 font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-white"
        >
          View all services
          <Icon name="arrowRight" className="size-5" />
        </Link>
      </li>
    </ul>
  );
}

function LocationsPanel({ onNavigate }: { onNavigate: () => void }) {
  const haryana = locationsByRegion("Haryana");
  const ncr = locationsByRegion("Delhi NCR");
  const linkClass = "flex min-h-9 items-center rounded-card px-2.5 text-[0.92rem] text-ink/80 transition-colors hover:bg-white hover:text-ink";
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 p-3">
      <div data-mega-item>
        <p className="px-2.5 text-xs font-bold tracking-[0.14em] text-sun-deep uppercase">Haryana</p>
        <ul className="mt-2 grid grid-cols-3 gap-x-1">
          {haryana.map((l) => (
            <li key={l.slug}>
              <Link href={`/solar-panel-installation/${l.slug}`} onClick={onNavigate} className={linkClass}>
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div data-mega-item className="border-l border-line pl-4">
        <p className="px-2.5 text-xs font-bold tracking-[0.14em] text-panel uppercase">Delhi NCR</p>
        <ul className="mt-2">
          {ncr.map((l) => (
            <li key={l.slug}>
              <Link href={`/solar-panel-installation/${l.slug}`} onClick={onNavigate} className={linkClass}>
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
