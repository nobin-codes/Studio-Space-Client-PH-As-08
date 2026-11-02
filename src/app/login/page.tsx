
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }

      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    try {
      setGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0911] text-white flex items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-180px] left-[-150px] w-[400px] h-[400px] rounded-full bg-violet-700/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-180px] right-[-150px] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-[1000px] grid md:grid-cols-2 overflow-hidden rounded-[28px] border border-white/10 bg-[#15121d] shadow-2xl">

        {/* Left panel */}
        <section className="hidden md:flex flex-col justify-between p-10 lg:p-12 bg-gradient-to-br from-[#261b43] via-[#1b1530] to-[#100d19]">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            Studio<span className="text-violet-400">Space.</span>
          </Link>

          <div className="my-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-4 py-2 text-xs font-semibold text-violet-200">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              YOUR CREATIVE SPACE STARTS HERE
            </div>

            <h1 className="mt-7 text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight">
              Create.
              <br />
              Connect.
              <br />
              <span className="text-violet-300">Create more.</span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-300">
              Find inspiring studios, manage your bookings, and bring your
              creative ideas to life with StudioSpace.
            </p>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>
        </section>

        {/* Login form */}
        <section className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-9"
          >
            <ArrowLeft size={16} />
            Back to homepage
          </Link>

          <div className="md:hidden mb-8 text-xl font-extrabold">
            Studio<span className="text-violet-400">Space.</span>
          </div>

          <div>
            <p className="text-sm font-semibold text-violet-400 mb-3">
              WELCOME BACK
            </p>

            <h2 className="text-3xl font-bold tracking-tight">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Enter your details below to continue your creative journey.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-200 mb-2"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full h-12 rounded-xl border border-white/10 bg-[#0e0b15] pl-11 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-200"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full h-12 rounded-xl border border-white/10 bg-[#0e0b15] pl-11 pr-12 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <span className="text-xs text-slate-500">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-12 rounded-xl bg-violet-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 hover:bg-violet-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium text-slate-500">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full h-12 rounded-xl border border-white/15 bg-white/[0.03] text-sm font-semibold text-slate-200 flex items-center justify-center gap-3 hover:bg-white/[0.08] hover:border-white/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 5)" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.47-4.72 7.15l7.22 5.6c4.21-3.89 6.54-9.62 6.54-17.22Z" />
              <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.78-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.54 2.56 10.78l7.97-6.19Z" transform="translate(0 0)" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.78l-7.22-5.6c-2 1.35-4.56 2.15-8.68 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-violet-400 hover:text-violet-300 transition"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

