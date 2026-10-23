import Image from "next/image";
import logo from "@/assets/logo.png";
import CountUp from "@/components/bits/CountUp";
import { LineIcon } from "@/components/ui/Icons";
import { site } from "@/content/site";

export function Facts() {
  const { eyebrow, title, items } = site.facts;
  return (
    <section aria-label="At a glance" className="relative overflow-hidden bg-surface-2">
      <div data-parallax="14" aria-hidden="true" className="tex-hex pointer-events-none absolute inset-x-0 -inset-y-[20%]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_10%_50%,rgb(180_127_87/0.12),transparent_70%)]" />
      <div className="container-x relative grid grid-cols-2 py-14 lg:grid-cols-[1.25fr_repeat(4,1fr)] lg:py-16">
        <div className="col-span-2 mb-10 flex items-center gap-5 lg:col-span-1 lg:mb-0 lg:pr-8">
          <span className="relative grid size-[72px] shrink-0 place-items-center">
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.14),transparent_70%)]" />
            <Image src={logo} alt="" width={68} height={63} sizes="68px" className="relative" />
          </span>
          <div>
            <p data-r="fade-up" className="eyebrow mb-2 text-copper">{eyebrow}</p>
            <h2 data-r="heading" className="display text-[1.875rem] text-white lg:text-[2rem]">
              {title[0]}
              <br />
              {title[1]}
            </h2>
          </div>
        </div>

        <ul data-r="draw" className="contents">
          {items.map((fact, i) => (
            <li
              key={fact.label}
              data-r="fade-up"
              className={
                "flex flex-col items-center border-white/[0.09] px-4 py-6 text-center lg:border-l lg:py-2 " +
                (i % 2 === 0 ? "max-lg:border-r " : "") +
                (i < 2 ? "max-lg:border-b" : "")
              }
            >
              <LineIcon name={fact.icon} className="size-11 text-copper" />
              <span className="display mt-4 flex h-[1.2em] items-center text-[clamp(1.9rem,10vw,3rem)] leading-none text-white lg:text-[3.5rem]">
                {typeof fact.value === "number" ? (
                  <CountUp to={fact.value} duration={1.2} mode="roll" easing="expo" />
                ) : (
                  fact.value
                )}
              </span>
              <span className="mt-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.1em] text-text-hi">
                {fact.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
