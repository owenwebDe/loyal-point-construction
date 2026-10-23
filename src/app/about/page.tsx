import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/sections/Cta";
import { Facts } from "@/components/sections/Facts";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight, Clock, LineIcon, MapPin, Phone } from "@/components/ui/Icons";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { broll } from "@/content/media";
import { mapsLink, telLink, site } from "@/content/site";
import { clientPhotos } from "@/lib/work";

export const metadata: Metadata = {
  title: "About",
  description: "Loyal Point Construction is a welding and fabrication workshop in Ketu, Lagos, open 24 hours, taking jobs across Nigeria.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { eyebrow, title, sub, workshop, directions } = site.aboutPage;
  const doors = clientPhotos("safety-doors");
  // The double-door photo shows the workshop itself, number painted on the wall.
  const yard = doors.find((d) => d.file.endsWith("door2.jpg")) ?? doors[0];

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        sub={sub}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        actions={
          <ButtonLink href="/contact" arrow>
            Visit the Workshop
          </ButtonLink>
        }
        aside={
          yard && (
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-card ring-1 ring-white/10">
                <Image
                  src={yard.src}
                  alt={yard.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  placeholder="blur"
                  blurDataURL={yard.blurDataURL}
                  className="object-cover object-[30%_50%]"
                />
              </div>
              <figcaption className="mt-4 text-sm text-steel">{workshop.caption}</figcaption>
            </figure>
          )
        }
      />

      {/* Workshop: text beside a cinema strip of the bending loop */}
      <section aria-label={workshop.eyebrow} className="relative bg-ink py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <div>
            <SectionHeading eyebrow={workshop.eyebrow} title={workshop.title} />
            <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-text-hi">
              {workshop.text.map((p) => (
                <p key={p} data-r="fade-up">
                  {p}
                </p>
              ))}
            </div>
            <ul data-r="fade-up" className="mt-8 grid gap-3 text-[0.9375rem] text-white/85 sm:grid-cols-2">
              <li className="flex items-center gap-3">
                <Clock className="size-5 text-copper" /> {site.hours.label}
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-5 text-copper" /> Ketu, Lagos · Jobs nationwide
              </li>
            </ul>
          </div>
          <div data-r="clip" className="relative aspect-[16/10] overflow-hidden rounded-card ring-1 ring-white/10">
            <div data-r-inner className="absolute inset-0">
              <LoopVideo
                src={broll.bending.src}
                webm={broll.bending.webm}
                poster={broll.bending.poster}
                sizes="(min-width: 1024px) 55vw, 100vw"
                objectPosition={broll.bending.position}
              />
            </div>
            <span className="absolute bottom-4 left-4 rounded-full bg-ink/60 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
              {site.trade}
            </span>
          </div>
        </div>
      </section>

      <Facts />

      {/* What we make */}
      <section aria-label="What we make" className="relative bg-base-2 py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="What We Make" title={["Nine services,", "one workshop."]} />
          <ul data-r="draw" className="mt-12 grid gap-px overflow-hidden rounded-card bg-white/[0.07] sm:grid-cols-3">
            {site.services.map((s) => (
              <li key={s.slug} className="bg-base-2">
                <Link href={`/services/${s.slug}`} className="group flex h-full items-center gap-4 p-6 transition-colors duration-300 hover:bg-surface">
                  <LineIcon name={s.icon} className="size-10 shrink-0 text-copper" />
                  <span className="display flex-1 text-[1.35rem] leading-none text-white">{s.title}</span>
                  <ArrowUpRight className="size-5 text-steel transition-[transform,color] duration-300 group-hover:rotate-45 group-hover:text-copper-hi" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Find us */}
      <section aria-label={directions.eyebrow} className="relative overflow-hidden bg-concrete py-20 text-surface lg:py-24">
      <div data-parallax="7" aria-hidden="true" className="tex-concrete pointer-events-none absolute inset-x-0 -inset-y-[14%]" />
        <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading eyebrow={directions.eyebrow} title={directions.title} tone="light" />
          <div>
            <ol className="space-y-4">
              {directions.steps.map((step, n) => (
                <li key={step} data-r="fade-up" className="flex gap-5 border-b border-surface/15 pb-4">
                  <span className="font-display text-sm font-semibold tracking-[0.14em] text-copper-deep">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.0625rem] text-surface">{step}</span>
                </li>
              ))}
            </ol>
            <div data-r="fade-up" className="mt-8 flex flex-wrap gap-3">
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener"
                className="inline-flex h-[52px] items-center gap-3 rounded-card bg-surface px-6 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-ink"
              >
                <MapPin className="size-5 text-copper-hi" /> Open in Google Maps
              </a>
              <a
                href={telLink}
                className="inline-flex h-[52px] items-center gap-3 rounded-card border border-surface/30 px-6 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-surface transition-colors hover:border-surface"
              >
                <Phone className="size-5" /> Call for directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
