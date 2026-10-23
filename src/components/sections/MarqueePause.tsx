"use client";

import { useEffect, useRef } from "react";

/** Touch devices have no hover: hold the marquee while a finger is on it. */
export function MarqueePause({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const hold = () => {
      clearTimeout(timer);
      el.setAttribute("data-paused", "");
    };
    const release = () => {
      clearTimeout(timer);
      timer = setTimeout(() => el.removeAttribute("data-paused"), 1200);
    };
    el.addEventListener("touchstart", hold, { passive: true });
    el.addEventListener("touchend", release, { passive: true });
    el.addEventListener("touchcancel", release, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener("touchstart", hold);
      el.removeEventListener("touchend", release);
      el.removeEventListener("touchcancel", release);
    };
  }, []);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
