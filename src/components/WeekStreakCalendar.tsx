import { DayRecord, dateKey, todayKey } from "@/lib/progress";
import { FlameIcon } from "./icons";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export function WeekStreakCalendar({ history }: { history: DayRecord[] }) {
  const completedDates = new Set(history.map((h) => h.date));
  const today = todayKey();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = dateKey(d);
    return { key, letter: DAY_LETTERS[d.getDay()], done: completedDates.has(key), isToday: key === today };
  });

  return (
    <div className="flex items-center justify-between gap-1.5">
      {days.map((day) => (
        <div key={day.key} className="flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-duo-gray-400">{day.letter}</span>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              day.isToday ? "ring-2 ring-duo-blue ring-offset-2" : ""
            } ${day.done ? "bg-duo-orange-light" : "bg-duo-gray-100"}`}
          >
            <FlameIcon className="h-5 w-5" active={day.done} />
          </div>
        </div>
      ))}
    </div>
  );
}
