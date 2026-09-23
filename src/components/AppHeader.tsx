"use client";

import { ProgressState, getStreakStatus } from "@/lib/progress";
import { StreakBadge, XpBadge } from "./StatBadge";

export function AppHeader({ progress }: { progress: ProgressState }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-duo-gray-200 bg-white px-4 py-3 sm:px-8">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-duo-green text-lg font-black text-white">
          D
        </div>
        <span className="hidden text-lg font-extrabold text-duo-green sm:inline">duolingo</span>
      </div>
      <div className="flex items-center gap-3">
        <StreakBadge count={progress.currentStreak} status={getStreakStatus(progress)} />
        <XpBadge xp={progress.totalXP} />
      </div>
    </header>
  );
}
