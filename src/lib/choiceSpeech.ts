import type { ChoiceSpeech } from "./exercises";

export function speechForChoice(choice: string, speech: ChoiceSpeech) {
  return { text: speech.textByChoice?.[choice] ?? choice, lang: speech.lang };
}

// Prefer an exact locale, then a voice in the same language. Never read a
// foreign-language answer using an unrelated default voice.
export function selectVoice(voices: SpeechSynthesisVoice[], lang: string) {
  const locale = lang.toLowerCase().replaceAll("_", "-");
  const language = locale.split("-")[0];
  const matching = voices.filter((voice) =>
    voice.lang.toLowerCase().replaceAll("_", "-").split("-")[0] === language,
  );
  const exact = matching.filter((voice) => voice.lang.toLowerCase().replaceAll("_", "-") === locale);
  // Avoid choosing an alphabetically first novelty voice on macOS. Other
  // devices still use their matching default or first available language voice.
  const preferredNames: Record<string, string[]> = {
    en: ["Samantha", "Google US English"],
    es: ["Mónica", "Google español"],
    fr: ["Thomas", "Google français"],
    ja: ["Kyoko", "Google 日本語"],
  };
  return exact.find((voice) => voice.default)
    ?? exact.find((voice) => preferredNames[language]?.includes(voice.name))
    ?? exact[0]
    ?? matching.find((voice) => voice.default)
    ?? matching[0];
}

export class ChoiceSpeaker {
  private generation = 0;

  constructor(private readonly synthesis: SpeechSynthesis) {}

  stop() {
    this.generation += 1;
    try {
      this.synthesis.cancel();
    } catch {
      // An unavailable speech service must never interrupt the exercise.
    }
  }

  speak(text: string, lang: string, onUnavailable: () => void) {
    this.stop();
    const generation = this.generation;
    try {
      const voice = selectVoice(this.synthesis.getVoices(), lang);
      if (!voice) {
        onUnavailable();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.85;
      utterance.onerror = (event) => {
        if (generation === this.generation && event.error !== "canceled" && event.error !== "interrupted") {
          onUnavailable();
        }
      };
      this.synthesis.speak(utterance);
    } catch {
      onUnavailable();
    }
  }
}
