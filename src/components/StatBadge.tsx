import { ReactNode } from "react";
import { StreakStatus } from "@/lib/progress";
import { BoltIcon, FlameIcon } from "./icons";

function Badge({
  tone = "neutral",
  title,
  children,
}: {
  tone?: "neutral" | "warning";
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-2xl border-2 px-3 py-1.5 ${
        tone === "warning" ? "border-duo-orange/40 bg-duo-orange-light" : "border-duo-gray-200 bg-white"
      }`}
      title={title}
    >
      {children}
    </div>
  );
}

export function StreakBadge({ count, status }: { count: number; status: StreakStatus }) {
  const active = status !== "none";
  return (
    <Badge
      tone={status === "at-risk" ? "warning" : "neutral"}
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
    </Badge>
  );
}

export function XpBadge({ xp }: { xp: number }) {
  return (
    <Badge>
      <BoltIcon className="h-6 w-6" />
      <span className="text-lg font-extrabold text-duo-eel">{xp}</span>
    </Badge>
  );
}
