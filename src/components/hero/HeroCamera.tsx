"use client";

import { useEffect, useRef } from "react";

/**
 * Pointer-driven "camera" for a hero. Writes --cx / --cy (-1..1, eased) on the
 * nearest [data-hero-root]; CSS turns them into 3D tilt on [data-hero-cam] and
 * layered depth on [data-hero-depth]. Desktop pointers only, off under reduced motion.
 */
export function HeroCamera() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>("[data-hero-root]");
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let inView = true;
    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      root.style.setProperty("--cx", x.toFixed(4));
      root.style.setProperty("--cy", y.toFixed(4));
      raf = Math.abs(tx - x) > 0.0005 || Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!inView) return;
      if (!root.hasAttribute("data-cam")) root.setAttribute("data-cam", "");
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <span ref={ref} hidden aria-hidden="true" />;
}
