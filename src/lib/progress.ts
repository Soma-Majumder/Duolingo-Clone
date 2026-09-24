export interface DayRecord {
  date: string;
  xp: number;
  lessonId: string;
}

export interface ProgressState {
  totalXP: number;
  lessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  history: DayRecord[];
  /** IDs of every lesson (path lesson or bonus practice) ever completed. Drives path unlocking. */
  completedLessonIds: string[];
}

export const EMPTY_PROGRESS: ProgressState = {
  totalXP: 0,
  lessonsCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  history: [],
  completedLessonIds: [],
};

const HISTORY_LIMIT = 30;

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

export type StreakStatus = "done-today" | "at-risk" | "none";

/** Whether today's required lesson has already been completed. */
export function isDoneToday(progress: ProgressState): boolean {
  return progress.lastCompletedDate === todayKey();
}

/** Visual/behavioral state of the streak flame. */
export function getStreakStatus(progress: ProgressState): StreakStatus {
  if (progress.currentStreak === 0) return "none";
  return isDoneToday(progress) ? "done-today" : "at-risk";
}

/**
 * Reconciles a persisted progress record against the current date. If more
 * than one day has passed since the last completed lesson, the streak has
 * been broken and is reset to zero.
 */
export function reconcileStreak(progress: ProgressState): ProgressState {
  if (progress.currentStreak === 0 || progress.lastCompletedDate === null) {
    return progress;
  }
  const today = todayKey();
  const yesterday = yesterdayKey();
  if (progress.lastCompletedDate === today || progress.lastCompletedDate === yesterday) {
    return progress;
  }
  return { ...progress, currentStreak: 0 };
}

export interface LessonResult {
  lessonId: string;
  xpEarned: number;
}

/**
 * Applies a completed lesson to the progress record. Only the first
 * completion of a given day advances the streak; extra practice on the same
 * day still earns XP and counts toward lessonsCompleted. Users can complete
 * more than one path lesson per day — the streak just doesn't double-count it.
 */
export function completeLesson(
  progress: ProgressState,
  { lessonId, xpEarned }: LessonResult,
): ProgressState {
  const today = todayKey();
  const alreadyDoneToday = progress.lastCompletedDate === today;

  let currentStreak = progress.currentStreak;
  if (!alreadyDoneToday) {
    currentStreak = progress.lastCompletedDate === yesterdayKey() ? progress.currentStreak + 1 : 1;
  }

  const history = alreadyDoneToday
    ? progress.history.map((h) => (h.date === today ? { ...h, xp: h.xp + xpEarned } : h))
    : [...progress.history, { date: today, xp: xpEarned, lessonId }].slice(-HISTORY_LIMIT);

  const completedLessonIds = progress.completedLessonIds.includes(lessonId)
    ? progress.completedLessonIds
    : [...progress.completedLessonIds, lessonId];

  return {
    totalXP: progress.totalXP + xpEarned,
    lessonsCompleted: progress.lessonsCompleted + 1,
    currentStreak,
    longestStreak: Math.max(progress.longestStreak, currentStreak),
    lastCompletedDate: today,
    history,
    completedLessonIds,
  };
}

/**
 * The index of the first not-yet-completed lesson in a path — i.e. the one
 * lesson currently unlocked and available to start. Lessons before it are
 * complete; lessons after it are locked. Equals path.length once every
 * lesson in the path has been completed.
 */
export function getUnlockedIndex(progress: ProgressState, path: { id: string }[]): number {
  for (let i = 0; i < path.length; i++) {
    if (!progress.completedLessonIds.includes(path[i].id)) return i;
  }
  return path.length;
}

const XP_PER_EXERCISE = 10;
const PERFECT_LESSON_BONUS = 10;

export function calculateXp(exerciseCount: number, mistakeCount: number): number {
  const base = exerciseCount * XP_PER_EXERCISE;
  return mistakeCount === 0 ? base + PERFECT_LESSON_BONUS : base;
}
