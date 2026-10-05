-- Streak freeze rules, checked against the real functions.
--
-- Run in the Supabase SQL Editor (needs the demo user from the setup steps).
-- Everything runs inside one DO block that ends by raising an exception, so
-- ALL changes are rolled back, including to the demo account. Seeing
--   ERROR: ALL STREAK FREEZE TESTS PASSED (changes rolled back)
-- means success. Any other error message names the failing check.

do $$
declare
  uid  uuid;
  d0   date := (now() at time zone 'utc')::date;  -- "today" for the server's date window
  prof public.profiles;
  n    integer;
begin
  select id into uid from auth.users where email = 'demo@duolingo-clone.test';
  if uid is null then raise exception 'demo user not found'; end if;

  -- Act as the demo user (auth.uid() reads this claim).
  perform set_config('request.jwt.claim.sub', uid::text, true);

  -- 1. Missed one day with a freeze in stock: freeze is spent, streak survives.
  perform public._seed_demo(uid, d0);            -- streak 5 through yesterday, 1 freeze
  prof := public.reconcile_streak(d0 + 1);       -- the user's "today" is one day later
  assert prof.current_streak = 5, '1: streak should survive';
  assert prof.freezes_available = 0, '1: freeze should be spent';
  assert prof.streak_through_date = d0, '1: freeze should cover the missed day';
  select count(*) into n from public.streak_freeze_events
   where user_id = uid and kind = 'used' and day_covered = d0;
  assert n = 1, '1: a used-freeze event should be logged for the covered day';

  -- 2. Reconciling again is a no-op (no double spend).
  prof := public.reconcile_streak(d0 + 1);
  assert prof.freezes_available = 0 and prof.current_streak = 5, '2: reconcile must be idempotent';

  -- 3. Missed a day with no freezes: streak resets.
  perform public._seed_demo(uid, d0);
  update public.profiles set freezes_available = 0 where id = uid;
  prof := public.reconcile_streak(d0 + 1);
  assert prof.current_streak = 0, '3: streak should reset without a freeze';

  -- 4. Completing the first lesson of a day advances the streak and XP.
  perform public._seed_demo(uid, d0);
  prof := public.complete_lesson('es-basics-1', 10, d0);
  assert prof.current_streak = 6, '4: streak should advance to 6';
  assert prof.total_xp = 10, '4: xp should add up';
  assert prof.streak_through_date = d0, '4: through date should be today';

  -- 5. A second lesson the same day does not advance the streak again.
  prof := public.complete_lesson('es-basics-2', 10, d0);
  assert prof.current_streak = 6, '5: streak must not double count';
  assert prof.total_xp = 20, '5: xp still counts';

  -- 6. Reaching a 7-day streak earns a freeze (once, even with extra lessons).
  perform public._seed_demo(uid, d0);
  update public.profiles set current_streak = 6, freezes_available = 0 where id = uid;
  prof := public.complete_lesson('es-basics-1', 10, d0);
  assert prof.current_streak = 7 and prof.freezes_available = 1, '6: day 7 should earn a freeze';
  prof := public.complete_lesson('es-basics-2', 10, d0);
  assert prof.freezes_available = 1, '6: extra lessons must not earn more freezes';

  -- 7. Freezes are capped at 2.
  perform public._seed_demo(uid, d0);
  update public.profiles set current_streak = 13, freezes_available = 2 where id = uid;
  prof := public.complete_lesson('es-basics-1', 10, d0);
  assert prof.current_streak = 14 and prof.freezes_available = 2, '7: freezes are capped at 2';

  -- 8. Bad input is rejected.
  begin
    perform public.complete_lesson('x', 10, d0 + 30);
    raise exception '8: far-future date should be rejected';
  exception when raise_exception then
    if sqlerrm <> 'invalid date' then raise; end if;
  end;

  raise exception 'ALL STREAK FREEZE TESTS PASSED (changes rolled back)';
end;
$$;
