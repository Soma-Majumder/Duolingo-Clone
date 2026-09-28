"use client";

import { useEffect, useRef, useState } from "react";
import { LessonAudio, type LessonSound } from "@/lib/sounds";

const STORAGE_KEY = "duo-clone-sound-enabled-v1";

export function useLessonSounds() {
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const enabledRef = useRef(true);
  const audioRef = useRef<LessonAudio | null>(null);

  useEffect(() => {
    let stored = true;
    try {
      stored = localStorage.getItem(STORAGE_KEY) !== "false";
    } catch {
      // Sound still works for this session when browser storage is unavailable.
    }
    enabledRef.current = stored;
    // Read browser preferences after mount to preserve server/client agreement.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(stored);
    setReady(true);
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    if (!next) audioRef.current?.stop();
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Keep the session preference even if persistence is blocked.
    }
  }

  function play(sound: LessonSound) {
    if (!ready || !enabledRef.current) return;
    audioRef.current ??= new LessonAudio();
    void audioRef.current.play(sound);
  }

  return { enabled, ready, toggle, play };
}
