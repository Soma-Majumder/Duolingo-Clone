import { DragonMascot } from "./DragonMascot";

export function DragonEncouragement({
  correctAnswers,
  mood,
  onFadeComplete,
}: {
  correctAnswers: number;
  mood: "hidden" | "happy" | "sad";
  onFadeComplete: () => void;
}) {
  return (
    // Reserve space so encouragement never moves the question or its answers.
    <div className="mb-4 min-h-24" role="status" aria-live="polite" aria-atomic="true">
      {mood !== "hidden" && (
        <div
          className={`flex min-h-24 items-center gap-3 ${mood === "sad" ? "dragon-fade-out" : ""}`}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && event.animationName === "dragon-fade-out") {
              onFadeComplete();
            }
          }}
        >
          <div
            key={`${correctAnswers}-${mood}`}
            aria-hidden="true"
            className={`shrink-0 ${mood === "happy" ? "dragon-celebrate" : ""}`}
          >
            <DragonMascot className="h-20 w-20" animated={false} sad={mood === "sad"} />
          </div>
          <p className={`relative rounded-2xl border-2 border-duo-green bg-duo-green-light px-4 py-3 font-bold text-duo-green-dark ${mood === "sad" ? "invisible" : ""}`}>
            <span aria-hidden="true" className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-duo-green bg-duo-green-light" />
            Keep going youre doing great
          </p>
        </div>
      )}
    </div>
  );
}
