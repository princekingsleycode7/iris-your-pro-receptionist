import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Iris Dashboard" },
      { name: "description", content: "Sign in to your Iris AI Receptionist dashboard." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
        <Link to="/" className="text-xs font-semibold tracking-[0.2em] text-neutral-500 hover:text-neutral-900">
          ← BACK TO IRIS
        </Link>
        <h1 className="mt-6 text-2xl font-bold text-neutral-900">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Access your AI Receptionist dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
            />
          </div>
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-xs text-neutral-500 hover:text-neutral-900"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
