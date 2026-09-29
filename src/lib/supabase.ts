import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/**
 * Browser Supabase client, created lazily so importing this module never
 * throws (CI builds and prerendering run without env vars). Returns null when
 * Supabase isn't configured, in which case the app runs on localStorage only.
 */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  client = null;
  if (url && key) {
    try {
      client = createClient(url, key);
    } catch (err) {
      // A malformed value (stray quotes, missing https://) must not crash the
      // build or the page; fall back to local-only progress instead.
      console.error("Supabase is misconfigured; running without accounts.", err);
    }
  }
  return client;
}

export function getDemoCredentials(): { email: string; password: string } | null {
  const email = process.env.NEXT_PUBLIC_DEMO_EMAIL;
  const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
  return email && password ? { email, password } : null;
}
