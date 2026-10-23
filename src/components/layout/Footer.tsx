import Link from "next/link";
import { Blueprint } from "@/components/ui/Blueprint";
import { Brand } from "@/components/ui/Brand";
import { ArrowUp, Clock, Instagram, Mail, MapPin, Phone, Telegram, WhatsApp } from "@/components/ui/Icons";
import { fullAddress, site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  const social = [
    { href: site.social.instagram.url, label: `Instagram ${site.social.instagram.handle}`, Icon: Instagram },
    { href: site.social.telegram.url, label: `Telegram ${site.social.telegram.handle}`, Icon: Telegram },
    { href: site.phones[0].wa, label: `WhatsApp ${site.phones[0].display}`, Icon: WhatsApp },
  ];

  return (
    <footer className="relative overflow-hidden bg-base pb-28 pt-16 lg:pb-0 lg:pt-20">
      <Blueprint data-parallax="12" className="pointer-events-none absolute -bottom-24 right-[-4%] hidden h-[130%] w-[30%] max-w-[380px] text-white/[0.05] lg:block" />

      <div className="container-x relative grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1.3fr] lg:gap-12">
        <div>
          <Brand size={56} />
          <p className="mt-6 max-w-[22rem] text-[0.9375rem] leading-relaxed text-steel">{site.footer.blurb}</p>
          <div className="mt-7 flex gap-3">
            {social.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-white/15 text-white/75 transition-colors duration-300 hover:border-copper hover:text-white"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-6 text-white">Pages</p>
          <ul className="space-y-0.5">
            {[{ label: "Home", href: "/" }, ...site.nav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1.5 text-[0.9375rem] text-steel transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <p className="eyebrow mb-6 text-white">Services</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5 sm:grid-cols-1">
            {site.services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="inline-block py-1.5 text-[0.9375rem] text-steel transition-colors hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-6 text-white">Contact</p>
          <ul className="space-y-4 text-[0.9375rem] text-steel">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-copper" />
              <address className="not-italic leading-relaxed">{fullAddress}</address>
            </li>
            {site.phones.map((p) => (
              <li key={p.tel} className="flex items-center gap-3">
                <Phone className="size-5 shrink-0 text-copper" />
                <a href={`tel:${p.tel}`} className="inline-block py-1.5 transition-colors hover:text-white">
                  {p.display}
                </a>
                <a
                  href={p.wa}
                  target="_blank"
                  rel="noopener"
                  aria-label={`WhatsApp ${p.display}`}
                  className="ml-1 inline-flex min-h-[28px] items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1 text-xs uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-[#5fd17f]/60 hover:text-white"
                >
                  <WhatsApp className="size-3.5 text-[#5fd17f]" /> WhatsApp
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <Clock className="size-5 shrink-0 text-copper" />
              <span className="text-white/85">{site.hours.label}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-5 shrink-0 text-copper" />
              <a href={`mailto:${site.email}`} className="inline-block break-all py-1.5 transition-colors hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x relative mt-14 lg:mt-20">
        <div className="flex flex-col gap-4 border-t border-white/[0.08] py-6 text-sm text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Ketu, Lagos.{" "}
            <Link href="/credits" className="ml-2 inline-block py-1.5 text-steel/80 underline-offset-4 transition-colors hover:text-white hover:underline">
              Photo credits
            </Link>
          </p>
          <a href="#top" className="inline-flex min-h-[32px] items-center gap-2 transition-colors hover:text-white">
            Back to top <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
