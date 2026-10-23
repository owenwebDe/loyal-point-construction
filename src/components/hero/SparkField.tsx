"use client";

import { useEffect, useRef } from "react";

type Ember = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  ttl: number;
  phase: number;
  streak: boolean;
};

/**
 * Desktop embers drifting up out of the weld, drawn with additive blending
 * (90 particles). Phones get the CSS <Embers /> layer (35). Off under reduced
 * motion and paused while the hero is offscreen or the tab is hidden.
 */
export function SparkField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phones use the CSS <Embers /> layer; software-rasterised canvas is too costly there.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const small = false;
    const COUNT = small ? 35 : 90;
    // Phones: 1x backing store and 30fps keep each frame well under budget.
    const dpr = small ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    const minFrame = small ? 1000 / 30 : 0;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = true;

    // Pre-rendered glow sprite: white-hot core into orange falloff.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const s = sprite.getContext("2d")!;
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,246,228,1)");
    g.addColorStop(0.12, "rgba(255,196,120,0.95)");
    g.addColorStop(0.35, "rgba(255,138,43,0.35)");
    g.addColorStop(1, "rgba(255,90,10,0)");
    s.fillStyle = g;
    s.fillRect(0, 0, 64, 64);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    // Embers rise from the weld zone (right of centre on desktop) but drift everywhere.
    const spawnX = () => (small ? rand(0.15, 0.95) : Math.random() < 0.7 ? rand(0.42, 0.9) : rand(0.05, 1)) * w;

    const make = (initial: boolean): Ember => {
      const streak = Math.random() < 0.12;
      return {
        x: spawnX(),
        y: initial ? rand(0.1, 1.05) * h : h * rand(0.75, 1.05),
        vx: rand(-10, 18),
        vy: -rand(18, 60) * (streak ? 3 : 1),
        size: rand(0.6, 2.2) * (streak ? 0.8 : 1),
        life: initial ? rand(0, 4) : 0,
        ttl: rand(3, 7),
        phase: rand(0, Math.PI * 2),
        streak,
      };
    };
    const embers = Array.from({ length: COUNT }, () => make(true));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      raf = 0;
      if (last && now - last < minFrame - 1) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life += dt;
        if (e.life >= e.ttl || e.y < -20) {
          embers[i] = make(false);
          continue;
        }
        const sway = Math.sin(now / 900 + e.phase) * 14;
        e.x += (e.vx + sway) * dt;
        e.y += e.vy * dt;
        e.vy *= 0.999;

        const t = e.life / e.ttl;
        const fade = Math.min(1, t * 6) * (1 - t) ** 1.4;
        const flicker = 0.75 + 0.25 * Math.sin(now / 70 + e.phase * 3);
        const alpha = fade * flicker;
        if (alpha <= 0.01) continue;

        ctx.globalAlpha = alpha;
        const r = e.size * 6;
        if (e.streak) {
          const len = Math.min(26, Math.abs(e.vy) * 0.12);
          ctx.strokeStyle = "rgba(255,170,90,0.9)";
          ctx.lineWidth = e.size;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.x - (e.vx + sway) * 0.05, e.y + len);
          ctx.stroke();
        }
        ctx.drawImage(sprite, e.x - r, e.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    let started = false;
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && started) start();
    });
    const onVis = () => started && start();
    // Begin after the page has loaded so the embers never compete with first render.
    const boot = () => {
      started = true;
      resize();
      ro.observe(canvas);
      io.observe(canvas);
      document.addEventListener("visibilitychange", onVis);
      start();
    };
    const onLoad = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(boot, { timeout: 1000 }) : setTimeout(boot, 1);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
