// Flat, layered flame: a 3-peak outline nested 4x (shrinking toward the
// tip) for the red/orange/yellow/white-core look, plus 4 small drifting
// droplets. Reused as-is per layer via FLAME_PATH + anchorFlameScale, which
// scales/repositions the same outline toward its own bottom tip (210,480).
const FLAME_PATH =
  "M210,80 C225,120 240,150 255,190 C270,170 280,155 290,150 C330,190 360,250 360,300 " +
  "C360,380 320,450 210,480 C100,450 60,380 60,300 C60,250 90,190 130,140 " +
  "C140,155 150,170 160,210 C175,150 190,120 210,80 Z";

function anchorFlameScale(scale: number) {
  return `translate(${210 * (1 - scale)} ${480 * (1 - scale)}) scale(${scale})`;
}

const FLAME_DROPLETS: { cx: number; cy: number; rotate: number; scale: number }[] = [
  { cx: 180, cy: 40, rotate: -15, scale: 0.9 },
  { cx: 320, cy: 120, rotate: 20, scale: 0.7 },
  { cx: 400, cy: 240, rotate: 15, scale: 0.55 },
  { cx: 20, cy: 230, rotate: -20, scale: 0.65 },
];

export function FlameIcon({ className = "", active = true }: { className?: string; active?: boolean }) {
  const outer = active ? "#ED6C52" : "var(--color-duo-gray-300)";
  const middle = active ? "#F6A623" : "var(--color-duo-gray-300)";
  const inner = active ? "#F6DE5C" : "var(--color-duo-gray-300)";
  const core = active ? "#EDEDED" : "var(--color-duo-gray-300)";

  return (
    <svg
      viewBox="0 0 420 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={active ? "Active flame" : "Inactive flame"}
    >
      {FLAME_DROPLETS.map(({ cx, cy, rotate, scale }, i) => (
        <path
          key={i}
          d={`M${cx},${cy - 32} C${cx + 16},${cy - 16} ${cx + 16},${cy + 16} ${cx},${cy + 32} C${cx - 16},${cy + 16} ${cx - 16},${cy - 16} ${cx},${cy - 32}Z`}
          fill={outer}
          transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale}) translate(${-cx} ${-cy})`}
        />
      ))}
      <path d={FLAME_PATH} fill={outer} />
      <path d={FLAME_PATH} fill={middle} transform={anchorFlameScale(0.72)} />
      <path d={FLAME_PATH} fill={inner} transform={anchorFlameScale(0.48)} />
      <path d={FLAME_PATH} fill={core} transform={anchorFlameScale(0.22)} />
    </svg>
  );
}

export function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
        fill="var(--color-duo-yellow)"
        stroke="var(--color-duo-yellow-dark)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="var(--color-duo-gray-400)" />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="var(--color-duo-gray-400)"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13l4 4 10-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5l2.9 6 6.6.7-4.9 4.5 1.3 6.5L12 16.9 6.1 20.2l1.3-6.5-4.9-4.5 6.6-.7L12 2.5Z"
        fill="white"
      />
    </svg>
  );
}
