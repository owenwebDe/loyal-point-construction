"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE, Flip, gsap, motionEnabled } from "@/lib/gsap";
import { lockScroll } from "@/lib/lenis";
import { featuredWork, galleryOrder, itemsInCategory, type WorkItem } from "@/lib/work";

const LightboxView = dynamic(() => import("./LightboxView"), { ssr: false });

/** Resolve a data-lb-group key into its ordered slides. */
function slidesFor(group: string): WorkItem[] {
  if (group === "featured") return featuredWork.map((f) => f.item);
  if (group.startsWith("cat:")) return itemsInCategory(group.slice(4));
  if (group.startsWith("gallery:")) {
    const f = group.slice(8);
    return f === "all" ? galleryOrder : galleryOrder.filter((i) => i.category === f);
  }
  return galleryOrder;
}

/** Where the slide image will sit once the lightbox is open (YARL's 16px padding, contain fit, never upscaled). */
function targetRect(item: WorkItem) {
  const pad = 16;
  const maxW = window.innerWidth - pad * 2;
  const maxH = window.innerHeight - pad * 2;
  const scale = Math.min(maxW / item.width, maxH / item.height, 1);
  const width = item.width * scale;
  const height = item.height * scale;
  return { left: (window.innerWidth - width) / 2, top: (window.innerHeight - height) / 2, width, height };
}

function ghostAt(src: string, rect: { left: number; top: number; width: number; height: number }) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.decoding = "sync";
  Object.assign(img.style, {
    position: "fixed",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    objectFit: "cover",
    borderRadius: "6px",
    zIndex: "10001",
    pointerEvents: "none",
    margin: "0",
  });
  document.body.appendChild(img);
  return img;
}

function boxAt(rect: { left: number; top: number; width: number; height: number }) {
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    pointerEvents: "none",
    visibility: "hidden",
  });
  document.body.appendChild(box);
  return box;
}

export function LightboxProvider() {
  const [state, setState] = useState<{ group: string; slides: WorkItem[]; index: number } | null>(null);
  const [open, setOpen] = useState(false);
  const ghost = useRef<HTMLImageElement | null>(null);
  const backdrop = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(0);

  const cleanupGhost = useCallback(() => {
    ghost.current?.remove();
    backdrop.current?.remove();
    ghost.current = null;
    backdrop.current = null;
  }, []);

  // Warm the lightbox chunk once the page is idle.
  useEffect(() => {
    const load = () => void import("./LightboxView");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(load, 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-lb-group]");
      if (!trigger) return;
      event.preventDefault();
      const group = trigger.dataset.lbGroup!;
      const slides = slidesFor(group);
      const index = Math.max(0, Math.min(Number(trigger.dataset.lbIndex ?? 0), slides.length - 1));
      if (!slides.length) return;
      indexRef.current = index;
      setState({ group, slides, index });
      lockScroll(true);

      const thumb = trigger.querySelector("img");
      const item = slides[index];
      if (!thumb || !motionEnabled()) {
        setOpen(true);
        return;
      }

      // Flip zoom from the thumbnail to the lightbox slot.
      const from = thumb.getBoundingClientRect();
      const full = new Image();
      full.src = item.src;
      cleanupGhost();
      const shade = document.createElement("div");
      Object.assign(shade.style, {
        position: "fixed",
        inset: "0",
        background: "rgb(6 9 13 / 0.94)",
        opacity: "0",
        zIndex: "10000",
        pointerEvents: "none",
      });
      document.body.appendChild(shade);
      backdrop.current = shade;
      ghost.current = ghostAt(thumb.currentSrc || thumb.src, from);
      const dest = boxAt(targetRect(item));

      gsap.to(shade, { opacity: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(ghost.current, { borderRadius: 0, duration: 0.7, ease: EASE });
      Flip.fit(ghost.current, dest, {
        scale: false,
        duration: 0.7,
        ease: EASE,
        onComplete: () => {
          dest.remove();
          setOpen(true);
          const reveal = () =>
            gsap.to([ghost.current, backdrop.current], {
              opacity: 0,
              duration: 0.25,
              delay: 0.12,
              onComplete: cleanupGhost,
            });
          if (full.complete) reveal();
          else {
            full.onload = reveal;
            full.onerror = reveal;
          }
        },
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [cleanupGhost]);

  // Fly the current slide back to its thumbnail.
  const onExiting = useCallback(() => {
    if (!state || !motionEnabled()) return;
    const current = document.querySelector<HTMLImageElement>(".yarl__slide_current .yarl__slide_image");
    const index = indexRef.current;
    const trigger =
      document.querySelector<HTMLElement>(`[data-lb-group="${state.group}"][data-lb-index="${index}"]`) ??
      document.querySelector<HTMLElement>(`[data-lb-group="${state.group}"]`);
    const thumb = trigger?.querySelector("img");
    if (!current || !thumb) return;
    const to = thumb.getBoundingClientRect();
    if (to.bottom < 0 || to.top > window.innerHeight) return;
    const from = current.getBoundingClientRect();
    cleanupGhost();
    const g = ghostAt(current.currentSrc || current.src, from);
    g.style.borderRadius = "0";
    ghost.current = g;
    const dest = boxAt(to);
    gsap.to(g, { borderRadius: 6, duration: 0.55, ease: EASE });
    Flip.fit(g, dest, {
      scale: false,
      duration: 0.55,
      ease: EASE,
      onComplete: () => {
        dest.remove();
        gsap.to(g, { opacity: 0, duration: 0.15, onComplete: cleanupGhost });
      },
    });
  }, [state, cleanupGhost]);

  const close = useCallback(() => {
    setOpen(false);
    lockScroll(false);
  }, []);

  if (!state) return null;
  return (
    <LightboxView
      open={open}
      slides={state.slides}
      index={state.index}
      onClose={close}
      onExiting={onExiting}
      onView={(i) => {
        indexRef.current = i;
      }}
    />
  );
}
