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
import { SoundToggle } from "./SoundToggle";
import { useLessonSounds } from "@/hooks/useLessonSounds";
import { DragonEncouragement } from "./DragonEncouragement";
import { useChoiceSpeech } from "@/hooks/useChoiceSpeech";

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
  const [dragonMood, setDragonMood] = useState<"hidden" | "happy" | "sad">("hidden");
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<{ xpEarned: number; mistakes: number } | null>(null);
  const recordedRef = useRef(false);
  const sounds = useLessonSounds();
  const speech = useChoiceSpeech();
  const soundControl = <SoundToggle enabled={sounds.enabled} ready={sounds.ready} onToggle={sounds.toggle} />;

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
    if (checked || !canCheck || recordedRef.current) return;
    speech.stop();
    let correct = false;
    if (exercise.type === "multipleChoice") {
      correct = mcSelected === exercise.answer;
    } else {
      correct = wbPicked.map((p) => p.word).join("|") === exercise.answer.join("|");
    }
    setIsCorrect(correct);
    setChecked(true);
    sounds.play(correct ? "correct" : "incorrect");
    if (correct && index + 1 >= 2) {
      setDragonMood("happy");
    } else if (!correct) {
      setDragonMood((mood) => mood === "happy" ? "sad" : mood);
    }
    if (!correct) setMistakes((m) => m + 1);
  }

  function handleContinue() {
    if (!checked || recordedRef.current) return;
    speech.stop();
    if (!isCorrect) {
      resetInputs();
      return;
    }
    if (index === exercises.length - 1) {
      const xpEarned = calculateXp(exercises.length, mistakes);
      if (!recordedRef.current) {
        recordedRef.current = true;
        sounds.play("complete");
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
        soundControl={soundControl}
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
        {soundControl}
      </div>

      <p className="px-4 text-sm font-bold uppercase tracking-wide text-duo-gray-400 sm:px-8">{title}</p>

      <div className="px-4 pt-3 sm:px-8">
        <button
          type="button"
          aria-label="Read answers aloud"
          aria-pressed={speech.enabled}
          disabled={!speech.ready}
          onClick={speech.toggle}
          className="rounded-xl border-2 border-duo-gray-200 px-3 py-2 text-sm font-bold text-duo-eel hover:bg-duo-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-duo-blue disabled:opacity-50"
        >
          Read aloud: {speech.enabled ? "on" : "off"}
        </button>
        <p role="status" className="mt-1 text-sm text-duo-gray-500">{speech.notice}</p>
      </div>

      <main className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <DragonEncouragement
            correctAnswers={index + (checked && isCorrect ? 1 : 0)}
            mood={dragonMood}
            onFadeComplete={() => setDragonMood((mood) => mood === "sad" ? "hidden" : mood)}
          />
          {exercise.type === "multipleChoice" ? (
            <MultipleChoiceExercise
              exercise={exercise}
              selected={mcSelected}
              checked={checked}
              isCorrect={isCorrect}
              onSelect={(option) => {
                if (checked) return;
                setMcSelected(option);
                speech.speak(option, exercise.speech);
              }}
            />
          ) : (
            <WordBankExercise
              exercise={exercise}
              picked={wbPicked}
              checked={checked}
              isCorrect={isCorrect}
              onPick={(bankIndex) => {
                if (checked) return;
                const word = exercise.wordBank[bankIndex];
                setWbPicked((prev) => [...prev, { word, bankIndex }]);
                speech.speak(word, exercise.speech);
              }}
              onRemove={(pickedIndex) => {
                speech.stop();
                setWbPicked((prev) => prev.filter((_, i) => i !== pickedIndex));
              }}
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
