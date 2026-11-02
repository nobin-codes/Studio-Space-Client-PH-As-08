
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Plus,
  Building2,
  CalendarDays,
  Compass,
  LogOut,
  Menu,
  X,
  ArrowRight,
  UserRound,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Add New Studio", href: "/add-studio", icon: Plus },
  { label: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
  { label: "Explore Studios", href: "/studios", icon: Compass },
];

const descriptions: Record<string, string> = {
  "/add-studio": "Add your creative space to StudioSpace.",
  "/my-listings": "View and manage your studio listings.",
  "/my-bookings": "View and manage your reservations.",
  "/studios": "Discover available creative spaces.",
};

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await authClient.signOut();
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8f8fc" }}>
        <span className="loading loading-spinner loading-lg" style={{ color: "#6d28d9" }} />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#f8f8fc" }}>
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm" style={{ borderColor: "#e2e8f0" }}>
          <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
            Login required
          </h1>
          <p className="mt-3 text-sm" style={{ color: "#64748b" }}>
            Please log in to access your dashboard.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl px-7 py-3 text-sm font-bold"
            style={{ backgroundColor: "#6d28d9", color: "#ffffff" }}
          >
            Login to continue
          </Link>
        </div>
      </main>
    );
  }

  const firstName = session.user.name?.trim().split(" ")[0] || "there";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f8fc", color: "#0f172a" }}>
      {/* Mobile Header */}
      <header
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-5 md:hidden"
        style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
      >
        <Link href="/" className="text-xl font-extrabold tracking-tight" style={{ color: "#111827" }}>
          Studio<span style={{ color: "#6d28d9" }}>Space.</span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ color: "#334155", backgroundColor: "#f1f5f9" }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={`${
            menuOpen ? "flex" : "hidden"
          } fixed inset-x-0 top-16 bottom-0 z-20 flex-col overflow-y-auto border-r p-5 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0`}
          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
        >
          <Link
            href="/"
            className="mb-10 hidden text-2xl font-extrabold tracking-tight md:block"
            style={{ color: "#111827" }}
          >
            Studio<span style={{ color: "#6d28d9" }}>Space.</span>
          </Link>

          {/* User Profile */}
          <div
            className="mb-8 flex items-center gap-3 rounded-2xl border p-3"
            style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold"
              style={{ backgroundColor: "#ede9fe", color: "#6d28d9" }}
            >
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold" style={{ color: "#0f172a" }}>
                {session.user.name}
              </p>
              <p className="mt-1 text-xs" style={{ color: "#64748b" }}>
                My Account
              </p>
            </div>
          </div>

          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: active ? "#6d28d9" : "transparent",
                    color: active ? "#ffffff" : "#475569",
                  }}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t pt-5" style={{ borderColor: "#e2e8f0" }}>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold"
              style={{ color: "#475569" }}
            >
              <Compass size={19} />
              Homepage
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold disabled:opacity-50"
              style={{ color: "#dc2626" }}
            >
              <LogOut size={19} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          {/* Page Heading */}
          <header className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-medium" style={{ color: "#64748b" }}>
                Workspace / Dashboard
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#0f172a" }}>
                Dashboard
              </h1>

              <p className="mt-2 text-sm" style={{ color: "#64748b" }}>
                Welcome back, {firstName}. Here's your workspace.
              </p>
            </div>

            <Link
              href="/add-studio"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#6d28d9", color: "#ffffff" }}
            >
              <Plus size={19} />
              Add New Studio
            </Link>
          </header>

          {/* Welcome Banner */}
          <section
            className="relative mb-10 overflow-hidden rounded-3xl p-7 text-white shadow-lg sm:p-10 lg:p-12"
            style={{ backgroundColor: "#211b3a" }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            />
            <div
              className="pointer-events-none absolute -right-8 -top-16 h-52 w-52 rounded-full border"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            />

            <div className="relative z-10 max-w-2xl">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wide"
                style={{
                  backgroundColor: "rgba(167,139,250,0.12)",
                  borderColor: "rgba(196,181,253,0.3)",
                  color: "#ddd6fe",
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#a78bfa" }} />
                YOUR CREATIVE WORKSPACE
              </div>

              <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
                Everything you need to manage your creative spaces.
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 sm:text-base" style={{ color: "#ddd6e7" }}>
                Manage your studio listings, track your bookings and discover
                creative spaces through StudioSpace.
              </p>

              {/* Buttons with explicit colors */}
              <div className="mt-8 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
                <Link
                  href="/add-studio"
                  className="inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl px-7 py-4 text-sm font-bold shadow-lg transition-all duration-200 sm:w-auto"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#211b3a",
                    border: "2px solid #ffffff",
                    textDecoration: "none",
                  }}
                >
                  <Plus size={19} color="#211b3a" />
                  <span style={{ color: "#211b3a" }}>List Your Space</span>
                  <ArrowRight size={17} color="#211b3a" />
                </Link>

                <Link
                  href="/studios"
                  className="inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl px-7 py-4 text-sm font-bold transition-all duration-200 sm:w-auto"
                  style={{
                    backgroundColor: "#211b3a",
                    color: "#ffffff",
                    border: "2px solid #ffffff",
                    textDecoration: "none",
                  }}
                >
                  <Compass size={19} color="#ffffff" />
                  <span style={{ color: "#ffffff" }}>Explore Studios</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Workspace Cards */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl" style={{ color: "#0f172a" }}>
                Manage Your Workspace
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#64748b" }}>
                Everything you need, organized in one place.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {navigation.slice(1).map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex min-h-[210px] flex-col rounded-2xl border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={{ borderColor: "#e2e8f0", textDecoration: "none" }}
                  >
                    <div
                      className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "#f3e8ff", color: "#6d28d9" }}
                    >
                      <Icon size={23} />
                    </div>

                    <h3 className="text-base font-bold" style={{ color: "#0f172a" }}>
                      {item.label}
                    </h3>

                    <p className="mt-2 flex-1 text-sm leading-6" style={{ color: "#64748b" }}>
                      {descriptions[item.href]}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-bold" style={{ color: "#6d28d9" }}>
                      Open page
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Account Information */}
          <section
            className="mt-10 rounded-2xl border bg-white p-6 sm:p-8"
            style={{ borderColor: "#e2e8f0" }}
          >
            <div className="mb-7 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#f3e8ff", color: "#6d28d9" }}
              >
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-bold" style={{ color: "#0f172a" }}>
                  Account Information
                </h2>
                <p className="mt-1 text-xs" style={{ color: "#64748b" }}>
                  Your registered account details.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                  Full Name
                </p>
                <p className="mt-2 break-words text-sm font-semibold" style={{ color: "#1e293b" }}>
                  {session.user.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                  Email Address
                </p>
                <p className="mt-2 break-all text-sm font-semibold" style={{ color: "#1e293b" }}>
                  {session.user.email}
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer
            className="mt-10 border-t pt-6 text-xs"
            style={{ borderColor: "#e2e8f0", color: "#94a3b8" }}
          >
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </footer>
        </section>
      </div>
    </main>
  );
}
