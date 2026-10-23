"use client";

import Image from "next/image";
import finishDoor from "@/assets/products/door2.webp";
import { useRef, useState } from "react";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { broll, type Clip } from "@/content/media";
import { site } from "@/content/site";
import { gsap, motionEnabled, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Photo = { src: string; alt: string; width: number; height: number; blurDataURL: string };
type StepMedia = { kind: "clip"; clip: Clip } | { kind: "photo"; photo: Photo } | { kind: "finish"; photo: Photo };

/**
 * Scroll story: Measure -> Cut -> Bend -> Weld -> Finish. On desktop the section pins and
 * each step's media wipes up over the last while the step list tracks progress.
 * Phones get a plain stacked version (no pinning).
 */
export function HowWeWork({ weld, finish }: { weld?: Photo; finish?: Photo }) {
  const { eyebrow, title, steps } = site.home.process;
  const media: Record<string, StepMedia> = {
    measure: { kind: "clip", clip: broll.measuring },
    cut: { kind: "clip", clip: broll.grinder },
    bend: { kind: "clip", clip: broll.bending },
    // Real work where we have it: the client's welded door before paint, then finished.
    weld: weld ? { kind: "photo", photo: weld } : { kind: "clip", clip: broll.weldingPortrait },
    finish: finish ? { kind: "finish", photo: finish } : { kind: "clip", clip: broll.welding },
  };

  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const pin = pinRef.current;
      if (!pin || !motionEnabled()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const layers = gsap.utils.toArray<HTMLElement>("[data-step-layer]", pin);
        const inners = layers.map((l) => l.querySelector("[data-step-inner]"));
        gsap.set(layers.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(inners.slice(1), { scale: 1.18 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${(layers.length - 1) * window.innerHeight * 0.9}`,
            pin: true,
            scrub: 0.6,
            snap: { snapTo: 1 / (layers.length - 1), directional: false, inertia: false, delay: 0.15, duration: { min: 0.25, max: 0.7 }, ease: "power2.inOut" },
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.round(self.progress * (layers.length - 1))),
          },
        });
        layers.slice(1).forEach((layer, n) => {
          tl.to(layer, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, n).to(inners[n + 1], { scale: 1, duration: 1 }, n);
        });
        tl.to("[data-step-progress]", { scaleY: 1, duration: layers.length - 1 }, 0);
        // The frame turns slowly in 3D across the whole story.
        tl.fromTo(
          "[data-step-frame]",
          { rotationY: 7, rotationX: 3, transformPerspective: 1600 },
          { rotationY: -7, rotationX: -2, duration: layers.length - 1 },
          0,
        );
      });
      return () => mm.revert();
    },
    { scope: pinRef },
  );

  const renderMedia = (key: string, isActive: boolean, sizes: string) => {
    const m = media[key];
    if (m.kind === "clip")
      return (
        <LoopVideo
          src={m.clip.src}
          webm={m.clip.webm}
          poster={m.clip.poster}
          sizes={sizes}
          objectPosition={m.clip.position}
          playing={isActive}
        />
      );
    if (m.kind === "photo")
      return (
        <Image
          src={m.photo.src}
          alt={m.photo.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={m.photo.blurDataURL}
          className="object-cover"
        />
      );
    // Finish: the client's door cut out on a dark stage, light sweeping across the gloss.
    return (
      <span className="absolute inset-0 isolate block bg-[radial-gradient(110%_80%_at_50%_30%,#2b3038_0%,#141920_55%,#0a0f15_100%)]">
        <span className="absolute inset-x-0 bottom-0 h-[14%] border-t border-copper-hi/25 bg-[linear-gradient(180deg,rgb(26_31_39/0.9),transparent)]" />
        <span
          className="absolute bottom-[14%] left-1/2 block h-[76%] -translate-x-1/2"
          style={{ aspectRatio: `${finishDoor.width} / ${finishDoor.height}` }}
        >
          <span className="absolute -inset-[30%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(180_127_87/0.25),transparent)] blur-xl" />
          <Image src={finishDoor} alt={m.photo.alt} fill sizes={sizes} className="object-contain" />
          <span
            aria-hidden="true"
            className="gloss-sweep absolute inset-0"
            style={{
              maskImage: `url(${finishDoor.src})`,
              WebkitMaskImage: `url(${finishDoor.src})`,
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          />
          <span className="absolute -bottom-[2%] left-[-14%] right-[-14%] h-[5%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.75),transparent)] blur-[6px]" />
        </span>
      </span>
    );
  };

  return (
    <section aria-label={eyebrow} className="relative bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(180_127_87/0.4),transparent)]" />

      {/* Desktop with motion on: pinned story. Reduced motion uses the stacked layout below. */}
      <div ref={pinRef} className="hidden h-[100svh] min-h-[640px] [.motion_&]:lg:block">
        <div className="container-x grid h-full grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-16 pt-[72px]">
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} />
            <div className="relative mt-[clamp(1.5rem,5vh,3rem)] pl-8">
              <span aria-hidden="true" className="absolute bottom-2 left-0 top-2 w-px bg-white/10" />
              <span
                data-step-progress
                aria-hidden="true"
                className="absolute bottom-2 left-0 top-2 w-px origin-top scale-y-0 bg-copper"
              />
              <ol className="space-y-[clamp(0.6rem,2.4vh,1.75rem)]">
              {steps.map((step, n) => (
                <li
                  key={step.key}
                  aria-current={n === active ? "step" : undefined}
                  className={cn(
                    "transition-[opacity,transform] duration-500 ease-brand",
                    n === active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-35",
                  )}
                >
                  <span className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline">
                    <span className={cn("font-display text-sm font-semibold tracking-[0.14em]", n === active ? "text-copper" : "text-steel")}>
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <span className="display text-[clamp(2rem,4.6vh,2.75rem)] text-white">{step.title}</span>
                    <span className="col-start-2 mt-1 text-[0.9375rem] text-text-hi">{step.text}</span>
                  </span>
                </li>
              ))}
              </ol>
            </div>
          </div>

          <div
            data-step-frame
            className="relative mx-auto aspect-[4/5] h-[min(72vh,680px)] overflow-hidden rounded-card shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.08] will-change-transform"
          >
            {steps.map((step, n) => (
              <div key={step.key} data-step-layer className="absolute inset-0" style={{ zIndex: n }}>
                <div data-step-inner className="absolute inset-0 will-change-transform">
                  {renderMedia(step.key, n === active, "(min-width: 1024px) 40vw, 100vw")}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(10_15_21/0.7))]" />
                <span className="absolute bottom-6 left-6 font-display text-sm font-semibold uppercase tracking-[0.16em] text-white/85">
                  {String(n + 1).padStart(2, "0")} · {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phones, tablets and reduced motion: stacked */}
      <div className="container-x py-20 [.motion_&]:lg:hidden">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <ol className="mt-12 space-y-12">
          {steps.map((step, n) => (
            <li key={step.key}>
              <div data-r="clip" className="relative aspect-[4/3] overflow-hidden rounded-card ring-1 ring-white/[0.08] sm:aspect-[16/9]">
                <div data-r-inner className="absolute inset-0">
                  {renderMedia(step.key, true, "100vw")}
                </div>
              </div>
              <div data-r="fade-up" className="mt-5 flex items-baseline gap-4">
                <span className="font-display text-sm font-semibold tracking-[0.14em] text-copper">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="display block text-[2.25rem] text-white">{step.title}</span>
                  <span className="mt-1 block text-[0.9375rem] text-text-hi">{step.text}</span>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
