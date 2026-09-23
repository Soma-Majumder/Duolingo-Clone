import { WordBankExercise as WBExercise } from "@/lib/exercises";

export interface PickedWord {
  word: string;
  bankIndex: number;
}

export function WordBankExercise({
  exercise,
  picked,
  checked,
  isCorrect,
  onPick,
  onRemove,
}: {
  exercise: WBExercise;
  picked: PickedWord[];
  checked: boolean;
  isCorrect: boolean | null;
  onPick: (bankIndex: number) => void;
  onRemove: (pickedIndex: number) => void;
}) {
  const usedIndexes = new Set(picked.map((p) => p.bankIndex));

  const answerAreaBorder = !checked
    ? "border-duo-gray-200"
    : isCorrect
      ? "border-duo-green"
      : "border-duo-red";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-duo-eel">{exercise.prompt}</h2>
        {exercise.subPrompt && (
          <p className="mt-1 text-lg font-bold text-duo-blue">{exercise.subPrompt}</p>
        )}
      </div>

      <div
        className={`flex min-h-16 flex-wrap items-start gap-2 rounded-2xl border-2 border-dashed p-3 ${answerAreaBorder}`}
      >
        {picked.length === 0 && (
          <span className="p-2 text-sm text-duo-gray-400">Tap the words below in order</span>
        )}
        {picked.map((p, i) => (
          <button
            key={`${p.bankIndex}-${i}`}
            disabled={checked}
            onClick={() => onRemove(i)}
            className="rounded-xl border-2 border-b-4 border-duo-blue-dark bg-duo-blue px-4 py-2 font-bold text-white disabled:cursor-default"
          >
            {p.word}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {exercise.wordBank.map((word, i) => (
          <button
            key={i}
            disabled={usedIndexes.has(i) || checked}
            onClick={() => onPick(i)}
            className="rounded-xl border-2 border-b-4 border-duo-gray-200 bg-white px-4 py-2 font-bold text-duo-eel transition-opacity hover:bg-duo-gray-100 disabled:opacity-0"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
