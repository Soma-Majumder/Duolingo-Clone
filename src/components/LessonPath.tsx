"use client";

import { useRouter } from "next/navigation";
import { getLessonPath } from "@/lib/lessonContent";
import { ProgressState, getUnlockedIndex } from "@/lib/progress";
import { CheckIcon, LockIcon, StarIcon } from "./icons";

export function LessonPath({
  languageId,
  progress,
}: {
  languageId: string;
  progress: ProgressState;
}) {
  const router = useRouter();
  const path = getLessonPath(languageId);
  const unlockedIndex = getUnlockedIndex(progress, path);
  const pathComplete = unlockedIndex >= path.length;

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      {path.map((lesson, i) => {
        const isComplete = i < unlockedIndex;
        const isCurrent = i === unlockedIndex;
        const isLocked = i > unlockedIndex;

        return (
          <div key={lesson.id} className="flex flex-col items-center gap-2">
            {i > 0 && (
              <div className="h-8 w-1 rounded-full border-l-4 border-dashed border-duo-gray-300" />
            )}
            <button
              onClick={() => {
                if (isLocked) return;
                router.push(isComplete ? `/lesson/${i}/practice` : `/lesson/${i}`);
              }}
              disabled={isLocked}
              aria-label={
                isComplete
                  ? `Practice ${lesson.title}`
                  : isCurrent
                    ? `Start ${lesson.title}`
                    : `${lesson.title} (locked)`
              }
              className={`relative flex items-center justify-center rounded-full border-b-8 transition-transform active:translate-y-1 active:border-b-4 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-8 ${
                isCurrent ? "h-24 w-24" : "h-20 w-20"
              } ${
                isLocked
                  ? "border-duo-gray-300 bg-duo-gray-200"
                  : `border-duo-green-dark bg-duo-green ${isCurrent ? "animate-duo-pulse-ring" : ""}`
              }`}
            >
              {isLocked ? (
                <LockIcon className="h-8 w-8" />
              ) : isComplete ? (
                <CheckIcon className="h-8 w-8" />
              ) : (
                <StarIcon className="h-10 w-10" />
              )}
            </button>
            <span
              className={`text-xs font-extrabold uppercase tracking-wide ${
                isLocked ? "text-duo-gray-400" : "text-duo-eel"
              }`}
            >
              {lesson.title}
            </span>
          </div>
        );
      })}

      {pathComplete && (
        <p className="mt-2 text-sm font-bold text-duo-green-dark">
          Path complete! Great work 🎉
        </p>
      )}
    </div>
  );
}
