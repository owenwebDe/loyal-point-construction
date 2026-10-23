"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Sources = { small: string; large: string };

type Props = {
  /** MP4 sources: `small` for phones and small slots, `large` otherwise. */
  src: Sources;
  /** Optional WebM versions, used where smaller; Apple devices always get MP4. */
  webm?: Sources;
  poster: StaticImageData;
  sizes: string;
  className?: string;
  objectPosition?: string;
  /** When set, plays only while true (e.g. the active step of a sequence). */
  playing?: boolean;
  /** Load the poster eagerly (page heroes). */
  priority?: boolean;
};

/**
 * Decorative B-roll loop. Shows the poster first and only fetches the video
 * when it comes within reach of the viewport, so it never competes with page
 * load. Muted, inline, looped; pauses offscreen; stays on the poster under
 * reduced motion.
 */
export function LoopVideo({
  src,
  webm,
  poster,
  sizes,
  className,
  objectPosition = "50% 50%",
  playing,
  priority,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        const small = window.innerWidth < 1024 || wrap.clientWidth * (window.devicePixelRatio || 1) <= 700;
        const set = webm && !/Apple/.test(navigator.vendor) ? webm : src;
        setUrl(small ? set.small : set.large);
      },
      { rootMargin: "300px 0px" },
    );
    near.observe(wrap);
    return () => near.disconnect();
  }, [src, webm]);

  const visible = useRef(false);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const video = videoRef.current;
    if (!url || !video) return;
    video.muted = true;
    video.playsInline = true;
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (entry.isIntersecting && playingRef.current !== false) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || playing === undefined) return;
    if (playing && visible.current) video.play().catch(() => {});
    else if (!playing) video.pause();
  }, [playing, url]);

  return (
    <div ref={wrapRef} className={cn("absolute inset-0", className)}>
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className="object-cover"
        style={{ objectPosition }}
      />
      {url && (
        <video
          ref={videoRef}
          src={url}
          muted
          loop
          playsInline
          autoPlay={playing !== false}
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-brand",
            ready ? "opacity-100" : "opacity-0",
          )}
          style={{ objectPosition }}
        />
      )}
    </div>
  );
}
