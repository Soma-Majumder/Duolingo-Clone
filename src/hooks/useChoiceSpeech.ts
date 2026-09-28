"use client";

import { useEffect, useRef, useState } from "react";
import { ChoiceSpeaker, speechForChoice } from "@/lib/choiceSpeech";
import type { ChoiceSpeech } from "@/lib/exercises";

const STORAGE_KEY = "duo-clone-read-aloud-v1";

export function useChoiceSpeech() {
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const enabledRef = useRef(true);
  const speakerRef = useRef<ChoiceSpeaker | null>(null);

  useEffect(() => {
    let stored = true;
    try {
      stored = localStorage.getItem(STORAGE_KEY) !== "false";
    } catch {
      // Keep this preference usable within the lesson if storage is blocked.
    }
    enabledRef.current = stored;
    // Read browser-only preferences after mount to avoid hydration differences.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(stored);
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== "function") {
      setNotice("Read aloud is unavailable in this browser.");
      return;
    }
    const synthesis = window.speechSynthesis;
    speakerRef.current = new ChoiceSpeaker(synthesis);
    // Some browsers populate voices asynchronously. Prime the list and retry
    // selection on each click; never queue a stale answer for later playback.
    try {
      synthesis.getVoices();
    } catch {
      // Retry voice discovery on the first click if the service is not ready.
    }
    const onVoicesChanged = () => setNotice("");
    synthesis.addEventListener("voiceschanged", onVoicesChanged);
    setReady(true);
    return () => {
      synthesis.removeEventListener("voiceschanged", onVoicesChanged);
      speakerRef.current?.stop();
      speakerRef.current = null;
    };
  }, []);

  function stop() {
    speakerRef.current?.stop();
    setNotice("");
  }

  function toggle() {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    stop();
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // The setting still applies to the current lesson.
    }
  }

  function speak(choice: string, speech: ChoiceSpeech) {
    if (!enabledRef.current || !ready) return;
    const { text, lang } = speechForChoice(choice, speech);
    setNotice("");
    speakerRef.current?.speak(text, lang, () => {
      setNotice("This answer’s voice is unavailable. You can still continue the lesson.");
    });
  }

  return { enabled, ready, notice, toggle, speak, stop };
}
