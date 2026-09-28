export type LessonSound = "correct" | "incorrect" | "complete";

// Original, synthesized motifs: rising feedback, a soft descending retry,
// and a longer ascending completion phrase. No recordings or downloads.
const NOTES: Record<LessonSound, readonly number[]> = {
  correct: [523.25, 659.25],
  incorrect: [293.66, 246.94],
  complete: [523.25, 659.25, 783.99, 1046.5],
};

export class LessonAudio {
  private context: AudioContext | null = null;
  private voices = new Set<OscillatorNode>();
  private generation = 0;

  stop() {
    this.generation += 1;
    for (const voice of this.voices) {
      voice.stop();
      voice.disconnect();
    }
    this.voices.clear();
  }

  async play(sound: LessonSound) {
    this.stop();
    const generation = this.generation;
    try {
      if (typeof window === "undefined" || !window.AudioContext) return;
      const context = this.context ??= new window.AudioContext();
      // Called directly from Check/Continue, while user activation is available.
      if (context.state !== "running") await context.resume();
      if (generation !== this.generation || context.state !== "running") return;

      const step = sound === "complete" ? 0.13 : 0.11;
      NOTES[sound].forEach((frequency, index) => {
        const start = context.currentTime + index * step;
        const duration = index === NOTES[sound].length - 1 ? 0.25 : 0.14;
        const voice = context.createOscillator();
        const gain = context.createGain();
        voice.type = "sine";
        voice.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.09, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        voice.connect(gain);
        gain.connect(context.destination);
        this.voices.add(voice);
        voice.onended = () => {
          voice.disconnect();
          gain.disconnect();
          this.voices.delete(voice);
        };
        voice.start(start);
        voice.stop(start + duration + 0.02);
      });
    } catch {
      // Audio is optional: blocked or unavailable playback must not stop a lesson.
      this.stop();
    }
  }

  dispose() {
    this.stop();
    const context = this.context;
    this.context = null;
    if (context && context.state !== "closed") void context.close().catch(() => {});
  }
}
