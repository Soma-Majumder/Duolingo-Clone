"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { consumeLessonUnlock } from "@/lib/lessonUnlock";
import { getLessonPath } from "@/lib/lessonContent";
import { ProgressState, getUnlockedIndex } from "@/lib/progress";
import { DragonMascot } from "./DragonMascot";
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
  const currentLessonId = path[unlockedIndex]?.id;
  const currentNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentLessonId || !consumeLessonUnlock(currentLessonId)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    currentNode.current?.animate?.(
      [
        { transform: "scale(0.8)" },
        { transform: "scale(1.12)", offset: 0.6 },
        { transform: "scale(1)" },
      ],
      { duration: 550, easing: "ease-out" },
    );
  }, [currentLessonId]);

  return (
    <div className="lesson-path flex w-full max-w-sm flex-col items-center px-3 pb-6 pt-12">
      {path.map((lesson, i) => {
        const isComplete = i < unlockedIndex;
        const isCurrent = i === unlockedIndex;
        const isLocked = i > unlockedIndex;
        const position = i % 2 === 0 ? 28 : 72;
        const previousPosition = i % 2 === 0 ? 72 : 28;

        return (
          <div key={lesson.id} className="relative w-full">
            {i > 0 && (
              <svg aria-hidden="true" focusable="false" viewBox="0 0 100 64" preserveAspectRatio="none" className="my-3 h-16 w-full overflow-visible">
                <path
                  d={`M ${previousPosition} 0 C ${previousPosition} 28, ${position} 36, ${position} 64`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="6 10"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className={isLocked ? "text-[#78aaa4]" : "text-duo-green"}
                />
              </svg>
            )}
            <div className="relative flex w-1/2 -translate-x-1/2 flex-col items-center gap-2" style={{ left: `${position}%` }}>
            <svg className="lesson-island" viewBox="0 0 150 55" aria-hidden="true" focusable="false">
              <ellipse cx="75" cy="45" rx="72" ry="9" fill="#65becb" opacity=".25" />
              <path d="M3 27Q75 3 147 27V34Q75 61 3 34Z" fill="#e8cf99" />
              <ellipse cx="75" cy="27" rx="72" ry="20" fill="#b8d98c" />
              <ellipse cx="75" cy="24" rx="60" ry="14" fill="#a3ce79" />
            </svg>
            {isCurrent && <span className="lesson-start-bubble">Start here</span>}
            <div className="relative" ref={isCurrent ? currentNode : undefined}>
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
            </div>
            <span
              className={`relative rounded-full bg-white/95 px-3 py-1 text-center text-xs font-extrabold uppercase tracking-wide ${
                isLocked ? "text-duo-gray-500" : "text-duo-eel"
              }`}
            >
              {lesson.title}
            </span>
            </div>
            {isCurrent && (
              <div aria-hidden="true" className="lesson-guide" style={{ left: `${previousPosition}%` }}>
                <DragonMascot animated={false} className="h-full w-full" />
              </div>
            )}
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
