export interface Language {
  id: string;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { id: "es", name: "Spanish", flag: "🇪🇸" },
  { id: "fr", name: "French", flag: "🇫🇷" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
];

export const DEFAULT_LANGUAGE_ID = LANGUAGES[0].id;

export function getLanguage(id: string): Language {
  return LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
}
