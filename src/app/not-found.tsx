import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-300">
          <Sparkles size={15} />
          Lost in the creative space?
        </div>

        <div className="relative mb-5">
          <h1 className="select-none text-[clamp(100px,22vw,220px)] font-black leading-none tracking-tighter text-purple-600/10 dark:text-purple-400/10">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-purple-500/20 bg-purple-500/10 shadow-xl shadow-purple-500/10">
              <Search size={42} className="text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
          This space doesn&apos;t exist.
        </h2>

        <p className="mx-auto mb-9 max-w-md text-base leading-7 text-slate-500 dark:text-slate-400">
          Looks like this creative workspace has moved or the link is incorrect.
          Let&apos;s get you back to discovering something inspiring.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-white/15 px-6 py-3 font-semibold text-slate-800 dark:text-white transition hover:bg-slate-100 dark:hover:bg-white/5"
          >
            Explore Studios
            <ArrowRight size={18} />
          </Link>
        </div>

        <p className="mt-12 text-sm text-slate-400">
          StudioSpace · Find your next creative space
        </p>
      </div>
    </main>
  );
}
