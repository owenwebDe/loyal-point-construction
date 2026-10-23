import type { Metadata } from "next";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Clock, Instagram, Mail, MapPin, Phone, Telegram, WhatsApp } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { fullAddress, mapsLink, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call or WhatsApp 07030330791 or 08024464209. Loyal Point Construction, Ketu, Lagos. Open 24 hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { eyebrow, title, sub, form } = site.contactPage;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        sub={sub}
        size="compact"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        aside={
          <ul className="grid gap-3">
            {site.phones.map((p, n) => (
              <li
                key={p.tel}
                className="flex flex-col gap-5 rounded-card border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="eyebrow text-[0.75rem] text-steel">Line {n + 1}</p>
                  <a href={`tel:${p.tel}`} className="display mt-2 block text-[clamp(2rem,3.6vw,2.75rem)] text-white hover:text-copper-hi">
                    {p.display}
                  </a>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${p.tel}`}
                    aria-label={`Call ${p.display}`}
                    className="inline-flex h-12 items-center gap-2 rounded-card bg-copper-fill px-5 font-display text-[0.875rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#9c6239]"
                  >
                    <Phone className="size-4" /> Call
                  </a>
                  <a
                    href={p.wa}
                    target="_blank"
                    rel="noopener"
                    aria-label={`WhatsApp ${p.display}`}
                    className="inline-flex h-12 items-center gap-2 rounded-card border border-white/20 px-5 font-display text-[0.875rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-[#5fd17f]/70"
                  >
                    <WhatsApp className="size-4 text-[#5fd17f]" /> WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ul>
        }
      />

      <section id="quote" aria-label={form.eyebrow} className="relative bg-ink py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20">
          <div>
            <SectionHeading eyebrow={form.eyebrow} title={form.title} />
            <div data-r="fade-up" className="mt-10">
              <QuoteForm />
            </div>
          </div>

          <aside aria-label="Workshop details" className="space-y-px overflow-hidden rounded-card bg-white/[0.08] self-start">
            {[
              { Icon: Clock, label: "Hours", body: <span className="text-white">{site.hours.label}</span> },
              {
                Icon: MapPin,
                label: "Workshop",
                body: (
                  <>
                    <address className="not-italic leading-relaxed text-white/85">{fullAddress}</address>
                    <a href={mapsLink} target="_blank" rel="noopener" className="mt-2 inline-block py-1.5 text-sm text-copper-hi underline-offset-4 hover:underline">
                      Open in Google Maps
                    </a>
                  </>
                ),
              },
              {
                Icon: Mail,
                label: "Email",
                body: (
                  <a href={`mailto:${site.email}`} className="inline-block py-1 text-[0.875rem] text-white/85 [overflow-wrap:anywhere] hover:text-white sm:text-base">
                    {site.email}
                  </a>
                ),
              },
              {
                Icon: Instagram,
                label: "Social",
                body: (
                  <span className="flex flex-col gap-2 text-white/85">
                    <a href={site.social.instagram.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:text-white">
                      <Instagram className="size-4 text-copper" /> {site.social.instagram.handle}
                    </a>
                    <a href={site.social.telegram.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:text-white">
                      <Telegram className="size-4 text-copper" /> {site.social.telegram.handle}
                    </a>
                  </span>
                ),
              },
            ].map(({ Icon, label, body }) => (
              <div key={label} data-r="fade-up" className="flex gap-4 bg-base p-6">
                <Icon className="mt-0.5 size-5 shrink-0 text-copper" />
                <div>
                  <p className="eyebrow mb-2 text-[0.75rem] text-steel">{label}</p>
                  {body}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
