import type { SVGProps } from "react";
import type { IconName } from "@/content/site";

// Line icons on a 48px grid. Every path carries pathLength="1" so the reveal can
// stroke-draw it with a dashoffset of 1 -> 0. Paths drawn on a 24px grid are
// scaled up with s2 (and get a half stroke so the weight matches).
const s2 = { transform: "scale(2)", strokeWidth: 0.75 } as const;

const paths: Record<IconName, React.ReactNode> = {
  burglary: (
    <>
      <path d="M9 7h30v34H9z" />
      <path d="M16.5 7v34M24 7v12.5M24 28.5V41M31.5 7v34" />
      <path d="M9 17h30M9 31h30" />
      <path d="M24 19.5l4.5 4.5-4.5 4.5-4.5-4.5z" />
    </>
  ),
  door: (
    <>
      <path d="M12 42V6h24v36" />
      <path d="M7 42h34" />
      <path d="M16.5 10.5h15v12h-15zM16.5 26.5h15v11h-15z" />
      <path d="M29 23.5v3" />
    </>
  ),
  window: (
    <>
      <path d="M11 41V20a13 13 0 0 1 26 0v21z" />
      <path d="M24 7v34M11 24h26" />
      <path d="M7.5 41h33" />
    </>
  ),
  container: (
    <>
      <path d="M5 17l19-7 19 7-19 7z" />
      <path d="M5 17v15l19 7 19-7V17M24 24v15" />
      <path d="M11 19.2v14.9M17 21.4v14.9M31 21.4v14.9M37 19.2v14.9" />
    </>
  ),
  repair: (
    <>
      <path
        {...s2}
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </>
  ),
  bend: (
    <>
      <path d="M6 40h22a12 12 0 0 0 0-24H16" />
      <path d="M6 35h22a7 7 0 0 0 0-14H16" />
      <path d="M6 35v5M16 16v5" />
      <path d="M38 8l3 3-3 3" />
    </>
  ),
  column: (
    <>
      <path d="M10 7h28M13 7v5h22V7" />
      <path d="M17 12v26M31 12v26M22 15v20M26 15v20" />
      <path d="M13 38h22v4H13zM9 42h30" />
    </>
  ),
  beam: (
    <>
      <path d="M8 14h14v3h-5v14h5v3H8v-3h5V17H8z" />
      <path d="M8 14l16-7h14l-16 7" />
      <path d="M38 7v3l-16 7M33 10v14" />
      <path d="M22 31l16-7v3l-16 7" />
    </>
  ),
  deck: (
    <>
      <path d="M6 18l12-8h24l-12 8z" />
      <path d="M6 18v4h24v-4M30 22l12-8v-4" />
      <path d="M10 15.3h24M14 12.7h24M14 18l12-8M22 18l12-8" />
      <path d="M10 22v18M26 22v18M38 16.7v17.3M6 40h24" />
    </>
  ),
  grid: (
    <>
      <path d="M9 9h8v8H9zM20 9h8v8h-8zM31 9h8v8h-8z" />
      <path d="M9 20h8v8H9zM20 20h8v8h-8zM31 20h8v8h-8z" />
      <path d="M9 31h8v8H9zM20 31h8v8h-8zM31 31h8v8h-8z" />
    </>
  ),
  phone: (
    <>
      <path
        {...s2}
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      />
      <path {...s2} d="M14.05 2a9 9 0 0 1 8 7.94M14.05 6A5 5 0 0 1 18 10" />
    </>
  ),
  pin: (
    <>
      <path
        {...s2}
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
      />
      <path {...s2} d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </>
  ),
  clock: (
    <>
      <path d="M24 6a18 18 0 1 0 0 36 18 18 0 0 0 0-36z" />
      <path d="M24 13v11l7.5 4.5" />
      <path d="M24 9.5v1.5M38.5 24H37M24 38.5V37M9.5 24H11" />
    </>
  ),
  arch: (
    <>
      <path d="M12 41V23a12 12 0 0 1 24 0v18z" />
      <path d="M12 23h24M24 23V11M24 23l-8.5-8.5M24 23l8.5-8.5M24 23v18" />
      <path d="M12 32h24M8.5 41h31" />
    </>
  ),
};

type LineIconProps = SVGProps<SVGSVGElement> & { name: IconName; draw?: boolean };

export function LineIcon({ name, draw = true, className, ...rest }: LineIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-draw={draw ? "" : undefined}
      className={className}
      {...rest}
    >
      <PathLength>{paths[name]}</PathLength>
    </svg>
  );
}

// Adds pathLength="1" to each path so the draw animation is length-independent.
function PathLength({ children }: { children: React.ReactNode }) {
  const fragment = children as React.ReactElement<{ children: React.ReactNode }>;
  const kids = Array.isArray(fragment.props.children)
    ? fragment.props.children
    : [fragment.props.children];
  return (
    <>
      {kids.map((child, i) => {
        const el = child as React.ReactElement<SVGProps<SVGPathElement>>;
        return <path key={i} {...el.props} pathLength={1} />;
      })}
    </>
  );
}

// Small UI glyphs (24px grid, not animated).
type GlyphProps = SVGProps<SVGSVGElement>;
const glyph = (d: React.ReactNode, fill = false) =>
  function Glyph({ className, ...rest }: GlyphProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill={fill ? "currentColor" : "none"}
        stroke={fill ? "none" : "currentColor"}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
        {...rest}
      >
        {d}
      </svg>
    );
  };

export const ArrowRight = glyph(<path d="M3 12h17m-6-6 6 6-6 6" />);
export const ArrowUpRight = glyph(<path d="M7 17 17 7M8 7h9v9" />);
export const ArrowUp = glyph(<path d="M12 20V4m-6 6 6-6 6 6" />);
export const Expand = glyph(<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />);
export const Menu = glyph(<path d="M4 8h16M4 16h16" />);
export const Close = glyph(<path d="M6 6l12 12M18 6 6 18" />);
export const Pause = glyph(<path d="M9 6v12M15 6v12" />);
export const Play = glyph(<path d="M8 5.5v13l10.5-6.5z" />);
export const Mail = glyph(
  <>
    <path d="M3 6.5h18v11H3z" />
    <path d="m3.5 7 8.5 6.5L20.5 7" />
  </>,
);
export const Phone = glyph(
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />,
);
export const Clock = glyph(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </>,
);
export const MapPin = glyph(
  <>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </>,
);
export const WhatsApp = glyph(
  <>
    <path d="M12 3a9 9 0 0 0-7.79 13.5L3 21l4.63-1.2A9 9 0 1 0 12 3z" />
    <path d="M9 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5a6 6 0 0 0 2.7 2.4c.2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5v.4c0 .4-.2.8-.6 1-1 .5-2.3.4-3.9-.4a9.3 9.3 0 0 1-3.7-3.6C8.5 10.8 8.6 9.5 9 8.6z" />
  </>,
);
export const Instagram = glyph(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </>,
);
export const Telegram = glyph(
  <>
    <path d="M21.5 4.5 2.8 11.7c-.6.2-.6 1.1 0 1.3l4.7 1.6 1.8 5.6c.2.6 1 .8 1.4.3l2.6-2.7 4.7 3.5c.5.4 1.3.1 1.4-.5l2.9-15c.1-.6-.5-1.1-1.1-.8z" />
    <path d="m7.5 14.6 9.9-6.6-7.2 7.6" />
  </>,
);
