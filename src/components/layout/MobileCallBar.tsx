"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, WhatsApp } from "@/components/ui/Icons";
import { primaryPhone, site, waLink } from "@/content/site";
import { cn } from "@/lib/utils";

/** Sticky Call / WhatsApp bar on small screens, shown once the hero buttons scroll away. */
export function MobileCallBar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const hero = document.querySelector("[data-hero-root]");
    if (!hero) return setShow(true);
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), {
      rootMargin: "0px 0px -35% 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-500 ease-brand lg:hidden",
        show ? "translate-y-0" : "translate-y-[130%]",
      )}
      aria-hidden={!show}
    >
      <div className="grid grid-cols-2 gap-2 rounded-[10px] border border-white/10 bg-ink/85 p-2 shadow-[0_18px_40px_-10px_rgb(0_0_0/0.8)] backdrop-blur-xl">
        <a
          href={`tel:${primaryPhone.tel}`}
          tabIndex={show ? 0 : -1}
          className="flex h-12 items-center justify-center gap-2 rounded-card bg-copper-fill font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white"
        >
          <Phone className="size-[18px]" /> Call
        </a>
        <a
          href={waLink(site.quoteMessage)}
          target="_blank"
          rel="noopener"
          tabIndex={show ? 0 : -1}
          className="flex h-12 items-center justify-center gap-2 rounded-card border border-white/15 bg-white/[0.04] font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-white"
        >
          <WhatsApp className="size-[18px] text-[#5fd17f]" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
