"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useProgress } from "@/hooks/useProgress";
import { getLessonForLanguage } from "@/lib/lessonContent";
import { Exercise } from "@/lib/exercises";
import { LessonRunner } from "@/components/LessonRunner";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PracticePage() {
  const { language, hydrated: langHydrated } = useLanguage();
  const { progress, hydrated: progressHydrated, recordLessonComplete } = useProgress();
  const [exercises, setExercises] = useState<Exercise[] | null>(null);

  useEffect(() => {
    // Shuffling needs Math.random(), which must run client-side only so it
    // doesn't disagree with the server-rendered output.
    if (!langHydrated) return;
    const lesson = getLessonForLanguage(language.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExercises(shuffle(lesson.exercises).slice(0, 3));
  }, [langHydrated, language.id]);

  if (!langHydrated || !progressHydrated || !exercises) return null;

  const lesson = getLessonForLanguage(language.id);

  return (
    <LessonRunner
      lessonId={`${lesson.id}-practice`}
      title={`${language.flag} Bonus practice`}
      exercises={exercises}
      progress={progress}
      recordLessonComplete={recordLessonComplete}
    />
  );
}
