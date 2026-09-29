"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DuoButton } from "@/components/DuoButton";
import { ClioMascot } from "@/components/ClioMascot";
import { DragonMascot } from "@/components/DragonMascot";
import { LagoonScene } from "@/components/LagoonScene";
import { useAuth } from "@/hooks/useAuth";
import { getDemoCredentials, getSupabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

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
  const preview = process.env.NODE_ENV === "development" && !supabase;

  function showPreviewNotice() {
    setNotice("Preview only. Login and demo access are unavailable without Supabase.");
  }

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
    if (preview) {
      showPreviewNotice();
      return;
    }
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
    <div className="lagoon-page">
      <header className="lagoon-header relative z-10 flex items-center gap-2 px-5 py-5 sm:px-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-duo-green text-lg font-black text-white">
          D
        </div>
        <span className="text-lg font-extrabold text-duo-green">Duolingo</span>
      </header>

      <main className="lagoon-main">
        <div className="lagoon-frame">
          <LagoonScene />
          <div className="lagoon-card-dragon" aria-hidden="true"><div className="lagoon-float"><DragonMascot animated={false} className="h-full w-full" /></div></div>
          <div className="lagoon-card-jellyfish" aria-hidden="true"><div className="lagoon-float"><ClioMascot animated={false} className="h-full w-full" /></div></div>
        <section aria-labelledby="login-heading" className="lagoon-card flex w-full min-w-0 max-w-sm flex-col gap-5 rounded-3xl border-2 border-white bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 id="login-heading" className="text-2xl font-extrabold leading-tight text-duo-eel">
              {signingIn ? <>Learn a language.<br />Build a streak.<br />Have fun.</> : "Create your profile"}
            </h1>
            {signingIn && (
              <>
                <p className="text-sm font-bold leading-relaxed text-duo-gray-500">
                  Practice a little every day with bite-sized lessons designed to help you learn, stay motivated, and keep coming back.
                </p>
                <ul aria-label="Available languages" className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold text-duo-eel">
                  <li className="flex items-center gap-1"><span className="text-lg" aria-hidden="true">🇪🇸</span> Spanish</li>
                  <li className="flex items-center gap-1"><span className="text-lg" aria-hidden="true">🇫🇷</span> French</li>
                  <li className="flex items-center gap-1"><span className="text-lg" aria-hidden="true">🇯🇵</span> Japanese</li>
                </ul>
              </>
            )}
          </div>

          {!supabase && !preview ? (
            <p className="rounded-2xl border-2 border-duo-gray-200 bg-duo-gray-100 px-4 py-3 text-sm font-bold text-duo-gray-500">
              Accounts aren&apos;t set up yet. Progress is saved on this device only.
            </p>
          ) : (
            <>
              {(demo || preview) && (
                <div className="flex flex-col gap-2">
                  <DuoButton
                    type="button"
                    className="w-full"
                    disabled={busy !== null}
                    onClick={() => {
                      if (preview) showPreviewNotice();
                      else if (demo) void signIn(demo, "demo");
                    }}
                  >
                    {busy === "demo" ? "Signing in…" : "Try the demo"}
                  </DuoButton>
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

        </div>
      </main>
    </div>
  );
}
