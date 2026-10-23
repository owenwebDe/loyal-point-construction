"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { EASE, gsap, motionEnabled, ScrollTrigger, SplitText } from "@/lib/gsap";
import { lockScroll } from "@/lib/lenis";

declare global {
  interface Window {
    __lpcMotion?: boolean;
  }
}

const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/** Run after the window load event, when the main thread is idle. */
function afterLoad(fn: () => void) {
  const idle = () =>
    "requestIdleCallback" in window ? window.requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 1);
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

/** Yield to the browser between chunks of setup work so no single task runs long. */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

let firstLoad = true;

/**
 * Scroll-driven motion for whichever page is showing. The page-load sequence is
 * pure CSS (globals.css); this wires everything else from data attributes:
 * data-r="heading" | "bar" | "fade-up" | "clip" | "draw", and data-parallax.
 * Re-runs on every route change and reverts the previous page's triggers.
 */
export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    window.__lpcMotion = true;
    if (!motionEnabled()) return;

    const root = document.documentElement;
    let unlock: ReturnType<typeof setTimeout> | undefined;
    if (firstLoad) {
      firstLoad = false;
      // Hold the page still while the desktop intro overlay plays.
      const overlay = document.querySelector<HTMLElement>("[data-intro]");
      if (overlay && getComputedStyle(overlay).display !== "none" && window.scrollY < 10) {
        lockScroll(true);
        unlock = setTimeout(() => lockScroll(false), 1900);
      }
      // Later page heroes reveal straight away (no intro overlay to wait for).
      setTimeout(() => root.classList.add("intro-done"), 2600);
    }

    const ctx = gsap.context(() => {});
    const mm = gsap.matchMedia();
    let cancelled = false;

    const setup = async () => {
      await document.fonts?.ready;

      // Section headings: line-mask reveal, one heading per task.
      for (const el of q("[data-r='heading']")) {
        if (cancelled) return;
        ctx.add(() => {
          const split = SplitText.create(el, { type: "lines", mask: "lines" });
          gsap.set(el, { visibility: "visible" });
          gsap.from(split.lines, {
            yPercent: 100,
            duration: 0.8,
            stagger: 0.08,
            ease: EASE,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        await yieldToMain();
      }
      if (cancelled) return;

      ctx.add(() => {
        q("[data-r='bar']").forEach((el) =>
          gsap.to(el, {
            scaleX: 1,
            duration: 0.6,
            delay: 0.25,
            ease: EASE,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }),
        );

        ScrollTrigger.batch("[data-r='fade-up']", {
          start: "top 90%",
          once: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE }),
        });

        // Photo cards: clip-path wipe while the inner image settles from 1.25.
        ScrollTrigger.batch("[data-r='clip']", {
          start: "top 88%",
          once: true,
          onEnter: (els) => {
            gsap.to(els, { clipPath: "inset(0% 0 0 0)", duration: 0.9, stagger: 0.1, ease: EASE });
            gsap.to(
              els.map((el) => el.querySelector("[data-r-inner]")).filter(Boolean),
              { scale: 1, duration: 1.2, stagger: 0.1, ease: EASE },
            );
          },
        });
      });
      await yieldToMain();
      if (cancelled) return;

      // Line icons stroke-draw, 80ms apart.
      ctx.add(() => {
        q("[data-r='draw']").forEach((group) => {
          q("[data-draw]", group).forEach((icon, i) => {
            gsap.to(q("path", icon), {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: "power2.out",
              delay: Math.min(i, 12) * 0.08,
              scrollTrigger: { trigger: group, start: "top 85%", once: true },
            });
          });
        });
      });
      await yieldToMain();
      if (cancelled) return;

      // Desktop only: hero exit and parallax.
      mm.add("(min-width: 1024px)", () => {
        const hero = document.querySelector("[data-hero-root]");
        if (hero) {
          gsap
            .timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } })
            // Camera pulls back and tilts away as the hero leaves.
            .to("[data-hero-media]", { scale: 1.12, opacity: 0.25, rotationX: 7, transformPerspective: 1400, transformOrigin: "50% 100%", ease: "none" }, 0)
            .to("[data-hero-content]", { y: -60, opacity: 0, ease: "none" }, 0)
            .to("[data-hero-blueprint]", { yPercent: -14, opacity: 0, ease: "none" }, 0);
        }
        // Background type drifting sideways with scroll.
        q("[data-parallax-x]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: 0 },
            {
              xPercent: Number(el.dataset.parallaxX || -15),
              ease: "none",
              scrollTrigger: { trigger: el.closest("section") ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
        q("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax || 10);
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      ScrollTrigger.refresh();
      window.dispatchEvent(new Event("lpc:motion-ready"));
    };

    afterLoad(() => void setup());

    return () => {
      cancelled = true;
      if (unlock) clearTimeout(unlock);
      lockScroll(false);
      mm.revert();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
