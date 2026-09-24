"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useProgress } from "@/hooks/useProgress";
import { getStreakStatus } from "@/lib/progress";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LessonPath } from "@/components/LessonPath";
import { WeekStreakCalendar } from "@/components/WeekStreakCalendar";
import { DragonMascot } from "@/components/DragonMascot";
import { ClioMascot } from "@/components/ClioMascot";

export default function Home() {
  const { language, languageId, setLanguageId, hydrated: langHydrated } = useLanguage();
  const { progress, hydrated: progressHydrated } = useProgress();

  if (!langHydrated || !progressHydrated) {
    return <div className="min-h-screen bg-white" />;
  }

  const streakStatus = getStreakStatus(progress);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AppHeader progress={progress} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <LanguageSwitcher languageId={languageId} onChange={setLanguageId} />
        </div>

        {streakStatus === "at-risk" && (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-duo-orange bg-duo-orange-light px-4 py-3">
            <span className="text-2xl">🔥</span>
            <p className="text-sm font-bold text-duo-orange-dark">
              Your {progress.currentStreak}-day streak is at risk! Finish today&apos;s lesson to keep it
              going.
            </p>
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ProgressStat label="Lessons completed" value={progress.lessonsCompleted} />
            <ProgressStat label="Current streak" value={progress.currentStreak} />
            <ProgressStat label="Longest streak" value={progress.longestStreak} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-duo-gray-400">
              This week
            </h3>
            <WeekStreakCalendar history={progress.history} />
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
