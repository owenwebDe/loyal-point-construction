import Image from "next/image";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

/** Badge + wordmark lockup, mirroring the mockup's mark + two-line name. */
export function Brand({ className, size = 46 }: { className?: string; size?: number }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        data-brand-mark
        className="relative grid shrink-0 place-items-center rounded-full"
        style={{ width: size, height: size }}
      >
        <span className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.16),transparent_70%)]" />
        <Image src={logo} alt="" width={size} height={Math.round((size * 509) / 550)} sizes={`${size}px`} className="relative drop-shadow-[0_0_10px_rgb(255_255_255/0.08)]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.375rem] font-bold uppercase tracking-[0.02em] text-white">
          Loyal Point
        </span>{" "}
        <span className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.32em] text-steel">
          Construction
        </span>
      </span>
    </span>
  );
}
