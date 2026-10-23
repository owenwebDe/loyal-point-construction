"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Expand } from "@/components/ui/Icons";
import { SampleTag } from "@/components/ui/SampleTag";
import { site } from "@/content/site";
import { EASE, Flip, gsap, motionEnabled, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { galleryOrder, type WorkItem } from "@/lib/work";

// "other" holds custom one-off fabrication (frames, canopies) that isn't one of the nine services.
const categories = [...site.services.map((s) => ({ slug: s.slug, title: s.title })), { slug: "other", title: "Fabrication" }];
const labels: Record<string, string> = Object.fromEntries(categories.map((c) => [c.slug, c.title]));

/**
 * Balanced masonry: each photo goes into the currently shortest column (aspect ratios are
 * known), so the first photos, the client's own work, form the top row left to right.
 */
function packColumns(items: WorkItem[], n: number) {
  const cols: WorkItem[][] = Array.from({ length: n }, () => []);
  const heights = new Array<number>(n).fill(0);
  for (const item of items) {
    const c = heights.indexOf(Math.min(...heights));
    cols[c].push(item);
    heights[c] += item.height / item.width;
  }
  return cols;
}

/** Projects gallery: filter chips (GSAP Flip), masonry at native aspect ratios, lightbox on click. */
export function Gallery() {
  const [filter, setFilter] = useState("all");
  const [filtered, setFiltered] = useState(false); // once filtered, tiles skip the scroll reveal
  const listRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const busy = useRef(false);

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of galleryOrder) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    return [
      { slug: "all", label: "All", count: galleryOrder.length },
      ...categories.filter((c) => counts.get(c.slug)).map((c) => ({ slug: c.slug, label: c.title, count: counts.get(c.slug)! })),
    ];
  }, []);

  const visible = (category: string, f = filter) => f === "all" || category === f;
  const shown = galleryOrder.filter((i) => visible(i.category));

  // Staggered reveal (80ms) as tiles enter.
  useGSAP(
    () => {
      if (!motionEnabled()) return;
      ScrollTrigger.batch("[data-r='gallery']", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE }),
      });
    },
    { scope: listRef },
  );

  /** Tiles in the layout currently on screen (2 columns below 1024px, 3 above). */
  const activeTiles = () => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const layout = listRef.current?.querySelector(`[data-layout='${wide ? 3 : 2}']`);
    return Array.from(layout?.querySelectorAll<HTMLElement>("[data-tile]") ?? []);
  };

  const choose = (next: string) => {
    if (next === filter || busy.current) return;
    if (!motionEnabled()) {
      setFilter(next);
      return;
    }
    busy.current = true;
    const tiles = activeTiles();
    gsap.set(tiles, { opacity: 1, y: 0 });
    const leaving = tiles.filter((el) => !visible(el.dataset.category!, next));
    gsap.to(leaving, {
      opacity: 0,
      scale: 0.94,
      duration: leaving.length ? 0.25 : 0,
      ease: "power2.in",
      onComplete: () => {
        flipState.current = Flip.getState(tiles.filter((el) => visible(el.dataset.category!, next)));
        setFiltered(true);
        setFilter(next);
      },
    });
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    const tiles = activeTiles();
    gsap.set(tiles, { opacity: 1, y: 0, clearProps: "scale" });
    // Tiles may have moved to another column (new DOM nodes): Flip matches them by data-flip-id.
    Flip.from(state, {
      targets: tiles,
      duration: 0.7,
      ease: EASE,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, ease: EASE }),
      onComplete: () => {
        busy.current = false;
        ScrollTrigger.refresh();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const tile = (item: WorkItem) => (
    <li
      key={item.id}
      data-tile
      data-flip-id={item.id}
      data-category={item.category}
      data-r={filtered ? undefined : "gallery"}
    >
      <button
        type="button"
        data-lb-group={`gallery:${filter}`}
        data-lb-index={shown.indexOf(item)}
        className="group relative block w-full overflow-hidden rounded-card bg-surface"
      >
        {item.source === "placeholder" && <SampleTag />}
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(min-width: 1024px) 400px, 50vw"
          className="h-auto w-full transition-transform duration-[600ms] ease-brand group-hover:scale-[1.06]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgb(10_15_21/0.85))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute inset-x-4 bottom-4 flex items-center justify-between opacity-0 transition-[opacity,transform] duration-500 ease-brand group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0">
          <span className="eyebrow text-[0.75rem] text-white">{labels[item.category] ?? "Fabrication"}</span>
          <Expand className="size-4 text-copper-hi" />
        </span>
      </button>
    </li>
  );

  return (
    <section id="work" aria-label="All projects" className="relative bg-ink pb-24 pt-10 lg:pb-32 lg:pt-14">
      <div className="container-x">
        <div
          role="group"
          aria-label="Filter photos"
          data-r="fade-up"
          className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((f) => {
            const on = f.slug === filter;
            return (
              <button
                key={f.slug}
                type="button"
                aria-pressed={on}
                onClick={() => choose(f.slug)}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 font-display text-[0.875rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300",
                  on ? "border-copper bg-copper-fill text-white" : "border-white/12 text-white/70 hover:border-white/30 hover:text-white",
                )}
              >
                {f.label}
                <span className={cn("text-xs", on ? "text-white/75" : "text-steel")}>{f.count}</span>
              </button>
            );
          })}
        </div>

        <div ref={listRef} className="mt-10 lg:mt-12">
          <div data-layout="2" className="grid grid-cols-2 items-start gap-3 lg:hidden">
            {packColumns(shown, 2).map((col, c) => (
              <ul key={c} className="flex flex-col gap-3">
                {col.map(tile)}
              </ul>
            ))}
          </div>
          <div data-layout="3" className="hidden grid-cols-3 items-start gap-4 lg:grid">
            {packColumns(shown, 3).map((col, c) => (
              <ul key={c} className="flex flex-col gap-4">
                {col.map(tile)}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
