/**
 * Phone ember layer: 35 compositor-only CSS particles (transform + opacity), so
 * they cost the main thread nothing. Desktop uses the canvas SparkField instead.
 * Positions come from a fixed seed so server and client markup match.
 */
export function Embers({ count = 35, className }: { count?: number; className?: string }) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const embers = Array.from({ length: count }, () => {
    const duration = 4 + rand() * 5;
    return {
      "--x": `${(8 + rand() * 88).toFixed(1)}%`,
      "--b": `${(rand() * 35).toFixed(1)}%`,
      "--s": `${(2 + rand() * 4).toFixed(1)}px`,
      "--d": `${duration.toFixed(2)}s`,
      "--delay": `${(-rand() * duration).toFixed(2)}s`,
      "--rise": `${(-40 - rand() * 45).toFixed(0)}vh`,
      "--dx": `${(-20 + rand() * 50).toFixed(0)}px`,
      "--o": (0.55 + rand() * 0.45).toFixed(2),
      "--sway": `${(1.6 + rand() * 1.8).toFixed(2)}s`,
    } as React.CSSProperties;
  });

  return (
    <div aria-hidden="true" className={className}>
      {embers.map((style, i) => (
        <span key={i} className="ember" style={style}>
          <span />
        </span>
      ))}
    </div>
  );
}
