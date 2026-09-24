"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useProgress } from "@/hooks/useProgress";
import { getLessonPath } from "@/lib/lessonContent";
import { getUnlockedIndex } from "@/lib/progress";
import { LessonRunner } from "@/components/LessonRunner";

export default function LessonPage() {
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const { language, hydrated: langHydrated } = useLanguage();
  const { progress, hydrated: progressHydrated, recordLessonComplete } = useProgress();

  const path = langHydrated ? getLessonPath(language.id) : [];
  const index = Number(params.index);
  const unlockedIndex = getUnlockedIndex(progress, path);
  const lesson = path[index];

  // Only the current frontier lesson can be started fresh here; a completed
  // lesson is reviewed via /lesson/[index]/practice instead, and a locked
  // one isn't reachable at all — send both back to the path.
  const isValid = Boolean(lesson) && index === unlockedIndex;

  useEffect(() => {
    if (langHydrated && progressHydrated && !isValid) {
      router.replace("/");
    }
  }, [langHydrated, progressHydrated, isValid, router]);

  if (!langHydrated || !progressHydrated || !isValid) return null;

  return (
    <LessonRunner
      lessonId={lesson.id}
      title={`${language.flag} ${lesson.title}`}
      exercises={lesson.exercises}
      progress={progress}
      recordLessonComplete={recordLessonComplete}
    />
  );
}
