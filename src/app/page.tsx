"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getStreakStatus, yesterdayKey } from "@/lib/progress";
import { DuoButton } from "@/components/DuoButton";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LessonPath } from "@/components/LessonPath";
import { WeekStreakCalendar } from "@/components/WeekStreakCalendar";
import { ClioMascot } from "@/components/ClioMascot";
import { DragonMascot } from "@/components/DragonMascot";
import { FlameIcon, FreezeIcon, StarIcon } from "@/components/icons";
import { useState, type ReactNode } from "react";

export default function Home() {
  const { language, languageId, setLanguageId, hydrated: langHydrated } = useLanguage();
  const { progress, hydrated: progressHydrated, resetDemo } = useProgress();
  const { user } = useAuth();
  const allowed = useRequireAuth();
  const [resetting, setResetting] = useState(false);

  if (!langHydrated || !progressHydrated || !allowed) {
    return <LoadingScreen />;
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
    <div className="coastal-home flex min-h-screen flex-col">
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

        <section aria-label="Lesson path" className="coastal-map relative isolate flex flex-col items-center pb-32 pt-8">
          <svg className="coastal-waves" viewBox="0 0 800 1200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <g fill="none" stroke="#effcf9" strokeLinecap="round">
              <path d="M-80 430C100 345 215 525 400 445S690 355 880 440" strokeWidth="18" />
              <path d="M-80 760C120 835 245 660 445 740S735 825 880 735" strokeWidth="24" />
              <path d="M-80 1040C90 950 250 1110 440 1040S710 960 880 1030" strokeWidth="18" />
            </g>
          </svg>
          <svg className="coastal-hills" viewBox="0 0 600 260" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M0 90Q60 10 125 100T280 105T450 80T600 95V260H0Z" fill="#c5e8db" />
            <path d="M0 160Q80 80 170 155T340 150T510 140T600 160V260H0Z" fill="#acdcd4" />
          </svg>
          <LessonPath languageId={language.id} progress={progress} />
          <div aria-hidden="true" className="coastal-clio absolute bottom-0 right-2 h-28 w-28 sm:right-8 sm:h-32 sm:w-32">
            <ClioMascot animated={false} className="h-full w-full" />
          </div>
        </section>

        <section aria-labelledby="progress-heading" className="progress-panel">
          <div className="progress-banner">
            <div aria-hidden="true" className="progress-dragon">
              <DragonMascot animated={false} className="h-full w-full" />
            </div>
            <h2 id="progress-heading">Your progress</h2>
          </div>
          <div className="progress-body">
            <div className={`progress-stats ${user ? "progress-stats-four" : ""}`}>
              <ProgressStat label="Lessons completed" value={progress.lessonsCompleted} tone="green" icon={<StarIcon className="h-8 w-8 text-[#58a700]" />} />
              <ProgressStat label="Current streak" value={progress.currentStreak} tone="sand" icon={<FlameIcon className="h-8 w-8" />} />
              <ProgressStat label="Longest streak" value={progress.longestStreak} tone="aqua" icon={
                <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none">
                  <path d="M6 12L13 18L20 7L27 18L34 12L30 30H10Z" fill="#ffc800" stroke="#e5ac00" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M11 34H29" stroke="#e5ac00" strokeWidth="3" strokeLinecap="round" />
                </svg>
              } />
              {user && <ProgressStat label="Streak freezes" value={progress.freezesAvailable} tone="aqua" icon={<FreezeIcon className="h-8 w-8" />} />}
            </div>
            <div className="progress-week">
              <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-[#54747a]">This week</h3>
              <WeekStreakCalendar history={progress.history} frozenDates={progress.frozenDates} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProgressStat({ label, value, tone, icon }: { label: string; value: number; tone: "green" | "sand" | "aqua"; icon: ReactNode }) {
  return (
    <div className={`progress-stat progress-stat-${tone}`}>
      <span aria-hidden="true" className="progress-stat-icon">{icon}</span>
      <span className="progress-stat-value">{value}</span>
      <span className="progress-stat-label">{label}</span>
    </div>
  );
}
