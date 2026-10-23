import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta } from "@/components/sections/Cta";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowUpRight, Expand, LineIcon, WhatsApp } from "@/components/ui/Icons";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { PageHero } from "@/components/ui/PageHero";
import { SampleTag } from "@/components/ui/SampleTag";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Showroom } from "@/components/ui/Showroom";
import { serviceClip } from "@/content/media";
import { serviceBySlug, site, waLink } from "@/content/site";
import { clientPhotos, itemsInCategory } from "@/lib/work";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  if (!service) return {};
  return {
    title: `${service.name} in Lagos and across Nigeria`,
    description: `${service.short} Loyal Point Construction: workshop in Ketu, Lagos, jobs across Nigeria. Open 24 hours.`,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const index = site.services.findIndex((s) => s.slug === slug);
  const photos = itemsInCategory(slug);
  const real = clientPhotos(slug);
  const clip = serviceClip[slug];
  const others = site.services.filter((s) => s.slug !== slug);
  const quoteHref = `/contact?service=${slug}#quote`;

  const aside =
    slug === "safety-doors" ? (
      <Showroom />
    ) : real[0] ? (
      <figure className="relative aspect-[4/5] overflow-hidden rounded-card ring-1 ring-white/10">
        <Image
          src={real[0].src}
          alt={real[0].alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          placeholder="blur"
          blurDataURL={real[0].blurDataURL}
          className="object-cover"
        />
      </figure>
    ) : (
      <figure className="relative aspect-[4/5] overflow-hidden rounded-card ring-1 ring-white/10 sm:aspect-[16/11] lg:aspect-[4/5]">
        <LoopVideo
          src={clip.src}
          webm={clip.webm}
          poster={clip.poster}
          sizes="(min-width: 1024px) 45vw, 100vw"
          objectPosition={clip.position}
          priority
        />
        <figcaption className="absolute bottom-4 left-4 rounded-full bg-ink/60 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
          In the workshop
        </figcaption>
      </figure>
    );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.short,
      url: `${site.url}/services/${slug}`,
      provider: { "@id": `${site.url}/#business` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
        { "@type": "ListItem", position: 3, name: service.title, item: `${site.url}/services/${slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow={`Service ${String(index + 1).padStart(2, "0")} / ${String(site.services.length).padStart(2, "0")}`}
        title={[service.name]}
        sub={service.short}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]}
        aside={aside}
        actions={
          <>
            <ButtonLink href={quoteHref} arrow>
              Get a Quote
            </ButtonLink>
            <ButtonLink
              href={waLink(site.serviceMessage(service.title))}
              target="_blank"
              rel="noopener"
              variant="outline"
              icon={<WhatsApp className="size-5" />}
            >
              WhatsApp Us
            </ButtonLink>
          </>
        }
      />

      <section aria-label={`${service.title} photos`} className="relative bg-ink py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Photos" title={["Recent", `${service.title.toLowerCase()} work.`]} />
          {photos.length ? (
            <ul className="mt-12 columns-2 gap-3 lg:columns-3 lg:gap-4">
              {photos.map((photo, n) => (
                <li key={photo.id} data-r="fade-up" className="mb-3 break-inside-avoid lg:mb-4">
                  <button
                    type="button"
                    data-lb-group={`cat:${slug}`}
                    data-lb-index={n}
                    className="group relative block w-full overflow-hidden rounded-card bg-surface"
                  >
                    {photo.source === "placeholder" && <SampleTag />}
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(min-width: 1024px) 400px, 50vw"
                      placeholder="blur"
                      blurDataURL={photo.blurDataURL}
                      className="h-auto w-full transition-transform duration-[600ms] ease-brand group-hover:scale-[1.05]"
                    />
                    <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink/60 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <Expand className="size-4" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div data-r="fade-up" className="mt-12 flex flex-col gap-6 rounded-card border border-white/10 bg-surface/50 p-8 sm:flex-row sm:items-center sm:justify-between lg:p-10">
              <p className="max-w-[36rem] text-[1.0625rem] leading-relaxed text-text-hi">
                {site.servicesPage.noPhotos(service.title)}
              </p>
              <ButtonLink
                href={waLink(`Hello Loyal Point Construction, can you send me photos of your ${service.title.toLowerCase()} work?`)}
                target="_blank"
                rel="noopener"
                icon={<WhatsApp className="size-5" />}
                className="shrink-0"
              >
                Ask for photos
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      <section aria-label="Other services" className="relative bg-base-2 py-20 lg:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="More Services" title={["Everything else", "we do."]} />
          <ul data-r="draw" className="mt-12 grid gap-px overflow-hidden rounded-card bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.slug} className="bg-base-2">
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full items-center gap-4 p-6 transition-colors duration-300 hover:bg-surface"
                >
                  <LineIcon name={s.icon} className="size-10 shrink-0 text-copper" />
                  <span className="display flex-1 text-[1.35rem] leading-none text-white">{s.title}</span>
                  <ArrowUpRight className="size-5 text-steel transition-[transform,color] duration-300 group-hover:rotate-45 group-hover:text-copper-hi" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cta />
    </>
  );
}
