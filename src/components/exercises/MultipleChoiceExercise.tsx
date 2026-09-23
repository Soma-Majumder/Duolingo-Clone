import { MultipleChoiceExercise as MCExercise } from "@/lib/exercises";

export function MultipleChoiceExercise({
  exercise,
  selected,
  checked,
  isCorrect,
  onSelect,
}: {
  exercise: MCExercise;
  selected: string | null;
  checked: boolean;
  isCorrect: boolean | null;
  onSelect: (option: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-extrabold text-duo-eel">{exercise.prompt}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {exercise.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = option === exercise.answer;

          let optionClasses =
            "border-duo-gray-200 bg-white text-duo-eel hover:bg-duo-gray-100";
          if (checked && isSelected && isCorrect) {
            optionClasses = "border-duo-green bg-green-50 text-duo-green-dark";
          } else if (checked && isSelected && !isCorrect) {
            optionClasses = "border-duo-red bg-red-50 text-duo-red-dark";
          } else if (checked && !isSelected && isAnswer) {
            optionClasses = "border-duo-green bg-green-50 text-duo-green-dark";
          } else if (isSelected) {
            optionClasses = "border-duo-blue bg-blue-50 text-duo-blue-dark";
          }

          return (
            <button
              key={option}
              disabled={checked}
              onClick={() => onSelect(option)}
              className={`rounded-2xl border-2 border-b-4 px-5 py-4 text-left text-base font-bold transition-colors disabled:cursor-default ${optionClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
