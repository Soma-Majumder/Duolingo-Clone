// A one-shot visual cue for this browser session; progress remains the source
// of truth for whether the lesson is actually available.
let pendingLessonId: string | null = null;

export function queueLessonUnlock(lessonId: string | null) {
  pendingLessonId = lessonId;
}

export function consumeLessonUnlock(lessonId: string): boolean {
  if (pendingLessonId !== lessonId) return false;
  pendingLessonId = null;
  return true;
}
