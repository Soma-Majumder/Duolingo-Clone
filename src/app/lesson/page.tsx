"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useProgress } from "@/hooks/useProgress";
import { getLessonForLanguage } from "@/lib/lessonContent";
import { LessonRunner } from "@/components/LessonRunner";

export default function LessonPage() {
  const { language, hydrated: langHydrated } = useLanguage();
  const { progress, hydrated: progressHydrated, recordLessonComplete } = useProgress();

  if (!langHydrated || !progressHydrated) return null;

  const lesson = getLessonForLanguage(language.id);

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
