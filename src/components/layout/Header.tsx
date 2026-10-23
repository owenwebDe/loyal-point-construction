"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Magnet from "@/components/bits/Magnet";
import { Brand } from "@/components/ui/Brand";
import { ArrowRight, Menu } from "@/components/ui/Icons";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setHidden(false);
    let lastY = window.scrollY;
    let raf = 0;
    // Solid header once past the page hero; no blur over the hero video (costly on phones).
    const heroHeight = () =>
      (document.querySelector<HTMLElement>("[data-hero-root]")?.offsetHeight ?? 160) * 0.8;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > heroHeight());
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > lastY && y > window.innerHeight * 0.9);
          lastY = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header data-header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "h-[72px] border-b transition-[background-color,border-color,transform,backdrop-filter] duration-500 ease-brand",
            scrolled
              ? "border-white/[0.07] bg-base/75 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-[linear-gradient(180deg,rgb(10_15_21/0.7),rgb(10_15_21/0))]",
            hidden && !open && "-translate-y-full",
          )}
        >
          <div className="container-x flex h-full items-center justify-between gap-6">
            <Link href="/" aria-label="Loyal Point Construction, home" className="shrink-0">
              <Brand />
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
              {site.nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative py-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300",
                      active ? "text-white" : "text-white/70 hover:text-white",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-copper transition-transform duration-500 ease-brand",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <span className="hidden sm:block">
                <Magnet padding={40} maxOffset={8} magnetStrength={4}>
                  <Link
                    href={site.quoteHref}
                    className="group inline-flex h-11 items-center gap-3 rounded-card border border-copper/80 px-5 font-display text-[0.875rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:border-copper-hi hover:bg-copper-fill/30"
                  >
                    Request a Quote
                    <ArrowRight className="size-4 text-copper-hi transition-transform duration-300 ease-brand group-hover:translate-x-1" />
                  </Link>
                </Magnet>
              </span>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="grid size-11 place-items-center rounded-card border border-white/15 text-white lg:hidden"
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
