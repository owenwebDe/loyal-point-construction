"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const SOURCES = {
  landscape: { webm: "/media/hero/hero-1280-fa0aa609.webm", mp4: "/media/hero/hero-1280-555348bf.mp4" },
  portrait: { webm: "/media/hero/hero-portrait-0776a8da.webm", mp4: "/media/hero/hero-portrait-bfd5489b.mp4" },
};

/**
 * The welding loop. Loaded after the window load event so the poster stays the
 * LCP image; portrait phones get the dedicated 9:16 clip. Plays muted, inline,
 * looped, pauses offscreen, and has a visible pause control.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<{ webm?: string; mp4: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const pick = () => {
      const set = window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches
        ? SOURCES.portrait
        : SOURCES.landscape;
      // Every iOS browser and Safari is WebKit, where VP9 WebM is unreliable: H.264 only.
      const apple = /Apple/.test(navigator.vendor);
      setSrc(apple ? { mp4: set.mp4 } : set);
    };
    const idle = (fn: () => void) =>
      "requestIdleCallback" in window ? window.requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200);
    if (document.readyState === "complete") idle(pick);
    else window.addEventListener("load", () => idle(pick), { once: true });
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!src || !video) return;

    const tryPlay = () => {
      // Belt and braces for mobile autoplay rules: muted + inline as properties too.
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      return video.play();
    };
    // Low Power Mode / Data Saver block autoplay; a tap anywhere counts as permission.
    const resume = () => {
      if (!userPaused.current) tryPlay().then(() => setPaused(false)).catch(() => {});
    };

    video.load();
    tryPlay()
      .then(() => setPaused(false))
      .catch(() => {
        setPaused(true);
        window.addEventListener("touchend", resume, { once: true, passive: true });
        window.addEventListener("click", resume, { once: true });
      });

    const io = new IntersectionObserver(([entry]) => {
      if (userPaused.current) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => {
      io.disconnect();
      window.removeEventListener("touchend", resume);
      window.removeEventListener("click", resume);
    };
  }, [src]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().then(() => setPaused(false)).catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
      setPaused(true);
    }
  };

  return (
    <>
      <video
        ref={ref}
        muted
        autoPlay
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setReady(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-[50%_50%] md:object-[56%_50%] transition-opacity duration-[1400ms] ease-brand",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {src && (
          <>
            {src.webm && <source src={src.webm} type='video/webm; codecs="vp9"' />}
            <source src={src.mp4} type="video/mp4" />
          </>
        )}
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="pointer-events-auto absolute bottom-6 right-6 z-20 grid size-10 place-items-center rounded-full border border-white/20 bg-ink/40 text-white/80 backdrop-blur-md transition-colors hover:border-white/50 hover:text-white lg:bottom-8 lg:right-12"
      >
        {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
      </button>
    </>
  );
}
