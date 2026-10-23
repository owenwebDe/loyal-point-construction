import type { Metadata } from "next";
import { Cta } from "@/components/sections/Cta";
import { Facts } from "@/components/sections/Facts";
import { ServicesIndex, type IndexRow } from "@/components/sections/ServicesIndex";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { broll, serviceClip } from "@/content/media";
import { site } from "@/content/site";
import { clientPhotos } from "@/lib/work";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Iron burglary proof, safety doors, windows, containers, repairs, iron bending, pillars, beams and decking. Loyal Point Construction, Lagos and across Nigeria.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const { eyebrow, title, sub } = site.servicesPage;
  const rows: IndexRow[] = site.services.map((s) => {
    const real = clientPhotos(s.slug)[0];
    const poster = serviceClip[s.slug].poster;
    return {
      slug: s.slug,
      title: s.title,
      short: s.short,
      icon: s.icon,
      preview: real ? { src: real.src, blurDataURL: real.blurDataURL } : { src: poster.src, blurDataURL: poster.blurDataURL },
    };
  });

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        sub={sub}
        background={broll.bending}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        actions={
          <ButtonLink href={site.quoteHref} arrow>
            Request a Quote
          </ButtonLink>
        }
      />
      <section aria-label="All services" className="relative bg-ink pb-24 pt-6 lg:pb-32">
        <div className="container-x">
          <ServicesIndex rows={rows} />
        </div>
      </section>
      <Facts />
      <Cta />
    </>
  );
}
