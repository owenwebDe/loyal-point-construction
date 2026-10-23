import Link from "next/link";
import { ArrowUpRight, LineIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { MarqueePause } from "./MarqueePause";

/**
 * Services strip: one horizontal row that drifts continuously to the right.
 * Pure CSS (compositor-only); the set is rendered twice for a seamless loop and
 * pauses on hover, focus or touch. Reduced motion gets a plain scrollable row.
 */
export function Services() {
  const { eyebrow, title } = site.home.services;
  const items = site.services;

  const cards = (copy: number) =>
    items.map((service, i) => (
      <li key={`${copy}-${service.slug}`} className="shrink-0 pr-4">
        <Link
          href={`/services/${service.slug}`}
          tabIndex={copy ? -1 : undefined}
          className="group relative flex h-[244px] w-[244px] flex-col overflow-hidden rounded-card border border-white/[0.08] bg-[linear-gradient(160deg,rgb(39_41_46/0.75),rgb(17_21_24/0.9))] p-6 transition-[transform,box-shadow,border-color] duration-[250ms] ease-brand hover:-translate-y-1.5 hover:border-copper/60 hover:shadow-[0_0_0_1px_rgb(180_127_87/0.5),0_22px_44px_-20px_rgb(180_127_87/0.55)] sm:h-[260px] sm:w-[264px] sm:p-7"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgb(180_127_87/0.22),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="flex items-start justify-between">
            <LineIcon
              name={service.icon}
              className="size-12 text-copper transition-colors duration-300 group-hover:text-copper-hi"
            />
            <span className="font-display text-sm font-semibold tracking-[0.12em] text-steel/70">
              {String(i + 1).padStart(2, "0")}
            </span>
          </span>
          <span className="mt-auto">
            <span className="display block text-[1.5rem] leading-[1.02] text-white">{service.title}</span>
            {service.note && <span className="mt-1.5 block text-sm text-steel">{service.note}</span>}
            <span className="eyebrow mt-4 flex items-center gap-1.5 text-[0.75rem] text-copper transition-colors group-hover:text-copper-hi">
              View service <ArrowUpRight className="size-3.5" />
            </span>
          </span>
        </Link>
      </li>
    ));

  return (
    <section id="services" className="tex-grain relative overflow-hidden bg-base-2 py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(180_127_87/0.45),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 hidden overflow-hidden lg:block">
        <p
          data-parallax-x="-18"
          className="display whitespace-nowrap text-[11rem] leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.05)]"
        >
          Welding · Fabrication · Iron Works · Welding · Fabrication
        </p>
      </div>
      <div className="container-x grid gap-10 lg:grid-cols-[22%_1fr] lg:items-center lg:gap-0">
        <div className="lg:pr-8">
          <SectionHeading eyebrow={eyebrow} title={title} />
        </div>

        <MarqueePause
          data-r="draw"
          className="marquee -mx-6 py-3 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] lg:mx-0 lg:[mask-image:linear-gradient(90deg,transparent,#000_10%,#000_92%,transparent)]"
        >
          <div className="marquee-track flex w-max">
            <ul className="flex" aria-label="Services">
              {cards(0)}
            </ul>
            <ul className="marquee-clone flex" aria-hidden="true">
              {cards(1)}
            </ul>
          </div>
        </MarqueePause>
      </div>
    </section>
  );
}
