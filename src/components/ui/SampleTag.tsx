/** Marks a sample photo (credited on /credits) so nobody mistakes it for the client's own work. Disappears once real photos replace it. */
export function SampleTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute left-3 top-3 z-[1] rounded-full bg-ink/70 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm ${className}`}
    >
      Sample photo
    </span>
  );
}
