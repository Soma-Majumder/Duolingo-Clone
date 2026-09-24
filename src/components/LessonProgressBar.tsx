export function LessonProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="h-4 w-full flex-1 overflow-hidden rounded-full bg-duo-gray-200">
        <div
          className="h-full rounded-full bg-duo-green transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="shrink-0 text-xs font-extrabold tabular-nums text-duo-gray-400"
        aria-label={`${current} of ${total} activities completed`}
      >
        {current}/{total}
      </span>
    </div>
  );
}
