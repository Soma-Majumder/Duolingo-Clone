-- Duolingo clone: profiles, lesson completions, streak freezes.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run on a fresh project only (tables are created without IF NOT EXISTS
-- so a partial earlier run is noticed rather than silently kept).
--
-- Design notes
--  * Clients can READ their own rows but never write counters directly. All
--    progress changes go through the SECURITY DEFINER functions below, so a
--    visitor cannot hand themselves a 999-day streak with the public anon key.
--  * The client passes its local calendar date (p_today) because a "day" is
--    the user's local day. The server only accepts dates within one day of
--    UTC "today" to bound abuse while allowing every real timezone.
--  * profiles.streak_through_date is the last day the streak is *secured*:
--    either a day with a completed lesson or a day covered by a freeze.
--    A freeze never covers today, so streak_through_date = today means
--    "a lesson was completed today" (same meaning as the old lastCompletedDate).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id                   uuid primary key references auth.users (id) on delete cascade,
  display_name         text not null default 'Learner',
  is_demo              boolean not null default false,
  total_xp             integer not null default 0 check (total_xp >= 0),
  lessons_completed    integer not null default 0 check (lessons_completed >= 0),
  current_streak       integer not null default 0 check (current_streak >= 0),
  longest_streak       integer not null default 0 check (longest_streak >= 0),
  streak_through_date  date,
  freezes_available    integer not null default 0 check (freezes_available between 0 and 2),
  created_at           timestamptz not null default now()
);

create table public.lesson_completions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  lesson_id     text not null,
  xp_earned     integer not null check (xp_earned between 0 and 500),
  completed_on  date not null,
  completed_at  timestamptz not null default now()
);
create index lesson_completions_user_day_idx
  on public.lesson_completions (user_id, completed_on);

create table public.streak_freeze_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  kind         text not null check (kind in ('earned', 'used')),
  day_covered  date,  -- set when kind = 'used', null when 'earned'
  created_at   timestamptz not null default now(),
  check ((kind = 'used') = (day_covered is not null))
);
create index streak_freeze_events_user_idx
  on public.streak_freeze_events (user_id, created_at);

-- ---------------------------------------------------------------------------
-- Row level security: read own rows only; no direct client writes to counters.
-- ---------------------------------------------------------------------------

alter table public.profiles             enable row level security;
alter table public.lesson_completions   enable row level security;
alter table public.streak_freeze_events enable row level security;

create policy "profiles: read own"
  on public.profiles for select to authenticated
  using (id = auth.uid());

-- Only display_name is updatable (column grant below), and never for the
-- shared demo account.
create policy "profiles: update own name"
  on public.profiles for update to authenticated
  using (id = auth.uid() and not is_demo)
  with check (id = auth.uid() and not is_demo);

create policy "completions: read own"
  on public.lesson_completions for select to authenticated
  using (user_id = auth.uid());

create policy "freeze events: read own"
  on public.streak_freeze_events for select to authenticated
  using (user_id = auth.uid());

revoke all on public.profiles, public.lesson_completions, public.streak_freeze_events
  from anon, authenticated;
grant select on public.profiles, public.lesson_completions, public.streak_freeze_events
  to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Auto-create a profile for every new auth user.
