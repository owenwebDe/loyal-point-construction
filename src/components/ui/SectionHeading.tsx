import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: readonly string[];
  tone?: "dark" | "light";
  className?: string;
  as?: "h2" | "h3";
};

/** Eyebrow, two-line display title and the copper bar, as in the mockup. */
export function SectionHeading({ eyebrow, title, tone = "dark", className, as: Tag = "h2" }: Props) {
  return (
    <div className={className}>
      <p
        data-r="fade-up"
        className={cn("eyebrow mb-4", tone === "light" ? "text-copper-deep" : "text-copper")}
      >
        {eyebrow}
      </p>
      <Tag
        data-r="heading"
        className={cn(
          "display text-[clamp(2.25rem,3.2vw,3rem)]",
          tone === "light" ? "text-surface" : "text-white",
        )}
      >
        {title.map((line, i) => (
          <Fragment key={line}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Tag>
      <span
        data-r="bar"
        aria-hidden="true"
        className={cn("mt-6 block h-[3px] w-12 origin-left", tone === "light" ? "bg-copper-deep" : "bg-copper")}
      />
    </div>
  );
}
