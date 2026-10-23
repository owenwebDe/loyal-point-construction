"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import door1 from "@/assets/products/door1.webp";
import door2 from "@/assets/products/door2.webp";
import door3 from "@/assets/products/door3.webp";
import { cn } from "@/lib/utils";

type Door = {
  img: StaticImageData;
  alt: string;
  caption: string;
  left: string;
  height: string;
  depth: number;
  /** Resting turn in degrees: side doors face inward, like a showroom display. */
  ry: number;
  delay: string;
  z: string;
};

// The client's real doors, cut out of their yard photos (scripts/cutout.py).
const DOORS: Door[] = [
  { img: door3, alt: "Dark brown steel safety door with gold handle", caption: "Gold handle", left: "22%", height: "60%", depth: 10, ry: 18, delay: "0s", z: "z-0" },
  { img: door2, alt: "Double steel safety door, open, glossy brown", caption: "Double door", left: "50%", height: "70%", depth: 4, ry: 0, delay: "0.7s", z: "z-10" },
  { img: door1, alt: "Glossy brown steel safety door with chrome handle", caption: "Chrome handle", left: "78%", height: "62%", depth: 10, ry: -18, delay: "1.4s", z: "z-0" },
];

/**
 * 3D product stage for the safety doors: real cut-outs on a dark reflective floor,
 * side doors turned inward, a specular light sweep masked to each door, and the
 * doors rotating in perspective with the pointer on desktop.
 */
export function Showroom({ className, captions = true }: { className?: string; captions?: boolean }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
      raf = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={stage}
      role="img"
      aria-label="Three Loyal Point steel safety doors: a single door with gold handle, a double door, and a single door with chrome handle"
      className={cn(
        "relative isolate aspect-[5/4] w-full overflow-hidden rounded-card bg-[radial-gradient(120%_90%_at_50%_30%,#2b3038_0%,#141920_55%,#0a0f15_100%)] ring-1 ring-white/[0.06]",
        className,
      )}
      style={{ "--mx": 0, "--my": 0, perspective: "1100px" } as React.CSSProperties}
    >
      {/* Top light */}
      <div className="pointer-events-none absolute inset-x-[15%] -top-[20%] h-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(255_236_214/0.12),transparent)] blur-2xl" />
      {/* Floor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] border-t border-copper-hi/25 bg-[linear-gradient(180deg,rgb(26_31_39/0.9),rgb(10_15_21/0.2))]" />

      {DOORS.map((door) => (
        <figure
          key={door.caption}
          className={cn("absolute bottom-[16%]", door.z)}
          style={{
            left: door.left,
            height: door.height,
            aspectRatio: `${door.img.width} / ${door.img.height}`,
            transform: `translate3d(calc(-50% + var(--mx) * ${door.depth}px), calc(var(--my) * ${door.depth * 0.5}px), 0) rotateY(calc(${door.ry}deg + var(--mx) * -9deg)) rotateX(calc(var(--my) * 3deg))`,
          }}
        >
          <span className="pointer-events-none absolute -inset-[30%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(180_127_87/0.22),transparent)] blur-xl" />
          <span className="pointer-events-none absolute -bottom-[3%] left-[-12%] right-[-12%] h-[7%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.75),transparent)] blur-[6px]" />
          <Image src={door.img} alt="" fill sizes="(min-width: 1024px) 18vw, 30vw" className="object-contain" />
          {/* Specular sweep, clipped to the door's own outline */}
          <span
            aria-hidden="true"
            className="gloss-sweep pointer-events-none absolute inset-0"
            style={{
              animationDelay: door.delay,
              maskImage: `url(${door.img.src})`,
              WebkitMaskImage: `url(${door.img.src})`,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          />
          {/* Reflection */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-full h-full scale-y-[-1] opacity-20 [mask-image:linear-gradient(0deg,#000_0%,transparent_32%)]"
          >
            <Image src={door.img} alt="" fill sizes="(min-width: 1024px) 18vw, 30vw" className="object-contain" />
          </span>
          {captions && (
            <figcaption className="absolute left-1/2 top-[calc(100%+12%)] hidden -translate-x-1/2 whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/55 sm:block">
              {door.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
