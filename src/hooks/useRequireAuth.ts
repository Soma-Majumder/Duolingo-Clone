"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Gate for pages that need an account. Returns true once the page may render:
 * the visitor is signed in, or Supabase isn't configured (local dev and CI keep
 * the original localStorage-only behavior). A signed-out visitor is sent to
 * /login. Until the session is known this returns false, so pages show a
 * loading screen instead of flashing content.
 */
export function useRequireAuth(): boolean {
  const router = useRouter();
  const { user, ready, configured } = useAuth();
  const needsLogin = configured && ready && !user;

  useEffect(() => {
    if (needsLogin) router.replace("/login");
  }, [needsLogin, router]);

  return !configured || (ready && !!user);
}
