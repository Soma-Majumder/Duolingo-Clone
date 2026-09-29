import { FlameIcon, FreezeIcon } from "./icons";

type DayState = "done" | "frozen" | "today";

// A fixed sample week (no dates, so it renders identically on server and client)
// that shows what a streak freeze does: Wednesday was missed but protected.
const SAMPLE_WEEK: { letter: string; state: DayState }[] = [
  { letter: "M", state: "done" },
  { letter: "T", state: "done" },
  { letter: "W", state: "frozen" },
  { letter: "T", state: "done" },
  { letter: "F", state: "done" },
  { letter: "S", state: "done" },
  { letter: "S", state: "today" },
];

export function StreakPreview() {
  return (
    <div className="w-full max-w-sm rounded-3xl border-2 border-duo-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <FlameIcon className="h-7 w-7" />
        <span className="text-lg font-extrabold text-duo-eel">7 day streak</span>
      </div>
      <div className="flex items-center justify-between gap-1.5">
        {SAMPLE_WEEK.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-duo-gray-400">{day.letter}</span>
            <div
              className={`flex h-9 w-9 items-center sm:h-10 sm:w-10 justify-center rounded-full ${
                day.state === "frozen" ? "bg-duo-blue-light" : "bg-duo-orange-light"
              } ${day.state === "today" ? "ring-2 ring-duo-blue ring-offset-2" : ""}`}
            >
              {day.state === "frozen" ? (
                <FreezeIcon className="h-5 w-5" />
              ) : (
                <FlameIcon className="h-5 w-5" />
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold text-duo-gray-500">
        Missed a day? A streak freeze keeps your streak alive.
      </p>
    </div>
  );
}
