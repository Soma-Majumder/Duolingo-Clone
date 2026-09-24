"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_PROGRESS,
  LessonResult,
  ProgressState,
  completeLesson,
  reconcileStreak,
} from "@/lib/progress";

const STORAGE_KEY = "duo-clone-progress-v1";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount so the server-rendered
    // and first client render stay identical; this necessarily causes one
    // extra render when the persisted value differs from EMPTY_PROGRESS.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Spread over EMPTY_PROGRESS so fields added after a user's progress was
      // first persisted (e.g. completedLessonIds) default in instead of being undefined.
      const parsed: ProgressState = raw ? { ...EMPTY_PROGRESS, ...JSON.parse(raw) } : EMPTY_PROGRESS;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(reconcileStreak(parsed));
    } catch {
      setProgress(EMPTY_PROGRESS);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, hydrated]);

  const recordLessonComplete = useCallback((result: LessonResult) => {
    setProgress((p) => completeLesson(p, result));
  }, []);

  return { progress, hydrated, recordLessonComplete };
}
