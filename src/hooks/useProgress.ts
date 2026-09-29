"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  EMPTY_PROGRESS,
  LessonResult,
  ProgressState,
  completeLesson,
  normalizeProgress,
  reconcileStreak,
} from "@/lib/progress";
import { getSupabase } from "@/lib/supabase";
import { fetchRemoteProgress, recordRemoteCompletion } from "@/lib/remoteProgress";

const STORAGE_KEY = "duo-clone-progress-v1";

type Mode = "local" | "remote";

function readLocalProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // normalizeProgress both fills in fields added after a user's progress
    // was first persisted and guards against a corrupted/tampered value
    // (wrong types) crashing the app later.
    return raw ? reconcileStreak(normalizeProgress(JSON.parse(raw))) : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

/**
 * Progress for the current visitor. Signed in: the Supabase account is the
 * source of truth (the server owns streak/freeze rules). Signed out or
 * Supabase unconfigured: localStorage, exactly as before.
 */
export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>("local");
  const modeRef = useRef<Mode>("local");
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Reading localStorage must happen post-mount so the server-rendered
    // and first client render stay identical; this necessarily causes one
    // extra render when the persisted value differs from EMPTY_PROGRESS.
    let cancelled = false;
    const sb = getSupabase();

    const loadLocal = () => {
      modeRef.current = "local";
      userIdRef.current = null;
      setProgress(readLocalProgress());
      setMode("local");
      setHydrated(true);
    };

    if (!sb) {
      loadLocal();
      return;
    }

    const loadRemote = async (userId: string) => {
      try {
        const remote = await fetchRemoteProgress(sb);
        if (cancelled) return;
        modeRef.current = "remote";
        userIdRef.current = userId;
        setProgress(remote);
        setMode("remote");
        setHydrated(true);
      } catch (err) {
        console.error("Could not load account progress; using local progress", err);
        if (!cancelled) loadLocal();
      }
    };

    const { data } = sb.auth.onAuthStateChange((event, session) => {
      // Deferred: supabase-js docs warn against awaiting other client calls
      // inside this callback.
      setTimeout(() => {
        if (cancelled) return;
        if (session) {
          // SIGNED_IN also fires on tab refocus; skip if we're already loaded for this user.
          if (event === "SIGNED_IN" && userIdRef.current === session.user.id) return;
          if (event === "INITIAL_SESSION" || event === "SIGNED_IN") void loadRemote(session.user.id);
        } else if (event === "INITIAL_SESSION" || event === "SIGNED_OUT") {
          loadLocal();
        }
      }, 0);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hydrated || mode !== "local") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, hydrated, mode]);

  const recordLessonComplete = useCallback((result: LessonResult) => {
    // Optimistic: update immediately so the lesson-complete screen shows the
    // new streak, then (signed in) sync with the server and adopt its numbers.
    setProgress((p) => completeLesson(p, result));

    const sb = getSupabase();
    if (modeRef.current !== "remote" || !sb) return;
    void (async () => {
      try {
        await recordRemoteCompletion(sb, result.lessonId, result.xpEarned);
      } catch (err) {
        console.error("Could not save lesson to your account", err);
      }
      try {
        setProgress(await fetchRemoteProgress(sb));
      } catch (err) {
        console.error("Could not refresh progress", err);
      }
    })();
  }, []);

  return { progress, hydrated, recordLessonComplete, mode };
}
