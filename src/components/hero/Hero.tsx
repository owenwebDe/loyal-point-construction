import { getImageProps } from "next/image";
import { preload } from "react-dom";
import Noise from "@/components/bits/Noise";
import { Blueprint } from "@/components/ui/Blueprint";
import { ButtonLink } from "@/components/ui/Button";
import posterPortrait from "@/assets/hero-poster-portrait.jpg";
import poster from "@/assets/hero-poster.jpg";
import { site } from "@/content/site";
import { Embers } from "./Embers";
import { HeroCamera } from "./HeroCamera";
import { HeroVideo } from "./HeroVideo";
import { SparkField } from "./SparkField";

export function Hero() {
  // Art-directed poster: 9:16 crop on portrait phones, 16:9 elsewhere. This is the LCP image.
  const common = { alt: "", priority: true, quality: 75 } as const;
  const PORTRAIT = "(max-width: 767px) and (orientation: portrait)";
  const { props: portrait } = getImageProps({ ...common, src: posterPortrait, sizes: "100vw" });
  const { props: landscape } = getImageProps({
    ...common,
    src: poster,
    sizes: "(min-width: 1024px) 74vw, 100vw",
  });
  // getImageProps doesn't preload; fetch only the poster this screen will use.
  preload(portrait.src, { as: "image", imageSrcSet: portrait.srcSet, imageSizes: "100vw", media: PORTRAIT, fetchPriority: "high" });
  preload(landscape.src, { as: "image", imageSrcSet: landscape.srcSet, imageSizes: landscape.sizes, media: `not all and ${PORTRAIT}`, fetchPriority: "high" });

  return (
    <section
      data-hero-root
      aria-label="Introduction"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-ink lg:min-h-[700px]"
    >
      {/* Media: right side on desktop, bleeding into the dark left through a mask. */}
      <div
        data-hero-media
        className="absolute inset-0 origin-[70%_50%] will-change-transform lg:left-[26%] lg:[mask-image:linear-gradient(90deg,transparent_0%,rgb(0_0_0/0.55)_22%,#000_46%)]"
      >
        <div data-hero-cam className="absolute inset-0">
        <picture>
          <source media={PORTRAIT} srcSet={portrait.srcSet} sizes="100vw" />
          <img
            {...landscape}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[50%_50%] md:object-[56%_50%]"
          />
        </picture>
        <HeroVideo />
        {/* Pulsing heat at the weld point */}
        <div
          aria-hidden="true"
          className="glow-pulse pointer-events-none absolute left-[46%] top-[62%] size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_150_60/0.42),rgb(255_106_0/0.14)_38%,transparent_68%)] will-change-[opacity] lg:left-[40%]"
        />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_15_21/0.55)_0%,transparent_22%,transparent_60%,rgb(17_21_24/0.85)_92%,#111518_100%)]" />
      </div>

      {/* Mobile legibility: text sits on the lower half. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_36%,rgb(10_15_21/0.6)_58%,rgb(10_15_21/0.94)_86%)] lg:hidden" />
      <div className="absolute inset-y-0 left-0 hidden w-[46%] bg-[linear-gradient(90deg,#0a0f15_30%,transparent)] lg:block" />

      <Blueprint data-hero-blueprint className="pointer-events-none absolute -left-6 top-0 hidden h-full w-[30%] max-w-[420px] text-white/[0.07] lg:block" />
      <Embers className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden" />
      <SparkField className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" />
      <div className="hidden lg:block">
        <Noise opacity={0.07} fps={18} blendMode="overlay" contrast={0.55} />
      </div>

      <HeroCamera />
      <div
        data-hero-content
        className="container-x relative z-10 flex h-full flex-col justify-end pb-[max(15svh,96px)] lg:justify-center lg:pb-0 lg:pt-[72px]"
      >
        <div data-hero-depth className="max-w-[44rem] lg:pl-[4.5%]">
          {/* Lines are pre-split so the reveal runs in CSS from first paint. */}
          <h1 className="display text-[clamp(3.6rem,7.4vw,7.5rem)] text-white">
            <span className="hero-line">
              <span style={{ "--i": 0 } as React.CSSProperties}>{site.home.hero.lines[0]}</span>
            </span>
            <span className="hero-line">
              <span className="copper-text" style={{ "--i": 1 } as React.CSSProperties}>
                {site.home.hero.lines[1]}
              </span>
            </span>
          </h1>
          <span
            data-hero="fade"
            aria-hidden="true"
            style={{ "--i": 0 } as React.CSSProperties}
            className="mt-7 block h-[3px] w-16 bg-copper"
          />
          <p
            data-hero="fade"
            style={{ "--i": 1 } as React.CSSProperties}
            className="mt-6 max-w-[27rem] text-[1.0625rem] leading-relaxed text-text-hi lg:text-[1.1875rem]"
          >
            {site.home.hero.sub}
          </p>
          <div data-hero="fade" style={{ "--i": 2 } as React.CSSProperties} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={site.home.hero.primary.href} arrow>
              {site.home.hero.primary.label}
            </ButtonLink>
            <ButtonLink href={site.home.hero.secondary.href} variant="outline">
              {site.home.hero.secondary.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div
        data-hero="fade"
        aria-hidden="true"
        style={{ "--i": 4 } as React.CSSProperties}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="eyebrow text-[0.6875rem] text-white/50">Scroll</span>
        <span className="scroll-cue relative block h-12 w-px overflow-hidden bg-white/15" />
      </div>
    </section>
  );
}
