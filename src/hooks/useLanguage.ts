"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_LANGUAGE_ID, getLanguage } from "@/lib/languages";

const STORAGE_KEY = "duo-clone-language-v1";

export function useLanguage() {
  const [languageId, setLanguageIdState] = useState(DEFAULT_LANGUAGE_ID);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount so the server-rendered
    // and first client render stay identical.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setLanguageIdState(stored);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setLanguageId = useCallback((id: string) => {
    setLanguageIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  return { language: getLanguage(languageId), languageId, setLanguageId, hydrated };
}
