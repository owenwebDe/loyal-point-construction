import Image from "next/image";
import TiltedCard from "@/components/bits/TiltedCard";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";
import { featuredWork } from "@/lib/work";

export function Featured() {
  const { eyebrow, title, cta } = site.home.featured;
  return (
    <section aria-label="Featured work" className="relative bg-base py-20 lg:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[22%_1fr] lg:gap-0">
        <div className="flex flex-col justify-between gap-8 lg:pr-8">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <div data-r="fade-up">
            <ButtonLink href={cta.href} variant="ghost-copper" size="md" arrow>
              {cta.label}
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {featuredWork.map(({ id, title: cardTitle, item }, i) => (
            <li key={id} className="relative aspect-[20/21]">
              {/* React Bits TiltedCard, kept restrained: small tilt, faint glare, no flip/tooltip/gyro. */}
              <TiltedCard
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                rotateAmplitude={5}
                scaleOnHover={1.02}
                glare={0.22}
                shadow={0.45}
                parallax={0.6}
                perspective={1000}
                radius={6}
                showTooltip={false}
                intro={false}
                gyroscope={false}
                flipOnClick={false}
              >
                <button
                  type="button"
                  data-lb-group="featured"
                  data-lb-index={i}
                  className="group absolute inset-0 flex flex-col overflow-hidden rounded-card border border-white/[0.07] bg-surface text-left transition-[border-color] duration-300 hover:border-copper/60"
                >
                  <span data-r="clip" className="relative block w-full flex-1 overflow-hidden">
                    <span data-r-inner className="absolute inset-0 block">
                      <span data-parallax="6" className="absolute inset-x-0 -inset-y-[8%] block">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 100vw"
                          placeholder="blur"
                          blurDataURL={item.blurDataURL}
                          className="object-cover transition-transform duration-[600ms] ease-brand group-hover:scale-[1.05]"
                        />
                      </span>
                    </span>
                    <span className="absolute left-4 top-4 font-display text-sm font-semibold tracking-[0.14em] text-white/85">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center justify-between gap-4 border-t border-white/[0.06] px-5 py-5">
                    <span className="display text-[1.375rem] leading-none text-white">{cardTitle}</span>
                    <ArrowRight className="size-5 shrink-0 text-copper transition-transform duration-300 ease-brand group-hover:translate-x-1" />
                  </span>
                </button>
              </TiltedCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
