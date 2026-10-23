"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { useEffect, useRef } from "react";
import { Brand } from "@/components/ui/Brand";
import { Close, Instagram, Phone, Telegram, WhatsApp } from "@/components/ui/Icons";
import { fullAddress, primaryPhone, site, waLink } from "@/content/site";
import { lockScroll } from "@/lib/lenis";

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Links are plain hrefs: PageTransition handles the navigation, and the header
  // closes this menu when the route changes.
  const links = [{ label: "Home", href: "/" }, ...site.nav];

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.3, ease }}
            data-lenis-prevent
          >
            <div className="container-x flex h-[72px] shrink-0 items-center justify-between">
              <Brand />
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-card border border-white/15 text-white"
              >
                <Close className="size-6" />
              </button>
            </div>

            <nav aria-label="Mobile" className="container-x mt-6 flex flex-col">
              {links.map((item, i) => (
                <m.a
                  key={item.href}
                  href={item.href}
                  className="flex items-baseline gap-4 border-b border-white/[0.08] py-4 font-display text-[2.6rem] font-bold uppercase leading-none text-white"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 + i * 0.05, ease }}
                >
                  <span className="font-display text-sm font-semibold tracking-[0.14em] text-copper">0{i + 1}</span>
                  {item.label}
                </m.a>
              ))}
            </nav>

            <m.div
              className="container-x mt-auto pb-10 pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${primaryPhone.tel}`}
                  className="flex h-14 items-center justify-center gap-2 rounded-card bg-copper-fill font-display font-semibold uppercase tracking-[0.08em] text-white"
                >
                  <Phone className="size-5" /> Call
                </a>
                <a
                  href={waLink(site.quoteMessage)}
                  target="_blank"
                  rel="noopener"
                  className="flex h-14 items-center justify-center gap-2 rounded-card border border-white/25 font-display font-semibold uppercase tracking-[0.08em] text-white"
                >
                  <WhatsApp className="size-5" /> WhatsApp
                </a>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-steel">
                <span className="mb-1 block font-display font-semibold uppercase tracking-[0.1em] text-copper">
                  {site.hours.label}
                </span>
                {fullAddress}
              </p>
              <div className="mt-5 flex gap-3">
                <a href={site.social.instagram.url} target="_blank" rel="noopener" aria-label={`Instagram ${site.social.instagram.handle}`} className="grid size-11 place-items-center rounded-full border border-white/15 text-white/80">
                  <Instagram className="size-5" />
                </a>
                <a href={site.social.telegram.url} target="_blank" rel="noopener" aria-label={`Telegram ${site.social.telegram.handle}`} className="grid size-11 place-items-center rounded-full border border-white/15 text-white/80">
                  <Telegram className="size-5" />
                </a>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
