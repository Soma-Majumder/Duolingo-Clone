"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ProgressState, getStreakStatus } from "@/lib/progress";
import { FreezeBadge, StreakBadge, XpBadge } from "./StatBadge";

export function AppHeader({ progress }: { progress: ProgressState }) {
  const { user, ready, signOut, configured } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-duo-gray-200 bg-white px-4 py-3 sm:px-8">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-duo-green text-lg font-black text-white">
          D
        </div>
        <span className="hidden text-lg font-extrabold text-duo-green sm:inline">Duolingo</span>
      </div>
      <div className="flex items-center gap-3">
        <StreakBadge count={progress.currentStreak} status={getStreakStatus(progress)} />
        {user && <FreezeBadge count={progress.freezesAvailable} />}
        <XpBadge xp={progress.totalXP} />
        {configured &&
          ready &&
          (user ? (
            <button
              onClick={signOut}
              className="text-sm font-extrabold uppercase tracking-wide text-duo-gray-500 hover:text-duo-eel"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-extrabold uppercase tracking-wide text-duo-blue hover:text-duo-blue-dark"
            >
              Log in
            </Link>
          ))}
      </div>
    </header>
  );
}
