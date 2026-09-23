import { DailyLesson } from "./exercises";

export const LESSONS: Record<string, DailyLesson> = {
  es: {
    id: "es-basics-1",
    title: "Basics 1",
    exercises: [
      {
        id: "es-1",
        type: "multipleChoice",
        prompt: "Which word means \"the man\"?",
        options: ["el hombre", "la mujer", "el niño", "la niña"],
        answer: "el hombre",
      },
      {
        id: "es-2",
        type: "wordBank",
        prompt: "Translate this sentence",
        subPrompt: "The woman drinks water",
        wordBank: ["La", "mujer", "bebe", "agua", "el", "pan"],
        answer: ["La", "mujer", "bebe", "agua"],
      },
      {
        id: "es-3",
        type: "multipleChoice",
        prompt: "\"Gracias\" means?",
        options: ["Thank you", "Please", "Sorry", "Hello"],
        answer: "Thank you",
      },
      {
        id: "es-4",
        type: "wordBank",
        prompt: "Translate this sentence",
        subPrompt: "I eat bread",
        wordBank: ["Yo", "como", "pan", "tú", "comes", "agua"],
        answer: ["Yo", "como", "pan"],
      },
      {
        id: "es-5",
        type: "multipleChoice",
        prompt: "Which one means \"water\"?",
        options: ["pan", "agua", "leche", "mujer"],
        answer: "agua",
      },
    ],
  },
  fr: {
    id: "fr-basics-1",
    title: "Basics 1",
    exercises: [
      {
        id: "fr-1",
        type: "multipleChoice",
        prompt: "Which word means \"the man\"?",
        options: ["l'homme", "la femme", "le garçon", "la fille"],
        answer: "l'homme",
      },
      {
        id: "fr-2",
        type: "wordBank",
        prompt: "Translate this sentence",
        subPrompt: "The woman drinks water",
        wordBank: ["La", "femme", "boit", "de", "l'eau", "pain"],
        answer: ["La", "femme", "boit", "de", "l'eau"],
      },
      {
        id: "fr-3",
        type: "multipleChoice",
        prompt: "\"Merci\" means?",
        options: ["Thank you", "Please", "Sorry", "Hello"],
        answer: "Thank you",
      },
      {
        id: "fr-4",
        type: "wordBank",
        prompt: "Translate this sentence",
        subPrompt: "I eat bread",
        wordBank: ["Je", "mange", "du", "pain", "tu", "manges"],
        answer: ["Je", "mange", "du", "pain"],
      },
      {
        id: "fr-5",
        type: "multipleChoice",
        prompt: "Which one means \"water\"?",
        options: ["pain", "l'eau", "lait", "femme"],
        answer: "l'eau",
      },
    ],
  },
  ja: {
    id: "ja-basics-1",
    title: "Basics 1",
    exercises: [
      {
        id: "ja-1",
        type: "multipleChoice",
        prompt: "Which word means \"water\"?",
        options: ["mizu", "pan", "hito", "onna"],
        answer: "mizu",
      },
      {
        id: "ja-2",
        type: "wordBank",
        prompt: "Translate this sentence",
        subPrompt: "I eat bread",
        wordBank: ["watashi", "wa", "pan", "o", "tabemasu", "mizu"],
        answer: ["watashi", "wa", "pan", "o", "tabemasu"],
      },
      {
        id: "ja-3",
        type: "multipleChoice",
        prompt: "\"Arigatou\" means?",
        options: ["Thank you", "Please", "Sorry", "Hello"],
        answer: "Thank you",
      },
      {
        id: "ja-4",
        type: "multipleChoice",
        prompt: "Which word means \"the woman\"?",
        options: ["onna no hito", "otoko no hito", "kodomo", "pan"],
        answer: "onna no hito",
      },
      {
        id: "ja-5",
        type: "wordBank",
        prompt: "Translate this sentence",
        subPrompt: "The man drinks water",
        wordBank: ["otoko", "no", "hito", "wa", "mizu", "o", "nomimasu", "pan"],
        answer: ["otoko", "no", "hito", "wa", "mizu", "o", "nomimasu"],
      },
    ],
  },
};

export function getLessonForLanguage(languageId: string): DailyLesson {
  return LESSONS[languageId] ?? LESSONS.es;
}
