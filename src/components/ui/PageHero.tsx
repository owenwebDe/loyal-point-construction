import Link from "next/link";
import type { ReactNode } from "react";
import { Fragment } from "react";
import type { Clip } from "@/content/media";
import { cn } from "@/lib/utils";
import { HeroCamera } from "@/components/hero/HeroCamera";
import { LoopVideo } from "./LoopVideo";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow: string;
  title: readonly string[];
  sub?: string;
  crumbs?: Crumb[];
  /** Full-bleed background loop behind the text. */
  background?: Clip;
  /** Right-hand column on desktop (framed photo, showroom). Stacks under the text on phones. */
  aside?: ReactNode;
  actions?: ReactNode;
  size?: "tall" | "compact";
};

const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

/**
 * Header for inner pages. Shares the home hero's reveal (CSS lines + fade-ups,
 * timed after the intro on first load) and its scroll exit (data-hero-*).
 */
export function PageHero({ eyebrow, title, sub, crumbs, background, aside, actions, size = "tall" }: Props) {
  return (
    <section
      data-hero-root
      aria-label={eyebrow}
      className={cn(
        "relative isolate overflow-hidden bg-ink",
        size === "tall" ? "min-h-[86svh] lg:min-h-[78svh]" : "min-h-[62svh] lg:min-h-[56svh]",
      )}
    >
      {background && (
        <div data-hero-media className="absolute inset-0 origin-[60%_50%] will-change-transform">
          <div data-hero-cam className="absolute inset-0">
            <LoopVideo
              src={background.src}
              webm={background.webm}
              poster={background.poster}
              sizes="100vw"
              objectPosition={background.position}
              priority
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a0f15_0%,rgb(10_15_21/0.86)_38%,rgb(10_15_21/0.35)_75%,rgb(10_15_21/0.25)_100%)] max-lg:bg-[linear-gradient(180deg,rgb(10_15_21/0.45)_0%,rgb(10_15_21/0.75)_50%,#0a0f15_100%)]" />
        </div>
      )}
      <div className="tex-grain pointer-events-none absolute inset-0 opacity-60" />
      <HeroCamera />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,#0a0f15)]" />

      <div
        data-hero-content
        className={cn(
          "container-x relative z-10 grid h-full min-h-[inherit] gap-12 pb-16 pt-[calc(72px+56px)] lg:pb-20 lg:pt-[calc(72px+72px)]",
          aside ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16" : "content-end lg:items-end",
        )}
      >
        <div data-hero-depth className={cn("flex flex-col justify-end", !aside && "max-w-[52rem]")}>
          {crumbs && (
            <nav aria-label="Breadcrumb" data-hero="fade" style={i(0)} className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-steel">
                {crumbs.map((c, n) => (
                  <Fragment key={c.label}>
                    {n > 0 && <li aria-hidden="true" className="text-white/25">/</li>}
                    <li>
                      {c.href ? (
                        <Link href={c.href} className="transition-colors hover:text-white">
                          {c.label}
                        </Link>
                      ) : (
                        <span aria-current="page" className="text-white/80">
                          {c.label}
                        </span>
                      )}
                    </li>
                  </Fragment>
                ))}
              </ol>
            </nav>
          )}
          <p data-hero="fade" style={i(0)} className="eyebrow mb-5 text-copper">
            {eyebrow}
          </p>
          <h1 className={cn("display text-white", aside ? "text-[clamp(3rem,5.2vw,5.25rem)]" : "text-[clamp(3rem,6.6vw,6.25rem)]")}>
            {title.map((line, n) => (
              <span key={line} className="hero-line">
                <span className={n === title.length - 1 && title.length > 1 ? "copper-text" : undefined} style={i(n)}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <span data-hero="fade" aria-hidden="true" style={i(1)} className="mt-7 block h-[3px] w-16 bg-copper" />
          {sub && (
            <p
              data-hero="fade"
              style={i(2)}
              className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-text-hi lg:text-[1.1875rem]"
            >
              {sub}
            </p>
          )}
          {actions && (
            <div data-hero="fade" style={i(3)} className="mt-9 flex flex-wrap gap-3">
              {actions}
            </div>
          )}
        </div>
        {aside && (
          <div data-hero="fade" style={i(2)} className="relative">
            <div data-hero-depth style={{ "--d": -10 } as React.CSSProperties}>{aside}</div>
          </div>
        )}
      </div>
    </section>
  );
}
