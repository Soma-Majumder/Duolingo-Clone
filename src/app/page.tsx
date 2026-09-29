"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { getStreakStatus, yesterdayKey } from "@/lib/progress";
import { DuoButton } from "@/components/DuoButton";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LessonPath } from "@/components/LessonPath";
import { WeekStreakCalendar } from "@/components/WeekStreakCalendar";
import { DragonMascot } from "@/components/DragonMascot";
import { ClioMascot } from "@/components/ClioMascot";
import { FlameIcon, FreezeIcon } from "@/components/icons";
import { useState } from "react";

export default function Home() {
  const { language, languageId, setLanguageId, hydrated: langHydrated } = useLanguage();
  const { progress, hydrated: progressHydrated, resetDemo } = useProgress();
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);

  if (!langHydrated || !progressHydrated) {
    return <div className="min-h-screen bg-white" />;
  }

  const streakStatus = getStreakStatus(progress);
  const isDemo = !!user && user.email === process.env.NEXT_PUBLIC_DEMO_EMAIL;
  const frozeYesterday = progress.frozenDates.includes(yesterdayKey());

  async function onResetDemo() {
    setResetting(true);
    try {
      await resetDemo();
    } catch (err) {
      console.error("Could not reset the demo", err);
    }
    setResetting(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AppHeader progress={progress} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <LanguageSwitcher languageId={languageId} onChange={setLanguageId} />
        </div>

        {frozeYesterday && (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-duo-blue bg-duo-blue-light px-4 py-3">
            <FreezeIcon className="h-7 w-7 shrink-0" />
            <p className="text-sm font-bold text-duo-blue-dark">
              A streak freeze protected your streak yesterday. Finish today&apos;s lesson to keep it
              going.
            </p>
          </div>
        )}

        {streakStatus === "at-risk" && (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-duo-orange bg-duo-orange-light px-4 py-3">
            <FlameIcon className="h-7 w-7 shrink-0" />
            <p className="text-sm font-bold text-duo-orange-dark">
              Your {progress.currentStreak}-day streak is at risk! Finish today&apos;s lesson to keep it
              going.
            </p>
          </div>
        )}

        {isDemo && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-duo-gray-200 bg-duo-gray-100 px-4 py-3">
            <p className="text-sm font-bold text-duo-gray-500">
              You&apos;re using the shared demo account. Anyone can change it.
            </p>
            <DuoButton variant="outline" className="shrink-0 px-4 py-2" disabled={resetting} onClick={onResetDemo}>
              Reset demo
            </DuoButton>
          </div>
        )}

        <section className="flex flex-col items-center rounded-3xl border-2 border-duo-gray-200 bg-duo-gray-100 py-8">
          <div className="flex items-end gap-2">
            <DragonMascot className="h-20 w-20" />
            <ClioMascot className="h-20 w-20" />
          </div>
          <LessonPath languageId={language.id} progress={progress} />
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border-2 border-duo-gray-200 p-5">
          <h2 className="text-lg font-extrabold text-duo-eel">Your progress</h2>
          <div className={`grid grid-cols-2 gap-3 ${user ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
            <ProgressStat label="Lessons completed" value={progress.lessonsCompleted} />
            <ProgressStat label="Current streak" value={progress.currentStreak} />
            <ProgressStat label="Longest streak" value={progress.longestStreak} />
            {user && <ProgressStat label="Streak freezes" value={progress.freezesAvailable} />}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-duo-gray-400">
              This week
            </h3>
            <WeekStreakCalendar history={progress.history} frozenDates={progress.frozenDates} />
          </div>
        </section>
      </main>
    </div>
  );
}

function ProgressStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-duo-gray-100 px-3 py-4">
      <span className="text-2xl font-extrabold text-duo-eel">{value}</span>
      <span className="text-center text-xs font-bold uppercase text-duo-gray-500">{label}</span>
    </div>
  );
}
