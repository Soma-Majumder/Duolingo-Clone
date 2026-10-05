-- Nightly reset of the shared demo account.
--
-- Run once in the Supabase SQL Editor, after 0001_init.sql.
-- Requires the pg_cron extension; if the create extension line below errors,
-- enable it in Dashboard -> Database -> Extensions -> pg_cron, then re-run.
--
-- Every night at 08:00 UTC (about 3-4am US Eastern) the demo profile goes back
-- to its seeded state: a 2-day streak ending yesterday with one frozen day,
-- 1 freeze, 100 XP (see 0004_demo_shows_streak_freeze.sql).
-- Safe to re-run: the job is unscheduled and recreated.

create extension if not exists pg_cron with schema pg_catalog;

-- Reseeds every profile flagged is_demo (normally just the one demo user).
-- Uses the UTC date, matching the window the other functions accept.
-- Returns how many demo profiles were reset.
create function public.reset_demo_nightly()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  demo_id uuid;
  reset_count integer := 0;
begin
  for demo_id in select id from public.profiles where is_demo loop
    perform public._seed_demo(demo_id, (now() at time zone 'utc')::date);
    reset_count := reset_count + 1;
  end loop;
  return reset_count;
end;
$$;

-- Only the scheduler (postgres) may run it, never a signed-in or anonymous user.
revoke all on function public.reset_demo_nightly() from public, anon, authenticated;

-- (Re)create the schedule.
select cron.unschedule(jobname) from cron.job where jobname = 'nightly-demo-reset';
select cron.schedule('nightly-demo-reset', '0 8 * * *', 'select public.reset_demo_nightly()');

-- Check the schedule:   select jobname, schedule, active from cron.job;
-- Run it right now:     select public.reset_demo_nightly();   -- returns 1
-- See past runs:        select status, return_message, start_time
--                       from cron.job_run_details order by start_time desc limit 5;
