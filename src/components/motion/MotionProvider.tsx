"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";

/**
 * Global motion glue:
 * - refreshes ScrollTrigger once fonts/images have loaded and after route changes
 * - delegated magnetic hover ([data-magnetic]) and soft card tilt ([data-tilt]) on desktop fine pointers
 */
export function MotionProvider() {
  const pathname = usePathname();

  // ScrollTrigger refreshes itself on window load; also refresh once web fonts are ready
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
  }, []);

  // Re-measure after client-side navigation (not on the first render)
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia(MQ.desktop);
    let teardown = () => {};

    const setup = () => {
      teardown();
      teardown = () => {};
      if (!mq.matches) return;

      const onMove = (e: PointerEvent) => {
        const target = e.target as Element | null;
        if (!target?.closest) return;
        const mag = target.closest<HTMLElement>("[data-magnetic]");
        if (mag) {
          const r = mag.getBoundingClientRect();
          gsap.to(mag, {
            x: (e.clientX - (r.left + r.width / 2)) * 0.22,
            y: (e.clientY - (r.top + r.height / 2)) * 0.3,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
        const tilt = target.closest<HTMLElement>("[data-tilt]");
        if (tilt) {
          const r = tilt.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(tilt, {
            rotationY: px * 6,
            rotationX: -py * 6,
            y: -4,
            transformPerspective: 900,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      const onOut = (e: PointerEvent) => {
        const from = (e.target as Element | null)?.closest?.("[data-magnetic], [data-tilt]");
        if (!from) return;
        const related = e.relatedTarget as Node | null;
        if (related && from.contains(related)) return;
        if (from.hasAttribute("data-magnetic")) {
          gsap.to(from, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
        } else {
          gsap.to(from, { rotationX: 0, rotationY: 0, y: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });
        }
      };

      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onOut, { passive: true });
      teardown = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onOut);
      };
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      teardown();
    };
  }, []);

  return null;
}
