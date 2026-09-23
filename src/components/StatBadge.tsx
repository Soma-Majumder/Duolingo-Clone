import { StreakStatus } from "@/lib/progress";
import { BoltIcon, FlameIcon } from "./icons";

export function StreakBadge({ count, status }: { count: number; status: StreakStatus }) {
  const active = status !== "none";
  return (
    <div
      className={`flex items-center gap-1.5 rounded-2xl border-2 px-3 py-1.5 ${
        status === "at-risk"
          ? "border-duo-orange/40 bg-orange-50"
          : "border-duo-gray-200 bg-white"
      }`}
      title={
        status === "at-risk"
          ? "Your streak is at risk — complete today's lesson!"
          : status === "done-today"
            ? "Today's lesson is done. Streak is safe."
            : "Complete a lesson to start your streak."
      }
    >
      <FlameIcon className={`h-6 w-6 ${status === "at-risk" ? "animate-duo-bounce" : ""}`} active={active} />
      <span className={`text-lg font-extrabold ${active ? "text-duo-eel" : "text-duo-gray-400"}`}>
        {count}
      </span>
    </div>
  );
}

export function XpBadge({ xp }: { xp: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl border-2 border-duo-gray-200 bg-white px-3 py-1.5">
      <BoltIcon className="h-6 w-6" />
      <span className="text-lg font-extrabold text-duo-eel">{xp}</span>
    </div>
  );
}
