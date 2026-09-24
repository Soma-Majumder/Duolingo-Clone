import Link from "next/link";
import type { ReactNode } from "react";
import { ClioMascot } from "./ClioMascot";
import { DuoButton } from "./DuoButton";
import { FlameIcon, BoltIcon } from "./icons";

export function LessonComplete({
  xpEarned,
  mistakes,
  totalExercises,
  currentStreak,
}: {
  xpEarned: number;
  mistakes: number;
  totalExercises: number;
  currentStreak: number;
}) {
  const correct = totalExercises - mistakes;
  const perfect = mistakes === 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <ClioMascot className="h-32 w-32 animate-duo-bounce" />
      <div>
        <h1 className="text-3xl font-extrabold text-duo-eel">Lesson Complete!</h1>
        {perfect && (
          <p className="mt-1 font-bold text-duo-orange">Perfect lesson! No mistakes 🎉</p>
        )}
      </div>

      <div className="grid w-full max-w-sm grid-cols-3 gap-3">
        <StatCard icon={<BoltIcon className="h-8 w-8" />} label="Total XP" value={`+${xpEarned}`} />
        <StatCard
          icon={<FlameIcon className="h-8 w-8" />}
          label="Streak"
          value={String(currentStreak)}
        />
        <StatCard label="Correct" value={`${correct}/${totalExercises}`} />
      </div>

      <div className="mt-4 flex w-full max-w-sm flex-col gap-3">
        <Link href="/" className="w-full">
          <DuoButton variant="primary" className="w-full">
            Continue
          </DuoButton>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-duo-gray-200 bg-white px-2 py-4">
      {icon}
      <span className="text-lg font-extrabold text-duo-eel">{value}</span>
      <span className="text-xs font-bold uppercase text-duo-gray-400">{label}</span>
    </div>
  );
}
