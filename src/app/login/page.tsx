"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DuoButton } from "@/components/DuoButton";
import { useAuth } from "@/hooks/useAuth";
import { getDemoCredentials, getSupabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = getSupabase();
  const demo = getDemoCredentials();

  // Already signed in (or just signed in): the login page has nothing to offer.
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  async function signIn(credentials: { email: string; password: string }) {
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword(credentials);
    setBusy(false);
    if (err) setError(err.message);
    else router.push("/");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (mode === "signin") {
      await signIn({ email, password });
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (err) setError(err.message);
    else if (data.session) router.push("/");
    else setNotice("Check your email to confirm your account, then sign in.");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
      <div className="flex w-full max-w-sm flex-col gap-5">
        <Link href="/" className="text-sm font-bold text-duo-blue">
          ← Back
        </Link>
        <h1 className="text-2xl font-extrabold text-duo-eel">
          {mode === "signin" ? "Log in" : "Create your profile"}
        </h1>

        {!supabase ? (
          <p className="rounded-2xl border-2 border-duo-gray-200 bg-duo-gray-100 px-4 py-3 text-sm font-bold text-duo-gray-500">
            Accounts aren&apos;t set up yet. Progress is saved on this device only.
          </p>
        ) : (
          <>
            {demo && (
              <DuoButton
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => signIn(demo)}
              >
                Try the demo
              </DuoButton>
            )}

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border-2 border-duo-gray-200 bg-duo-gray-100 px-4 py-3 font-bold text-duo-eel outline-none focus:border-duo-blue"
              />
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-2xl border-2 border-duo-gray-200 bg-duo-gray-100 px-4 py-3 font-bold text-duo-eel outline-none focus:border-duo-blue"
              />
              {error && <p className="text-sm font-bold text-duo-red">{error}</p>}
              {notice && <p className="text-sm font-bold text-duo-green-dark">{notice}</p>}
              <DuoButton type="submit" disabled={busy}>
                {mode === "signin" ? "Log in" : "Create account"}
              </DuoButton>
            </form>

            <button
              type="button"
              className="text-sm font-bold text-duo-blue"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setNotice(null);
              }}
            >
              {mode === "signin" ? "New here? Create an account" : "Have an account? Log in"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
