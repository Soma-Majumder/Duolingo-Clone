"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { useProgress } from "@/hooks/useProgress";
import { getLessonPath } from "@/lib/lessonContent";
import { getUnlockedIndex } from "@/lib/progress";
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

export default function LessonPracticePage() {
  const params = useParams<{ index: string }>();
  const router = useRouter();
  const { language, hydrated: langHydrated } = useLanguage();
  const { progress, hydrated: progressHydrated, recordLessonComplete } = useProgress();
  const [exercises, setExercises] = useState<Exercise[] | null>(null);

  const index = Number(params.index);
  const path = langHydrated ? getLessonPath(language.id) : [];
  const lesson = path[index];
  const unlockedIndex = getUnlockedIndex(progress, path);
  // Practice only revisits an already-completed lesson.
  const isValid = Boolean(lesson) && index < unlockedIndex;

  useEffect(() => {
    // Shuffling needs Math.random(), which must run client-side only so it
    // doesn't disagree with the server-rendered output.
    if (!langHydrated || !lesson) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExercises(shuffle(lesson.exercises).slice(0, 3));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langHydrated, language.id, index]);

  useEffect(() => {
    if (langHydrated && progressHydrated && !isValid) {
      router.replace("/");
    }
  }, [langHydrated, progressHydrated, isValid, router]);

  if (!langHydrated || !progressHydrated || !isValid || !exercises) return null;

  return (
    <LessonRunner
      lessonId={`${lesson.id}-practice`}
      title={`${language.flag} ${lesson.title} · Practice`}
      exercises={exercises}
      progress={progress}
      recordLessonComplete={recordLessonComplete}
    />
  );
}
