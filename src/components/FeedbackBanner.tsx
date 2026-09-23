import { CheckIcon } from "./icons";

export function FeedbackBanner({
  isCorrect,
  correctAnswer,
}: {
  isCorrect: boolean;
  correctAnswer?: string;
}) {
  return (
    <div
      className={`animate-duo-slide-up flex items-center gap-3 px-4 py-4 sm:px-8 ${
        isCorrect ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isCorrect ? "bg-duo-green" : "bg-duo-red"
        }`}
      >
        <CheckIcon className="h-5 w-5" />
      </div>
      <div>
        <p className={`text-lg font-extrabold ${isCorrect ? "text-duo-green-dark" : "text-duo-red-dark"}`}>
          {isCorrect ? "Nicely done!" : "Not quite right"}
        </p>
        {!isCorrect && correctAnswer && (
          <p className="text-sm font-bold text-duo-red-dark/80">Correct answer: {correctAnswer}</p>
        )}
      </div>
    </div>
  );
}
