import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <section data-hero-root className="relative grid min-h-[80svh] place-items-center bg-ink px-6 pt-[72px] text-center">
      <div className="tex-grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative">
        <p className="eyebrow text-copper">Error 404</p>
        <h1 className="display mt-5 text-[clamp(3rem,8vw,7rem)] text-white">
          Off the <span className="copper-text">drawing.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[1.0625rem] text-text-hi">
          This page doesn&apos;t exist. Try one of these instead.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" arrow>
            Home
          </ButtonLink>
          {site.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="inline-flex h-[52px] items-center rounded-card border border-white/20 px-6 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white hover:border-white/50"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
