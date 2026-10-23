/** Faint fabrication drawing (gate elevation + dimension lines), echoing the mockup's blueprint texture. */
export function Blueprint({ className, ...rest }: { className?: string } & React.SVGProps<SVGSVGElement>) {
  const bars = Array.from({ length: 8 }, (_, i) => 96 + i * 21);
  const grid = Array.from({ length: 11 }, (_, i) => i * 40);
  return (
    <svg
      viewBox="0 0 400 800"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMinYMid slice"
      {...rest}
    >
      <g opacity={0.35}>
        {grid.map((x) => (
          <path key={`v${x}`} d={`M${x} 0v800`} />
        ))}
        {Array.from({ length: 21 }, (_, i) => i * 40).map((y) => (
          <path key={`h${y}`} d={`M0 ${y}h400`} />
        ))}
      </g>
      <path d="M60 600V170q110-80 220 0v430z" />
      <path d="M76 600V184q94-66 188 0v416z" />
      {bars.map((x) => (
        <path key={x} d={`M${x} ${x < 170 ? 184 - (x - 76) * 0.55 : 184 - (264 - x) * 0.55}V600`} />
      ))}
      <path d="M76 300h188M76 470h188" />
      {[117, 170, 223].map((cx) => (
        <circle key={cx} cx={cx} cy={385} r={14} />
      ))}
      <path d="M60 640h220M60 632v16M280 632v16" />
      <path d="M66 636l-6 4 6 4M274 636l6 4-6 4" />
      <path d="M320 600V110M312 600h16M312 110h16" />
      <path d="M316 116l4-6 4 6M316 594l4 6 4-6" />
      <path d="M170 60v700" strokeDasharray="10 6 2 6" opacity={0.6} />
      <circle cx={170} cy={385} r={60} strokeDasharray="3 5" opacity={0.6} />
    </svg>
  );
}
