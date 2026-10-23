"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LineIcon } from "@/components/ui/Icons";
import type { IconName } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type IndexRow = {
  slug: string;
  title: string;
  short: string;
  icon: IconName;
  preview: { src: string; blurDataURL?: string };
};

/**
 * Editorial service index. On desktop a preview image follows the cursor and
 * swaps as you move between rows; on touch it's a plain list.
 */
export function ServicesIndex({ rows }: { rows: IndexRow[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
    const y = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
    const onMove = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    list.addEventListener("pointermove", onMove);
    return () => list.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    gsap.to(preview, {
      autoAlpha: hover === null ? 0 : 1,
      scale: hover === null ? 0.85 : 1,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [hover]);

  return (
    <div className="relative">
      <ol ref={listRef} onPointerLeave={() => setHover(null)} className="border-t border-white/10">
        {rows.map((row, n) => (
          <li key={row.slug} data-r="fade-up" className="border-b border-white/10">
            <Link
              href={`/services/${row.slug}`}
              onPointerEnter={() => setHover(n)}
              onFocus={() => setHover(null)}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)_2.75rem] items-center gap-4 py-6 sm:gap-6 lg:grid-cols-[4rem_minmax(0,1.15fr)_minmax(0,1fr)_3.5rem] lg:py-8"
            >
              <span className="font-display text-sm font-semibold tracking-[0.14em] text-steel transition-colors group-hover:text-copper">
                {String(n + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 items-center gap-4">
                <LineIcon name={row.icon} draw={false} className="size-9 shrink-0 text-copper lg:hidden" />
                <span className="min-w-0">
                  <span className="display block text-[clamp(1.6rem,4.2vw,4rem)] leading-[0.95] text-white transition-[transform,color] duration-500 ease-brand group-hover:translate-x-3 group-hover:text-copper-hi lg:truncate">
                    {row.title}
                  </span>
                  <span className="mt-1.5 block text-sm text-steel lg:hidden">{row.short}</span>
                </span>
              </span>
              <span className="hidden text-[0.9375rem] leading-relaxed text-text-hi lg:block">{row.short}</span>
              <span className="grid size-11 place-items-center justify-self-end rounded-full border border-white/15 text-white transition-[background-color,border-color,transform] duration-500 ease-brand group-hover:rotate-45 group-hover:border-copper group-hover:bg-copper-fill lg:size-14">
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Cursor-following preview (desktop) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[340px] w-[270px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card opacity-0 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10 lg:block"
        style={{ marginLeft: 150, marginTop: -40 }}
      >
        {rows.map((row, n) => (
          <span
            key={row.slug}
            className={cn(
              "absolute inset-0 block transition-[opacity,transform] duration-500 ease-brand",
              hover === n ? "scale-100 opacity-100" : "scale-110 opacity-0",
            )}
          >
            <Image
              src={row.preview.src}
              alt=""
              fill
              sizes="270px"
              placeholder={row.preview.blurDataURL ? "blur" : "empty"}
              blurDataURL={row.preview.blurDataURL}
              className="object-cover"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
