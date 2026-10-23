"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { EASE, gsap, motionEnabled, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

/**
 * Steel roller shutter between pages: drops from the top, rolls back up. Catches clicks on internal links (including
 * next/link, which stands down once the event is defaultPrevented), covers the
 * screen, navigates, then lifts once the new route has rendered. Back/forward and
 * reduced motion navigate normally.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef<{ hash: string } | null>(null);
  const first = useRef(true);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || a.hasAttribute("download") || a.dataset.noTransition !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page: let anchors / Lenis handle it
      e.preventDefault();

      const go = () => router.push(url.pathname + url.search + url.hash, { scroll: !url.hash });
      if (!motionEnabled() || !curtain.current) return go();
      pending.current = { hash: url.hash };
      getLenis()?.stop();
      const el = curtain.current;
      gsap.killTweensOf(el);
      gsap
        .timeline()
        .set(el, { display: "block", yPercent: -100 })
        .set(el.querySelector("[data-curtain-mark]"), { autoAlpha: 0, y: 12 })
        .to(el, { yPercent: 0, duration: 0.6, ease: "power3.inOut" })
        .to(el.querySelector("[data-curtain-mark]"), { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE }, "-=0.2")
        .add(go);
      // Failsafe: never leave the curtain down if a navigation stalls.
      window.setTimeout(() => {
        if (!pending.current) return;
        pending.current = null;
        gsap.to(el, { yPercent: -100, duration: 0.5, ease: "power3.inOut", onComplete: () => gsap.set(el, { display: "none" }) });
        getLenis()?.start();
      }, 6000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // New route rendered: reset scroll, then lift the curtain.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const lenis = getLenis();
    const hash = pending.current?.hash || location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    // Jump to the anchor (or the top). Repeated once layout settles, since fonts and
    // hero heights can still shift the page right after the route renders.
    const place = () => {
      if (target) {
        // Lenis already honours the 72px scroll-padding-top on <html> (the fixed header).
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
        else window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 72);
      } else if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };
    place();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      place();
    });
    const settle = window.setTimeout(place, 350);

    const el = curtain.current;
    if (!el || !pending.current) {
      lenis?.start();
      return () => window.clearTimeout(settle);
    }
    pending.current = null;
    gsap
      .timeline({ delay: 0.08 })
      .to(el.querySelector("[data-curtain-mark]"), { autoAlpha: 0, y: -12, duration: 0.25, ease: "power2.in" })
      .to(el, { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "-=0.05")
      .set(el, { display: "none" })
      .add(() => {
        lenis?.start();
        place();
      }, 0.3);
    return () => window.clearTimeout(settle);
  }, [pathname]);

  return (
    <div
      ref={curtain}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] hidden overflow-hidden bg-[#2a2f36] shadow-[0_30px_60px_rgb(0_0_0/0.6)]"
    >
      {/* Corrugated slats: a highlight and a shadow on every rib */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,#3b424b_0px,#4c545e_3px,#2c3238_9px,#1f2328_13px,#353c44_14px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(0_0_0/0.45),transparent_18%,transparent_82%,rgb(0_0_0/0.45))]" />
      <div className="tex-grain absolute inset-0 opacity-70" />
      {/* Brand plate */}
      <div data-curtain-mark className="absolute inset-0 grid place-items-center">
        <div className="rounded-[4px] border border-white/10 bg-[linear-gradient(180deg,#151a20,#0c1015)] px-8 py-5 text-center shadow-[0_18px_40px_-12px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.06)]">
          <span className="block font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold uppercase leading-none tracking-[0.16em] text-white">
            Loyal Point
          </span>
          <span className="mt-2 block text-[0.625rem] font-semibold uppercase tracking-[0.34em] text-copper-hi">
            Welding &amp; Fabrication
          </span>
        </div>
      </div>
      {/* Bottom rail with copper strip and handle */}
      <div className="absolute inset-x-0 bottom-0 h-7 border-t border-white/10 bg-[linear-gradient(180deg,#4a525c,#23282e)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-copper/80" />
        <div className="absolute bottom-1.5 left-1/2 h-2.5 w-24 -translate-x-1/2 rounded-full bg-[#14181d] shadow-[inset_0_1px_2px_rgb(0_0_0/0.8)]" />
      </div>
    </div>
  );
}
