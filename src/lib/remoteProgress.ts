import type { SupabaseClient } from "@supabase/supabase-js";
import { DayRecord, ProgressState, dateKey } from "./progress";

interface ProfileRow {
  total_xp: number;
  lessons_completed: number;
  current_streak: number;
  longest_streak: number;
  streak_through_date: string | null;
  freezes_available: number;
}

interface CompletionRow {
  lesson_id: string;
  xp_earned: number;
  completed_on: string;
}

const HISTORY_LIMIT = 30;

/** Local calendar date, sent to the server because a "day" is the user's day. */
export function clientToday(): string {
  return dateKey(new Date());
}

/**
 * Loads the signed-in user's progress. The reconcile_streak RPC runs first so
 * missed days spend freezes (or reset the streak) before anything is read.
 */
export async function fetchRemoteProgress(sb: SupabaseClient): Promise<ProgressState> {
  const { data: profile, error: profileError } = await sb.rpc("reconcile_streak", {
    p_today: clientToday(),
  });
  if (profileError) throw profileError;

  const [completions, freezes] = await Promise.all([
    sb.from("lesson_completions").select("lesson_id, xp_earned, completed_on").order("completed_on"),
    sb.from("streak_freeze_events").select("day_covered").eq("kind", "used"),
  ]);
  if (completions.error) throw completions.error;
  if (freezes.error) throw freezes.error;

  const p = profile as ProfileRow;
  const rows = completions.data as CompletionRow[];

  const byDay = new Map<string, DayRecord>();
  for (const r of rows) {
    const day = byDay.get(r.completed_on);
    if (day) day.xp += r.xp_earned;
    else byDay.set(r.completed_on, { date: r.completed_on, xp: r.xp_earned, lessonId: r.lesson_id });
  }

  return {
    totalXP: p.total_xp,
    lessonsCompleted: p.lessons_completed,
    currentStreak: p.current_streak,
    longestStreak: p.longest_streak,
    lastCompletedDate: p.streak_through_date,
    history: [...byDay.values()].slice(-HISTORY_LIMIT),
    completedLessonIds: [...new Set(rows.map((r) => r.lesson_id))],
    freezesAvailable: p.freezes_available,
    frozenDates: (freezes.data as { day_covered: string }[]).map((f) => f.day_covered),
  };
}

export async function recordRemoteCompletion(
  sb: SupabaseClient,
  lessonId: string,
  xpEarned: number,
): Promise<void> {
  const { error } = await sb.rpc("complete_lesson", {
    p_lesson_id: lessonId,
    p_xp: xpEarned,
    p_today: clientToday(),
  });
  if (error) throw error;
}

export async function resetRemoteDemo(sb: SupabaseClient): Promise<void> {
  const { error } = await sb.rpc("reset_demo", { p_today: clientToday() });
  if (error) throw error;
}