-- The demo account is identified by this exact email; create it in
-- Authentication -> Users right after running this migration.
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_demo_user boolean := new.email = 'demo@duolingo-clone.test';
begin
  insert into public.profiles (id, display_name, is_demo)
  values (
    new.id,
    case when is_demo_user then 'Demo Learner'
         else coalesce(nullif(split_part(new.email, '@', 1), ''), 'Learner') end,
    is_demo_user
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Streak logic (internal; not callable by clients)
-- ---------------------------------------------------------------------------

-- Spends freezes for fully missed days, or resets the streak if there aren't
-- enough. Caller must already hold the row lock on the profile.
create function public._reconcile_streak(p_user uuid, p_today date)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  prof   public.profiles;
  missed integer;
  i      integer;
begin
  select * into prof from public.profiles where id = p_user;

  if prof.current_streak = 0 or prof.streak_through_date is null then
    return prof;
  end if;

  -- Days strictly between the last secured day and today.
  missed := p_today - prof.streak_through_date - 1;
  if missed <= 0 then
    return prof;
  end if;

  if prof.freezes_available >= missed then
    for i in 1..missed loop
      insert into public.streak_freeze_events (user_id, kind, day_covered)
      values (p_user, 'used', prof.streak_through_date + i);
    end loop;
    update public.profiles
       set freezes_available = freezes_available - missed,
           streak_through_date = p_today - 1
     where id = p_user
     returning * into prof;
  else
    -- Not enough freezes: streak is lost and any remaining freezes are kept.
    update public.profiles
       set current_streak = 0
     where id = p_user
     returning * into prof;
  end if;

  return prof;
end;
$$;

create function public._check_client_date(p_today date)
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  if p_today is null
     or p_today < (now() at time zone 'utc')::date - 1
     or p_today > (now() at time zone 'utc')::date + 1 then
    raise exception 'invalid date';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Public RPCs
-- ---------------------------------------------------------------------------

-- Call on app load: applies freezes / resets a broken streak, returns profile.
create function public.reconcile_streak(p_today date)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid  uuid := auth.uid();
  prof public.profiles;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  perform public._check_client_date(p_today);

  perform 1 from public.profiles where id = uid for update;
  prof := public._reconcile_streak(uid, p_today);
  return prof;
end;
$$;

-- Records a finished lesson and advances XP / streak / freezes.
create function public.complete_lesson(p_lesson_id text, p_xp integer, p_today date)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid        uuid := auth.uid();
  prof       public.profiles;
  new_streak integer;
  advanced   boolean;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  perform public._check_client_date(p_today);
  if p_lesson_id is null or length(p_lesson_id) = 0 or length(p_lesson_id) > 100 then
    raise exception 'invalid lesson id';
  end if;
  if p_xp is null or p_xp < 0 or p_xp > 500 then
    raise exception 'invalid xp';
  end if;

  perform 1 from public.profiles where id = uid for update;
  prof := public._reconcile_streak(uid, p_today);

  insert into public.lesson_completions (user_id, lesson_id, xp_earned, completed_on)
  values (uid, p_lesson_id, p_xp, p_today);

  new_streak := prof.current_streak;
  -- Only the first lesson of a day advances the streak.
  advanced := prof.streak_through_date is distinct from p_today;
  if advanced then
    new_streak := case
      when prof.current_streak > 0 and prof.streak_through_date = p_today - 1
        then prof.current_streak + 1
      else 1
    end;
  end if;

  update public.profiles
     set total_xp            = total_xp + p_xp,
         lessons_completed   = lessons_completed + 1,
         current_streak      = new_streak,
         longest_streak      = greatest(longest_streak, new_streak),
         streak_through_date = p_today
   where id = uid
   returning * into prof;

  -- Earn a freeze each time the streak reaches a multiple of 7 (capped at 2).
  -- `advanced` makes this fire once per day, not per lesson.
  if advanced and new_streak % 7 = 0 and prof.freezes_available < 2 then
    update public.profiles
       set freezes_available = freezes_available + 1
     where id = uid
     returning * into prof;
    insert into public.streak_freeze_events (user_id, kind) values (uid, 'earned');
  end if;

  return prof;
end;
$$;

-- Restores the shared demo account to a known state: a 5-day streak ending
-- yesterday, one freeze, and the five Spanish path lessons (es-basics-1..5)
-- completed, matching LESSON_PATHS in src/lib/lessonContent.ts.
-- Only usable by the demo user itself; can also be run by a scheduled job
-- (as the postgres role) via public._seed_demo(<demo user uuid>).
create function public._seed_demo(p_user uuid, p_today date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  i integer;
begin
  delete from public.lesson_completions   where user_id = p_user;
  delete from public.streak_freeze_events where user_id = p_user;

  for i in 1..5 loop
    insert into public.lesson_completions (user_id, lesson_id, xp_earned, completed_on)
    values (p_user, 'es-basics-' || i, 50, p_today - (6 - i));
  end loop;

  update public.profiles
     set total_xp = 250,
         lessons_completed = 5,
         current_streak = 5,
         longest_streak = 5,
         streak_through_date = p_today - 1,
         freezes_available = 1
   where id = p_user and is_demo;
end;
$$;

create function public.reset_demo(p_today date)
returns public.profiles
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid  uuid := auth.uid();
  prof public.profiles;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  perform public._check_client_date(p_today);
  select * into prof from public.profiles where id = uid;
  if not prof.is_demo then raise exception 'only the demo account can be reset'; end if;

  perform public._seed_demo(uid, p_today);
  select * into prof from public.profiles where id = uid;
  return prof;
end;
$$;

-- ---------------------------------------------------------------------------
-- Function privileges: internal helpers are private; RPCs need a signed-in user.
-- ---------------------------------------------------------------------------

revoke all on function
  public.handle_new_user(),
  public._reconcile_streak(uuid, date),
  public._check_client_date(date),
  public._seed_demo(uuid, date),
  public.reconcile_streak(date),
  public.complete_lesson(text, integer, date),
  public.reset_demo(date)
from public, anon, authenticated;

grant execute on function
  public.reconcile_streak(date),
  public.complete_lesson(text, integer, date),
  public.reset_demo(date)
to authenticated;
