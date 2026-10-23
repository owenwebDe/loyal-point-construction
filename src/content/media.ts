import type { StaticImageData } from "next/image";
import grinderPoster from "@/assets/broll-grinder-poster.jpg";
import bendingPoster from "@/assets/broll-bending-poster.jpg";
import measuringPoster from "@/assets/broll-measuring-poster.jpg";
import weldingPoster from "@/assets/hero-poster.jpg";
import weldingPortraitPoster from "@/assets/hero-poster-portrait.jpg";

export type Clip = {
  src: { small: string; large: string };
  webm?: { small: string; large: string };
  poster: StaticImageData;
  /** Best crop when the frame is narrower than the clip. */
  position: string;
};

/** Workshop B-roll loops (see VIDEO-PROMPTS.md). Process footage only, never the client's products. */
export const broll = {
  grinder: {
    src: { small: "/media/broll/grinder-640-77772cee.mp4", large: "/media/broll/grinder-1280-65a9ad95.mp4" },
    poster: grinderPoster,
    position: "28% 55%",
  },
  bending: {
    src: { small: "/media/broll/bending-640-2cb17e66.mp4", large: "/media/broll/bending-1280-ba05519c.mp4" },
    webm: { small: "/media/broll/bending-640-8902bac6.webm", large: "/media/broll/bending-1280-e2941825.webm" },
    poster: bendingPoster,
    position: "42% 50%",
  },
  measuring: {
    src: { small: "/media/broll/measuring-640-da5205e5.mp4", large: "/media/broll/measuring-1280-ccb62bb8.mp4" },
    webm: { small: "/media/broll/measuring-640-1b3ad25d.webm", large: "/media/broll/measuring-1280-2259f5a2.webm" },
    poster: measuringPoster,
    position: "48% 55%",
  },
  welding: {
    src: { small: "/media/broll/welding-640-7217e003.mp4", large: "/media/hero/hero-1280-555348bf.mp4" },
    poster: weldingPoster,
    position: "46% 60%",
  },
  weldingPortrait: {
    src: { small: "/media/hero/hero-portrait-bfd5489b.mp4", large: "/media/hero/hero-portrait-bfd5489b.mp4" },
    webm: { small: "/media/hero/hero-portrait-0776a8da.webm", large: "/media/hero/hero-portrait-0776a8da.webm" },
    poster: weldingPortraitPoster,
    position: "50% 50%",
  },
} satisfies Record<string, Clip>;

/** Stand-in hero footage for services that don't have the client's photos yet. */
export const serviceClip: Record<string, Clip> = {
  "iron-burglary": broll.welding,
  windows: broll.welding,
  containers: broll.welding,
  "general-repairs": broll.grinder,
  "iron-bending": broll.bending,
  "pillars-columns": broll.bending,
  beams: broll.bending,
  decking: broll.bending,
  "safety-doors": broll.welding,
};
