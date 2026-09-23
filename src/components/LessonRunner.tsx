"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Exercise } from "@/lib/exercises";
import { ProgressState, calculateXp } from "@/lib/progress";
import { LessonProgressBar } from "./LessonProgressBar";
import { MultipleChoiceExercise } from "./exercises/MultipleChoiceExercise";
import { PickedWord, WordBankExercise } from "./exercises/WordBankExercise";
import { FeedbackBanner } from "./FeedbackBanner";
import { DuoButton } from "./DuoButton";
import { LessonComplete } from "./LessonComplete";

export function LessonRunner({
  lessonId,
  title,
  exercises,
  progress,
  recordLessonComplete,
}: {
  lessonId: string;
  title: string;
  exercises: Exercise[];
  progress: ProgressState;
  recordLessonComplete: (result: { lessonId: string; xpEarned: number }) => void;
}) {
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mcSelected, setMcSelected] = useState<string | null>(null);
  const [wbPicked, setWbPicked] = useState<PickedWord[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<{ xpEarned: number; mistakes: number } | null>(null);
  const recordedRef = useRef(false);

  const exercise = exercises[index];

  const canCheck =
    exercise.type === "multipleChoice"
      ? mcSelected !== null
      : wbPicked.length === exercise.answer.length;

  function resetInputs() {
    setChecked(false);
    setIsCorrect(null);
    setMcSelected(null);
    setWbPicked([]);
  }

  function handleCheck() {
    let correct = false;
    if (exercise.type === "multipleChoice") {
      correct = mcSelected === exercise.answer;
    } else {
      correct = wbPicked.map((p) => p.word).join("|") === exercise.answer.join("|");
    }
    setIsCorrect(correct);
    setChecked(true);
    if (!correct) setMistakes((m) => m + 1);
  }

  function handleContinue() {
    if (!isCorrect) {
      resetInputs();
      return;
    }
    if (index === exercises.length - 1) {
      const xpEarned = calculateXp(exercises.length, mistakes);
      if (!recordedRef.current) {
        recordedRef.current = true;
        recordLessonComplete({ lessonId, xpEarned });
      }
      setResult({ xpEarned, mistakes });
      setCompleted(true);
      return;
    }
    setIndex((i) => i + 1);
    resetInputs();
  }

  if (completed && result) {
    return (
      <LessonComplete
        xpEarned={result.xpEarned}
        mistakes={result.mistakes}
        totalExercises={exercises.length}
        currentStreak={progress.currentStreak}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="text-2xl font-bold text-duo-gray-400 hover:text-duo-gray-500">
          &times;
        </Link>
        <LessonProgressBar current={index + (checked && isCorrect ? 1 : 0)} total={exercises.length} />
      </div>

      <p className="px-4 text-sm font-bold uppercase tracking-wide text-duo-gray-400 sm:px-8">{title}</p>

      <main className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {exercise.type === "multipleChoice" ? (
            <MultipleChoiceExercise
              exercise={exercise}
              selected={mcSelected}
              checked={checked}
              isCorrect={isCorrect}
              onSelect={(option) => !checked && setMcSelected(option)}
            />
          ) : (
            <WordBankExercise
              exercise={exercise}
              picked={wbPicked}
              checked={checked}
              isCorrect={isCorrect}
              onPick={(bankIndex) =>
                setWbPicked((prev) => [...prev, { word: exercise.wordBank[bankIndex], bankIndex }])
              }
              onRemove={(pickedIndex) =>
                setWbPicked((prev) => prev.filter((_, i) => i !== pickedIndex))
              }
            />
          )}
        </div>
      </main>

      <div className="sticky bottom-0 border-t-2 border-duo-gray-200 bg-white">
        {checked && <FeedbackBanner isCorrect={!!isCorrect} correctAnswer={
          exercise.type === "multipleChoice" ? exercise.answer : exercise.answer.join(" ")
        } />}
        <div className="flex justify-end px-4 py-4 sm:px-8">
          {!checked ? (
            <DuoButton variant="primary" disabled={!canCheck} onClick={handleCheck} className="w-full sm:w-auto">
              Check
            </DuoButton>
          ) : (
            <DuoButton
              variant={isCorrect ? "primary" : "danger"}
              onClick={handleContinue}
              className="w-full sm:w-auto"
            >
              Continue
            </DuoButton>
          )}
        </div>
      </div>
    </div>
  );
}
