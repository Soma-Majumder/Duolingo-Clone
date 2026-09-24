export interface MultipleChoiceExercise {
  id: string;
  type: "multipleChoice";
  prompt: string;
  subPrompt?: string;
  options: string[];
  answer: string;
}

export interface WordBankExercise {
  id: string;
  type: "wordBank";
  prompt: string;
  subPrompt?: string;
  wordBank: string[];
  answer: string[];
}

export type Exercise = MultipleChoiceExercise | WordBankExercise;

export interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
}
