"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger, motionEnabled } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (!motionEnabled()) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
