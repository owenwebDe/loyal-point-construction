"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Expand, LineIcon } from "@/components/ui/Icons";
import { SampleTag } from "@/components/ui/SampleTag";
import type { IconName } from "@/content/site";
import { EASE, gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type BuildCard = {
  slug: string;
  title: string;
  icon: IconName;
  count: number;
  cover: { src: string; alt: string; blurDataURL: string; sample?: boolean };
};

const POP = 1.08;
const INTERVAL = 3.2; // seconds each card holds focus

/**
 * Auto-advancing 3D coverflow. Every INTERVAL the track glides one card left;
 * the card arriving in the centre turns to face you and pops (scale 1.08, slight
 * overshoot) while the others angle back into depth. Three copies of the set make the loop seamless.
 * Pauses on hover, focus, touch, offscreen and hidden tabs; swipe and arrows work too.
 */
export function BuildCarousel({ cards }: { cards: BuildCard[] }) {
  const n = cards.length;
  // The server renders one set; the two loop copies are added after mount (lighter HTML).
  const [full, setFull] = useState(false);
  useEffect(() => setFull(true), []);
  const slides = useMemo(
    () => (full ? [0, 1, 2] : [1]).flatMap((set) => cards.map((card, i) => ({ ...card, set, i }))),
    [cards, full],
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const index = useRef(n);
  const [active, setActive] = useState(0);
  const holds = useRef(new Set<string>());
  const timer = useRef<gsap.core.Tween | null>(null);
  const reduced = useRef(false);

  const items = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const xFor = useCallback((i: number) => {
    const viewport = viewportRef.current;
    const first = items()[0];
    if (!viewport || !first) return 0;
    const second = items()[1];
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    return viewport.clientWidth / 2 - (i * step + first.offsetWidth / 2);
  }, []);

  const go = useCallback(
    (to: number, animate = true) => {
      const track = trackRef.current;
      if (!track) return;
      index.current = to;
      setActive(((to % n) + n) % n);
      const cardsEls = items().map((li) => li.firstElementChild as HTMLElement);
      cardsEls.forEach((el, k) => el.toggleAttribute("data-active", k === to));

      // 3D coverflow: cards angle back into depth by their distance from the centre;
      // the centre card faces forward, comes towards you and pops.
      const pose = (k: number) => {
        const d = k - to;
        const far = Math.min(Math.abs(d), 4);
        return reduced.current
          ? { scale: k === to ? POP : 1, rotationY: 0, z: 0 }
          : { scale: k === to ? POP : 1, rotationY: gsap.utils.clamp(-36, 36, -d * 18), z: k === to ? 30 : -far * 55 };
      };

      if (!animate || reduced.current) {
        gsap.set(track, { x: xFor(to) });
        cardsEls.forEach((el, k) => gsap.set(el, pose(k)));
        return;
      }
      gsap.to(track, {
        x: xFor(to),
        duration: 0.9,
        ease: EASE,
        overwrite: true,
        onComplete: () => {
          // Stay in the middle copy so there is always a card either side.
          const i = index.current;
          const wrapped = i >= 2 * n ? i - n : i < n ? i + n : i;
          if (wrapped !== i) go(wrapped, false);
        },
      });
      cardsEls.forEach((el, k) =>
        gsap.to(el, {
          ...pose(k),
          duration: k === to ? 0.8 : 0.7,
          delay: k === to ? 0.3 : 0,
          ease: k === to ? "back.out(2.4)" : EASE,
          overwrite: true,
        }),
      );
    },
    [n, xFor],
  );

  const schedule = useCallback(() => {
    timer.current?.kill();
    const bar = progressRef.current;
    if (bar) gsap.killTweensOf(bar);
    if (reduced.current || holds.current.size) {
      if (bar) gsap.set(bar, { scaleX: 0 });
      return;
    }
    if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: INTERVAL, ease: "none" });
    timer.current = gsap.delayedCall(INTERVAL, () => {
      go(index.current + 1);
      schedule();
    });
  }, [go]);

  const hold = useCallback(
    (reason: string, on: boolean) => {
      if (on) holds.current.add(reason);
      else holds.current.delete(reason);
      schedule();
    },
    [schedule],
  );

  const step = (dir: 1 | -1) => {
    go(index.current + dir);
    schedule();
  };

  // Mount: position, autoplay, pause conditions.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const viewport = viewportRef.current;
    if (!viewport || !full) return;
    go(n, false);
    schedule();

    const onResize = () => go(index.current, false);
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) => hold("offscreen", !e.isIntersecting), { threshold: 0.25 });
    io.observe(viewport);
    const onVisibility = () => hold("hidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      timer.current?.kill();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [full, go, hold, n, schedule]);

  // Swipe: drag the track, release to move one card; suppress the click after a drag.
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    let startX = 0;
    let baseX = 0;
    let dx = 0;
    let down = false;
    let dragged = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      dragged = false;
      dx = 0;
      startX = e.clientX;
      baseX = Number(gsap.getProperty(track, "x"));
      hold("drag", true);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > 8) {
        dragged = true;
        viewport.setPointerCapture(e.pointerId);
      }
      if (dragged) gsap.set(track, { x: baseX + dx });
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (dragged) go(index.current + (dx < -50 ? 1 : dx > 50 ? -1 : 0));
      hold("drag", false);
    };
    const onClick = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };
    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onUp);
    viewport.addEventListener("click", onClick, true);
    return () => {
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("click", onClick, true);
    };
  }, [go, hold]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="What we build"
      onMouseEnter={() => hold("hover", true)}
      onMouseLeave={() => hold("hover", false)}
      onFocus={() => hold("focus", true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && hold("focus", false)}
    >
      <div
        ref={viewportRef}
        data-r="draw"
        className="-mx-6 touch-pan-y select-none overflow-hidden py-10 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] [perspective:1600px] lg:mx-0"
      >
        <div ref={trackRef} className="flex w-max will-change-transform [transform-style:preserve-3d]">
          {slides.map((slide) => {
            const clone = slide.set !== 1;
            return (
              <div
                key={`${slide.set}-${slide.slug}`}
                className="w-[min(66vw,272px)] shrink-0 pr-4 [transform-style:preserve-3d] sm:w-[272px]"
                aria-hidden={clone || undefined}
                inert={clone || undefined}
                role={clone ? undefined : "group"}
                aria-roledescription={clone ? undefined : "slide"}
                aria-label={clone ? undefined : `${slide.i + 1} of ${n}: ${slide.title}`}
              >
                <button
                  type="button"
                  data-lb-group={`cat:${slide.slug}`}
                  data-lb-index={0}
                  className="group relative flex h-[400px] w-full origin-center flex-col overflow-hidden rounded-card bg-surface text-left shadow-[0_24px_50px_-28px_rgb(0_0_0/0.75)] ring-1 ring-black/10 transition-[box-shadow] duration-500 ease-brand data-[active]:shadow-[0_0_0_1px_rgb(195_142_108/0.85),0_34px_70px_-26px_rgb(0_0_0/0.85),0_0_60px_-20px_rgb(195_142_108/0.55)] sm:h-[420px]"
                >
                  <span data-r="clip" className="relative block h-[56%] w-full overflow-hidden">
                    {slide.cover.sample && <SampleTag />}
                    <span data-r-inner className="absolute inset-0 block">
                      <Image
                        src={slide.cover.src}
                        alt={slide.cover.alt}
                        fill
                        draggable={false}
                        sizes="(min-width: 640px) 272px, 66vw"
                        placeholder="blur"
                        blurDataURL={slide.cover.blurDataURL}
                        className="object-cover transition-transform duration-[600ms] ease-brand group-hover:scale-[1.06]"
                      />
                    </span>
                    <span className="absolute inset-0 block bg-[linear-gradient(180deg,transparent_55%,rgb(26_31_39/0.9))]" />
                    <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-ink/55 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-data-[active]:opacity-100">
                      <Expand className="size-3.5" />
                    </span>
                  </span>
                  <span className="relative flex flex-1 flex-col items-center justify-center gap-3 px-4 pb-6 text-center">
                    <LineIcon name={slide.icon} className="size-9 text-copper-hi" />
                    <span className="display text-[1.4rem] leading-[1.02] text-white">{slide.title}</span>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-steel">
                      {slide.count} {slide.count === 1 ? "photo" : "photos"}
                    </span>
                    <span className="absolute inset-x-6 bottom-0 h-[2px] origin-left scale-x-0 bg-copper transition-transform duration-700 ease-brand group-data-[active]:scale-x-100" />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls: counter + title, countdown bar, dots, arrows */}
      <div className="mt-2 flex items-center gap-5">
        <p className="w-36 shrink-0 font-display font-semibold uppercase tracking-[0.1em] text-surface" aria-live="polite">
          <span className="text-copper-deep">{String(active + 1).padStart(2, "0")}</span>
          <span className="text-surface/50"> / {String(n).padStart(2, "0")}</span>
          <span className="mt-1 block truncate text-sm text-surface/75">{cards[active]?.title}</span>
        </p>
        <div className="flex flex-1 flex-col gap-3">
          <span className="relative block h-[2px] w-full overflow-hidden rounded-full bg-surface/15">
            <span ref={progressRef} className="absolute inset-0 block origin-left scale-x-0 bg-copper-deep" />
          </span>
          <div className="hidden gap-2 sm:flex">
            {cards.map((card, i) => (
              <button
                key={card.slug}
                type="button"
                aria-label={`Show ${card.title}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => {
                  const base = index.current - active;
                  go(base + i);
                  schedule();
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500 ease-brand",
                  i === active ? "w-7 bg-copper-deep" : "w-1.5 bg-surface/30 hover:bg-surface/60",
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
            className="grid size-11 place-items-center rounded-full border border-surface/25 text-surface transition-colors hover:border-copper-deep hover:bg-copper-deep hover:text-white"
          >
            <ArrowRight className="size-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
            className="grid size-11 place-items-center rounded-full border border-surface/25 text-surface transition-colors hover:border-copper-deep hover:bg-copper-deep hover:text-white"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
