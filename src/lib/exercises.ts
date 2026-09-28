export interface ChoiceSpeech {
  lang: "en-US" | "es-ES" | "fr-FR" | "ja-JP";
  textByChoice?: Record<string, string>;
}

export interface MultipleChoiceExercise {
  id: string;
  type: "multipleChoice";
  prompt: string;
  subPrompt?: string;
  options: string[];
  answer: string;
  speech: ChoiceSpeech;
}

export interface WordBankExercise {
  id: string;
  type: "wordBank";
  prompt: string;
  subPrompt?: string;
  wordBank: string[];
  answer: string[];
  speech: ChoiceSpeech;
}

export type Exercise = MultipleChoiceExercise | WordBankExercise;

export interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
}
