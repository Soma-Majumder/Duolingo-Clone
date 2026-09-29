"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClioMascot } from "@/components/ClioMascot";
import { DragonMascot } from "@/components/DragonMascot";
import { DuoButton } from "@/components/DuoButton";
import { StreakPreview } from "@/components/StreakPreview";
import { useAuth } from "@/hooks/useAuth";
import { LANGUAGES } from "@/lib/languages";
import { getDemoCredentials, getSupabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

const REPO_URL = "https://github.com/Soma-Majumder/Duolingo-Clone";

const INPUT_CLASSES =
  "w-full rounded-2xl border-2 border-duo-gray-200 bg-duo-gray-100 px-4 py-3 font-bold text-duo-eel outline-none transition-colors placeholder:text-duo-gray-400 focus:border-duo-blue focus:bg-white";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<"demo" | "form" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const supabase = getSupabase();
  const demo = getDemoCredentials();

  // Already signed in (or just signed in): the login page has nothing to offer.
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  async function signIn(credentials: { email: string; password: string }, source: "demo" | "form") {
    if (!supabase) return;
    setBusy(source);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword(credentials);
    if (err) {
      setError(err.message);
      setBusy(null);
    }
    // On success the effect above navigates once the session is picked up.
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (mode === "signin") {
      await signIn({ email, password }, "form");
      return;
    }
    setBusy("form");
    setError(null);
    setNotice(null);
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    if (err) setError(err.message);
    else if (!data.session) setNotice("Check your email to confirm your account, then log in.");
    setBusy(null);
  }

  const signingIn = mode === "signin";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center gap-2 px-4 py-4 sm:px-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-duo-green text-lg font-black text-white">
          D
        </div>
        <span className="text-lg font-extrabold text-duo-green">Duolingo</span>
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-4 py-6 sm:px-8 lg:grid-cols-2 lg:content-center lg:gap-x-16 lg:gap-y-8">
        <section className="flex flex-col items-center gap-5 text-center lg:col-start-1 lg:row-start-1 lg:items-start lg:text-left">
          <div className="flex items-end gap-2">
            <DragonMascot className="h-24 w-24 sm:h-28 sm:w-28" />
            <ClioMascot className="h-24 w-24 sm:h-28 sm:w-28" />
          </div>
          <h1 className="text-3xl font-black text-duo-eel sm:text-4xl">
            Learn a language in 5 minutes a day.
          </h1>
          <p className="max-w-md text-lg font-bold text-duo-gray-500">
            Bite-sized lessons, daily streaks, and streak freezes that keep your progress safe.
          </p>
          <ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {LANGUAGES.map((lang) => (
              <li
                key={lang.id}
                className="flex items-center gap-2 rounded-2xl border-2 border-duo-gray-200 px-3 py-1.5 text-sm font-bold text-duo-eel"
              >
                <span className="text-lg">{lang.flag}</span>
                {lang.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto flex w-full max-w-sm flex-col gap-5 rounded-3xl border-2 border-duo-gray-200 p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <h2 className="text-2xl font-extrabold text-duo-eel">
            {signingIn ? "Log in" : "Create your profile"}
          </h2>

          {!supabase ? (
            <p className="rounded-2xl border-2 border-duo-gray-200 bg-duo-gray-100 px-4 py-3 text-sm font-bold text-duo-gray-500">
              Accounts aren&apos;t set up yet. Progress is saved on this device only.
            </p>
          ) : (
            <>
              {demo && (
                <div className="flex flex-col gap-2">
                  <DuoButton
                    type="button"
                    className="w-full"
                    disabled={busy !== null}
                    onClick={() => signIn(demo, "demo")}
                  >
                    {busy === "demo" ? "Signing in…" : "Try the demo"}
                  </DuoButton>
                  <p className="text-center text-sm font-bold text-duo-gray-500">
                    No signup needed. Explore with a demo account.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-duo-gray-400">
                <span className="h-0.5 flex-1 bg-duo-gray-200" />
                {signingIn ? "or log in" : "or create an account"}
                <span className="h-0.5 flex-1 bg-duo-gray-200" />
              </div>

              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  aria-label="Email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT_CLASSES}
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete={signingIn ? "current-password" : "new-password"}
                    aria-label="Password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${INPUT_CLASSES} pr-20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-pressed={showPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold uppercase tracking-wide text-duo-blue hover:text-duo-blue-dark"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {error && (
                  <p
                    role="alert"
                    className="rounded-2xl border-2 border-duo-red bg-duo-red-light px-4 py-3 text-sm font-bold text-duo-red-dark"
                  >
                    {error}
                  </p>
                )}
                {notice && (
                  <p
                    role="status"
                    className="rounded-2xl border-2 border-duo-green bg-duo-green-light px-4 py-3 text-sm font-bold text-duo-green-dark"
                  >
                    {notice}
                  </p>
                )}
                <DuoButton type="submit" variant="secondary" className="w-full" disabled={busy !== null}>
                  {busy === "form" ? "Please wait…" : signingIn ? "Log in" : "Create account"}
                </DuoButton>
              </form>

              <button
                type="button"
                className="text-sm font-bold text-duo-blue hover:text-duo-blue-dark"
                onClick={() => {
                  setMode(signingIn ? "signup" : "signin");
                  setError(null);
                  setNotice(null);
                }}
              >
                {signingIn ? "New here? Create an account" : "Have an account? Log in"}
              </button>
            </>
          )}
        </section>

        <div className="flex justify-center lg:col-start-1 lg:row-start-2 lg:justify-start">
          <StreakPreview />
        </div>
      </main>

      <footer className="px-4 py-6 text-center text-xs font-bold text-duo-gray-400">
        <p>Built with Next.js, Supabase and Tailwind CSS. The demo account resets nightly.</p>
        <p className="mt-1">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-duo-blue hover:text-duo-blue-dark"
          >
            View the code on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
