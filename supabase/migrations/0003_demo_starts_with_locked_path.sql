-- Demo account starts with the lesson path locked.
--
-- Run once in the Supabase SQL Editor, after 0001_init.sql and 0002.
-- Safe to re-run (create or replace).
--
-- The original seed inserted completions for es-basics-1..5, which is the
-- whole Spanish path, so the demo opened with every lesson already done.
-- The demo now keeps its streak and freeze (so those features are visible)
-- but has no completed lessons and no XP: only the first lesson is unlocked.

create or replace function public._seed_demo(p_user uuid, p_today date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.lesson_completions   where user_id = p_user;
  delete from public.streak_freeze_events where user_id = p_user;

  update public.profiles
     set total_xp = 0,
         lessons_completed = 0,
         current_streak = 5,
         longest_streak = 5,
         streak_through_date = p_today - 1,
         freezes_available = 1
   where id = p_user and is_demo;
end;
$$;

-- create or replace keeps existing grants, but restate that it stays private.
revoke all on function public._seed_demo(uuid, date) from public, anon, authenticated;

-- Apply the new seed to the demo account right away instead of waiting for
-- the nightly reset.
select public.reset_demo_nightly();
