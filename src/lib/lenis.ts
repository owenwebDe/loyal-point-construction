import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};
export const getLenis = () => instance;

/** Pause/resume page scrolling (menu, lightbox, intro). Falls back to overflow lock. */
export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
    return;
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
