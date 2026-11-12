"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { nav, type NavItem } from "@/lib/site";
import { locationGroups, menuLinks } from "./menuLinks";

// Loaded on the first tap of the menu button, so the full menu is not hydrated on every page load
const MobileMenu = dynamic(() => import("./MobileMenu").then((m) => m.MobileMenu), { ssr: false });

type MenuKind = NonNullable<NavItem["menu"]>;

export function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  if (item.menu === "locations") return pathname.startsWith("/locations") || pathname.startsWith("/solar-panel-installation");
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedAt = useRef(0);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKind | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMenuOpen(false);
  }, [pathname]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        gsap.fromTo(headerRef.current, { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, delay: 0.05 });
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
  // A mouse click right after hover-opening keeps the menu open
  const toggle = (kind: MenuKind) => {
    if (Date.now() - hoverOpenedAt.current < 600) return setOpenMenu(kind);
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
        className={`fixed inset-x-0 top-[var(--strip-h)] z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled || openMenu ? "border-line bg-cream/90 shadow-[0_6px_30px_-20px_rgb(16_24_40/0.25)] backdrop-blur-md" : "border-transparent bg-cream/0"
        }`}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 xl:h-[76px] xl:px-8">
          <Link href="/" className="relative z-10 flex shrink-0 items-center rounded-lg" aria-label="AKD Solar — home">
            <Image src="/logo.png" alt="AKD Solar — Balancing The Nature" width={1580} height={642} priority sizes="130px" className="h-10 w-auto xl:h-12" />
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center">
              {nav.map((item) => {
                const active = isActive(pathname, item);
                const linkClass = `relative flex min-h-11 items-center gap-1 px-3 text-[0.92rem] font-medium whitespace-nowrap transition-colors 2xl:px-3.5 ${
                  active ? "text-ink after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-sun" : "text-ink/70 hover:text-ink"
                }`;
                if (item.highlight) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`relative flex min-h-11 items-center gap-1.5 px-3 text-[0.92rem] font-bold whitespace-nowrap 2xl:px-3.5 ${
                          active ? "after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-sun" : ""
                        }`}
                      >
                        <span className="pm-gradient-text">{item.label}</span>
                        <span className="rounded-full bg-[#D7141A] px-1.5 py-0.5 text-[0.62rem] leading-none font-bold tracking-wide text-white uppercase">
                          Subsidy
                        </span>
                      </Link>
                    </li>
                  );
                }
                if (!item.menu) {
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className={linkClass} aria-current={active ? "page" : undefined}>
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const kind = item.menu;
                const open = openMenu === kind;
                return (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => hoverOpen(kind)}
                    onMouseLeave={scheduleClose}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu((o) => (o === kind ? null : o));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape" && open) {
                        setOpenMenu(null);
                        (e.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus();
                      }
                    }}
                  >
                    <button
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
                    {open && kind === "locations" ? (
                      <div id="locations-menu" className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                        <div className="rounded-card border border-line bg-cream p-5 shadow-[0_16px_40px_-20px_rgb(16_24_40/0.35)]">
                          <div className="flex divide-x divide-line">
                            {locationGroups.map((g) => (
                              <div key={g.title} className="min-w-40 px-5 first:pl-0 last:pr-0">
                                <p className={`text-[0.72rem] font-bold tracking-[0.14em] uppercase ${g.tone === "sun" ? "text-sun-deep" : "text-panel"}`}>{g.title}</p>
                                <ul className="mt-2">
                                  {g.links.map((l) => (
                                    <li key={l.label}>
                                      <Link
                                        href={l.href}
                                        onClick={() => setOpenMenu(null)}
                                        className="block py-1.5 text-[0.95rem] text-ink/80 transition-colors hover:text-ink"
                                      >
                                        {l.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <Link
                            href="/locations"
                            onClick={() => setOpenMenu(null)}
                            className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-sm font-semibold text-panel hover:text-ink"
                          >
                            View all areas <Icon name="arrowRight" className="size-4" />
                          </Link>
                        </div>
                      </div>
                    ) : open ? (
                      <div id={`${kind}-menu`} className="absolute top-full left-0 pt-2">
                        <ul className="min-w-56 rounded-card border border-line bg-white py-2 shadow-[0_16px_40px_-20px_rgb(16_24_40/0.35)]">
                          {menuLinks[kind].map((l) => (
                            <li key={l.href}>
                              <Link
                                href={l.href}
                                onClick={() => setOpenMenu(null)}
                                className="block px-4 py-2 text-[0.95rem] text-ink/80 transition-colors hover:bg-cream hover:text-ink"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              })}
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
              className="flex size-12 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink transition-colors hover:bg-white xl:hidden"
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
