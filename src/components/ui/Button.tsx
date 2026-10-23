import { cn } from "@/lib/utils";
import { ArrowRight } from "./Icons";

type Variant = "copper" | "outline" | "ghost-copper" | "ink" | "light-outline";

const variants: Record<Variant, string> = {
  copper:
    "bg-copper-fill text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_30px_-12px_rgb(180_127_87/0.7)] hover:bg-[#9c6239]",
  outline: "border border-white/35 text-white hover:border-white hover:bg-white/5",
  "ghost-copper": "border border-copper/70 text-white hover:border-copper-hi hover:bg-copper-fill/25",
  ink: "bg-ink text-white hover:bg-black shadow-[0_12px_30px_-14px_rgb(0_0_0/0.9)]",
  "light-outline": "border border-white/55 text-white hover:bg-white hover:text-copper-band",
};

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  arrow?: boolean;
  icon?: React.ReactNode;
  size?: "md" | "lg";
};

export function ButtonLink({ variant = "copper", arrow, icon, size = "lg", className, children, ...rest }: Props) {
  return (
    <a
      className={cn(
        "group/btn relative inline-flex select-none items-center justify-center gap-3 rounded-card font-display font-semibold uppercase tracking-[0.08em] transition-[background,border-color,color,box-shadow,transform] duration-300 ease-brand active:scale-[0.98]",
        size === "lg" ? "h-[52px] px-6 text-[0.95rem]" : "h-11 px-5 text-[0.875rem]",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      <span>{children}</span>
      {arrow && (
        <ArrowRight className="size-[18px] transition-transform duration-300 ease-brand group-hover/btn:translate-x-1" />
      )}
    </a>
  );
}
