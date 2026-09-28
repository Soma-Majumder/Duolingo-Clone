import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function loadSource(path, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
  });
  const context = { exports: {}, ...globals };
  runInNewContext(outputText, context);
  return context.exports;
}

const voices = [
  { name: "English", lang: "en-US", default: true },
  { name: "Spanish Mexico", lang: "es-MX" },
  { name: "Spanish Spain", lang: "es-ES" },
  { name: "French", lang: "fr-FR" },
  { name: "Japanese", lang: "ja-JP" },
];

function setup() {
  const events = [];
  const synthesis = {
    getVoices: () => voices,
    cancel: () => events.push({ type: "cancel" }),
    speak: (utterance) => events.push({ type: "speak", utterance }),
  };
  const api = loadSource("../src/lib/choiceSpeech.ts", {
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
  });
  return { ...api, synthesis, events, speaker: new api.ChoiceSpeaker(synthesis) };
}

test("selects the exact locale, then same-language fallback, never an unrelated voice", () => {
  const { selectVoice } = setup();
  assert.equal(selectVoice(voices, "es-ES").name, "Spanish Spain");
  assert.equal(selectVoice(voices, "es-AR").name, "Spanish Mexico");
  assert.equal(selectVoice(voices, "en-US").name, "English");
  assert.equal(selectVoice([voices[0]], "ja-JP"), undefined);
  assert.equal(selectVoice([
    { name: "Albert", lang: "en-US" },
    { name: "Samantha", lang: "en-US" },
  ], "en-US").name, "Samantha");
});

test("new selections cancel prior speech and speak only the selected text", () => {
  const { speaker, events } = setup();
  speaker.speak("el hombre", "es-ES", assert.fail);
  speaker.speak("la mujer", "es-ES", assert.fail);
  assert.deepEqual(events.map((event) => event.type), ["cancel", "speak", "cancel", "speak"]);
  assert.equal(events[3].utterance.text, "la mujer");
  assert.equal(events[3].utterance.lang, "es-ES");
  speaker.stop();
  assert.equal(events.at(-1).type, "cancel");
});

test("missing voices skip playback and recover when voices become available", () => {
  const { speaker, synthesis, events } = setup();
  let unavailable = 0;
  synthesis.getVoices = () => [];
  speaker.speak("みず", "ja-JP", () => unavailable++);
  assert.equal(unavailable, 1);
  assert.equal(events.filter((event) => event.type === "speak").length, 0);
  synthesis.getVoices = () => voices;
  speaker.speak("みず", "ja-JP", assert.fail);
  assert.equal(events.at(-1).utterance.text, "みず");
});

test("playback errors are handled; stale and canceled errors do not affect the current choice", () => {
  const { speaker, synthesis, events } = setup();
  let unavailable = 0;
  const report = () => unavailable++;
  speaker.speak("Hello", "en-US", report);
  const first = events.at(-1).utterance;
  speaker.speak("Please", "en-US", report);
  const second = events.at(-1).utterance;
  first.onerror({ error: "network" });
  second.onerror({ error: "canceled" });
  assert.equal(unavailable, 0);
  second.onerror({ error: "not-allowed" });
  assert.equal(unavailable, 1);
  speaker.stop();
  second.onerror({ error: "network" });
  assert.equal(unavailable, 1);
  synthesis.speak = () => { throw new Error("Service unavailable"); };
  assert.doesNotThrow(() => speaker.speak("Hello", "en-US", report));
  assert.equal(unavailable, 2);
});

test("all lesson choices have explicit speech languages and Japanese pronunciation text", () => {
  const { LESSON_PATHS } = loadSource("../src/lib/lessonContent.ts");
  const { speechForChoice } = setup();
  for (const lessons of Object.values(LESSON_PATHS)) {
    assert.ok(lessons.length > 0);
    for (const lesson of lessons) {
      assert.ok(lesson.exercises.length > 0);
      for (const exercise of lesson.exercises) {
        assert.ok(["en-US", "es-ES", "fr-FR", "ja-JP"].includes(exercise.speech.lang));
        for (const choice of exercise.options ?? exercise.wordBank) {
          const speech = speechForChoice(choice, exercise.speech);
          assert.ok(speech.text.length > 0);
          if (speech.lang === "ja-JP") assert.match(speech.text, /[\u3040-\u30ff]/u);
        }
        if (exercise.type === "multipleChoice" && exercise.options.includes("Thank you")) {
          assert.equal(exercise.speech.lang, "en-US");
        }
      }
    }
  }
});
