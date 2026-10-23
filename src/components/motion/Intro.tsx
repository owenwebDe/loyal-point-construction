import Image from "next/image";
import logo from "@/assets/logo.png";

/** Page-load overlay: the badge is wiped in behind a travelling weld seam (see MotionController). */
export function Intro() {
  return (
    <div data-intro aria-hidden="true" className="intro fixed inset-0 z-[100] items-center justify-center bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_50%,rgb(180_127_87/0.12),transparent_70%)]" />
      <div className="relative">
        <Image
          data-intro-logo
          src={logo}
          alt=""
          width={150}
          height={139}
          sizes="150px"
          fetchPriority="high"
          loading="eager"
          className="relative"
        />
        <span
          data-intro-seam
          className="absolute -bottom-[8%] -top-[8%] -left-px w-[2px] rounded-full bg-[linear-gradient(180deg,transparent,#fff6e4_30%,#ffb46a_60%,transparent)] shadow-[0_0_18px_6px_rgb(255_138_43/0.65),0_0_60px_12px_rgb(255_106_0/0.3)]"
        />
      </div>
    </div>
  );
}
