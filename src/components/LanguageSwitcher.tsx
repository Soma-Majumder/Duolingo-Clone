"use client";

import { useState } from "react";
import { LANGUAGES } from "@/lib/languages";

export function LanguageSwitcher({
  languageId,
  onChange,
}: {
  languageId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.id === languageId) ?? LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-2xl border-2 border-duo-gray-200 bg-white px-4 py-2 font-bold text-duo-eel transition-colors hover:bg-duo-gray-100"
      >
        <span className="text-xl">{current.flag}</span>
        <span>{current.name}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border-2 border-duo-gray-200 bg-white shadow-lg">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  onChange(lang.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left font-bold transition-colors hover:bg-duo-gray-100 ${
                  lang.id === languageId ? "bg-duo-gray-100 text-duo-green" : "text-duo-eel"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
