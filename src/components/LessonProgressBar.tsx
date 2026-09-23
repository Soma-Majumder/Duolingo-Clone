export function LessonProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-4 w-full overflow-hidden rounded-full bg-duo-gray-200">
      <div
        className="h-full rounded-full bg-duo-green transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
