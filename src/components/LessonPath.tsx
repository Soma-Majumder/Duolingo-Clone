import { CheckIcon, LockIcon, StarIcon } from "./icons";

export function LessonPath({
  lessonTitle,
  doneToday,
  onStart,
}: {
  lessonTitle: string;
  doneToday: boolean;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <button
        onClick={onStart}
        className={`relative flex h-24 w-24 items-center justify-center rounded-full border-b-8 transition-transform active:translate-y-1 active:border-b-4 ${
          doneToday
            ? "border-duo-green-dark bg-duo-green"
            : "border-duo-green-dark bg-duo-green animate-duo-pulse-ring"
        }`}
        aria-label={doneToday ? "Practice again" : "Start today's lesson"}
      >
        {doneToday ? <CheckIcon className="h-10 w-10" /> : <StarIcon className="h-10 w-10" />}
      </button>
      <span className="text-sm font-extrabold uppercase tracking-wide text-duo-eel">
        {doneToday ? "Practice more" : `Start: ${lessonTitle}`}
      </span>

      <div className="h-8 w-1 rounded-full border-l-4 border-dashed border-duo-gray-300" />

      <div className="flex h-20 w-20 items-center justify-center rounded-full border-b-8 border-duo-gray-300 bg-duo-gray-200">
        <LockIcon className="h-8 w-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wide text-duo-gray-400">
        Tomorrow&apos;s lesson
      </span>
    </div>
  );
}
