import Magnet from "@/components/bits/Magnet";
import { Phone, WhatsApp } from "@/components/ui/Icons";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { broll } from "@/content/media";
import { telLink, site, waLink } from "@/content/site";

export function Cta() {
  const { title, sub, call, whatsapp } = site.cta;
  return (
    <section
      aria-label="Get in touch"
      className="relative isolate overflow-hidden bg-copper-band"
    >
      <div className="tex-brushed absolute inset-0 bg-[linear-gradient(100deg,#8e5832_0%,#7e4a28_45%,#6b3d1e_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_140%_at_30%_50%,rgb(255_160_90/0.18),transparent_60%)]" />

      <div className="relative grid lg:grid-cols-[30%_1fr]">
        {/* Welding loop, slanted edge like the mockup */}
        <div className="relative h-52 overflow-hidden [clip-path:polygon(0_0,100%_0,100%_78%,0_100%)] lg:h-auto lg:min-h-[220px] lg:[clip-path:polygon(0_0,100%_0,84%_100%,0_100%)]">
          <div data-parallax="10" className="absolute -inset-y-[18%] inset-x-0">
            <LoopVideo
              src={broll.welding.src}
              poster={broll.welding.poster}
              sizes="(min-width: 1024px) 30vw, 100vw"
              objectPosition={broll.welding.position}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_55%,rgb(126_74_40/0.55))]" />
        </div>

        <div className="container-x flex flex-col gap-8 py-10 lg:ml-0 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-12 lg:pl-10">
          <div>
            <h2 data-r="heading" className="display text-[clamp(2.1rem,3.4vw,3rem)] text-white">
              {title}
            </h2>
            <p data-r="fade-up" className="mt-3 text-[0.95rem] text-white/80">
              {sub}
            </p>
          </div>
          <div data-r="fade-up" className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Magnet padding={50} maxOffset={8} magnetStrength={3}>
              <a
                href={telLink}
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-card bg-ink px-7 font-display text-base font-semibold uppercase tracking-[0.08em] text-white shadow-[0_14px_34px_-14px_rgb(0_0_0/0.9)] transition-colors duration-300 hover:bg-black sm:w-auto"
              >
                <Phone className="size-5 text-copper-hi" />
                {call}
              </a>
            </Magnet>
            <Magnet padding={50} maxOffset={8} magnetStrength={3}>
              <a
                href={waLink(site.quoteMessage)}
                target="_blank"
                rel="noopener"
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-card border border-white/60 px-7 font-display text-base font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:bg-white hover:text-copper-band sm:w-auto"
              >
                <WhatsApp className="size-5" />
                {whatsapp}
              </a>
            </Magnet>
          </div>
        </div>
      </div>
    </section>
  );
}
