import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { itemsInCategory } from "@/lib/work";
import { BuildCarousel, type BuildCard } from "./BuildCarousel";

export function Build() {
  const { eyebrow, title } = site.home.build;
  // itemsInCategory puts the client's photos first, so a real photo is the cover whenever there is one.
  const cards: BuildCard[] = site.services.flatMap((service) => {
    const photos = itemsInCategory(service.slug);
    if (!photos.length) return [];
    const { src, alt, blurDataURL, source } = photos[0];
    return [
      {
        slug: service.slug,
        title: service.title,
        icon: service.icon,
        count: photos.length,
        cover: { src, alt, blurDataURL, sample: source === "placeholder" },
      },
    ];
  });

  return (
    <section id="build" className="relative overflow-hidden bg-concrete py-20 text-surface lg:py-24">
      <div data-parallax="7" aria-hidden="true" className="tex-concrete pointer-events-none absolute inset-x-0 -inset-y-[14%]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.18),transparent_14%,transparent_86%,rgb(0_0_0/0.22))]" />
      <div className="container-x relative grid gap-6 lg:grid-cols-[22%_1fr] lg:items-center lg:gap-0">
        <div className="lg:pr-8">
          <SectionHeading eyebrow={eyebrow} title={title} tone="light" />
        </div>
        <div className="min-w-0">
          <BuildCarousel cards={cards} />
        </div>
      </div>
    </section>
  );
}
