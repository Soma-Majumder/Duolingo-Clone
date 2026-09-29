import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

function loadSource(path, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const context = { exports: {}, ...globals };
  runInNewContext(outputText, context);
  return context.exports;
}

test("unlock cue waits for the matching lesson, plays once, and clears at path end", () => {
  const cue = loadSource("../src/lib/lessonUnlock.ts");
  assert.equal(cue.consumeLessonUnlock("es-basics-1"), false);
  cue.queueLessonUnlock("es-basics-2");
  assert.equal(cue.consumeLessonUnlock("fr-basics-2"), false);
  assert.equal(cue.consumeLessonUnlock("es-basics-2"), true);
  assert.equal(cue.consumeLessonUnlock("es-basics-2"), false);
  cue.queueLessonUnlock("es-basics-2");
  cue.queueLessonUnlock(null);
  assert.equal(cue.consumeLessonUnlock("es-basics-2"), false);
});

for (const reducedMotion of [false, true]) {
  test(`path animation consumes only an available unlock; reduced motion ${reducedMotion}`, () => {
    const cue = loadSource("../src/lib/lessonUnlock.ts");
    const animations = [];
    const effects = [];
    let unlockedIndex = 0;
    const modules = {
      react: {
        useEffect: (effect) => effects.push(effect),
        useRef: () => ({ current: { animate: (...args) => animations.push(args) } }),
      },
      "react/jsx-runtime": { jsx: () => null, jsxs: () => null },
      "next/navigation": { useRouter: () => ({ push() {} }) },
      "@/lib/lessonUnlock": cue,
      "@/lib/lessonContent": { getLessonPath: () => [{ id: "one", title: "One" }, { id: "two", title: "Two" }] },
      "@/lib/progress": { getUnlockedIndex: () => unlockedIndex },
      "./icons": {},
      "./DragonMascot": {},
    };
    const { LessonPath } = loadSource("../src/components/LessonPath.tsx", {
      require: (id) => { assert.ok(id in modules, id); return modules[id]; },
      window: { matchMedia: () => ({ matches: reducedMotion }) },
    });
    function visit() {
      LessonPath({ languageId: "es", progress: {} });
      effects.splice(0).forEach((effect) => effect());
    }
    cue.queueLessonUnlock("two");
    visit(); // Still locked: the cue must wait for progress to arrive.
    assert.equal(animations.length, 0);
    unlockedIndex = 1;
    visit();
    assert.equal(animations.length, reducedMotion ? 0 : 1);
    visit(); // Returning again must not replay it.
    assert.equal(animations.length, reducedMotion ? 0 : 1);
    if (!reducedMotion) assert.equal(animations[0][1].duration, 550);
  });
}
