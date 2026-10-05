-- Demo account shows a used streak freeze on its week calendar.
--
-- Run once in the Supabase SQL Editor, after 0001-0003.
-- Safe to re-run (create or replace).
--
-- Seeded week, relative to the day of the reset:
--   3 days ago: lesson 1 done in every language   (flame)
--   2 days ago: missed, covered by a freeze        (snowflake)
--   yesterday:  lesson 2 done in every language   (flame)
--   today:      open, streak at risk
-- A frozen day protects the streak but does not add to it, so the streak is 2.
-- Stats: 2 current, 2 longest, 1 freeze still in stock, 2 lessons, 100 XP.
-- Each language shows lessons 1-2 done and lesson 3 open. The profile
-- counters describe the two days, so they read 2 lessons whichever language
-- is selected.

create or replace function public._seed_demo(p_user uuid, p_today date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  lang text;
begin
  delete from public.lesson_completions   where user_id = p_user;
  delete from public.streak_freeze_events where user_id = p_user;

  foreach lang in array array['es', 'fr', 'ja'] loop
    insert into public.lesson_completions (user_id, lesson_id, xp_earned, completed_on)
    values (p_user, lang || '-basics-1', 50, p_today - 3),
           (p_user, lang || '-basics-2', 50, p_today - 1);
  end loop;

  insert into public.streak_freeze_events (user_id, kind, day_covered)
  values (p_user, 'used', p_today - 2);

  update public.profiles
     set total_xp = 100,
         lessons_completed = 2,
         current_streak = 2,
         longest_streak = 2,
         streak_through_date = p_today - 1,
         freezes_available = 1
   where id = p_user and is_demo;
end;
$$;

revoke all on function public._seed_demo(uuid, date) from public, anon, authenticated;

-- Apply the new seed to the demo account right away.
select public.reset_demo_nightly();
