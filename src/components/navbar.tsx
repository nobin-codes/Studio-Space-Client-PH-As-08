
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-provider";

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ApertureIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="13.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 2.5 5.5 10.1M29.5 16H18M22.7 27.7l-5.4-10.2M2.5 16h11.8M9.3 4.3l5.4 10.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Close menus on browser back/forward.
  useEffect(() => {
    const handlePopState = () => {
      setMobileMenuOpen(false);
      setProfileMenuOpen(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Close profile menu when clicking outside.
  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileMenuOpen]);

  // Close mobile navigation with Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to log out.");
        return;
      }

      closeMenus();
      toast.success("Logged out successfully.");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong while logging out.");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const user = session?.user;

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Logo */}
        <Link href="/" className="brand" onClick={closeMenus}>
          <span className="brand-icon">
            <ApertureIcon />
          </span>

          <span>
            studio<span className="brand-light">space</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav
          className={`main-nav ${mobileMenuOpen ? "nav-open" : ""}`}
          aria-label="Main navigation"
        >
          <Link
            href="/"
            onClick={closeMenus}
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            href="/studios"
            onClick={closeMenus}
            className={`nav-link ${isActive("/studios") ? "active" : ""}`}
          >
            Explore studios
          </Link>

          <Link
            href="/#how-it-works"
            onClick={closeMenus}
            className="nav-link"
          >
            How it works
          </Link>

          <Link
            href="/#about"
            onClick={closeMenus}
            className="nav-link"
          >
            About us
          </Link>

          {/* Mobile-only menu items */}
          <div className="mobile-nav-panel">
            {user ? (
              <div className="mobile-user-section">
                <div className="mobile-user-badge">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#181916] text-[#d9fa70] font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate text-[#181916]">
                      {user.name || "My Account"}
                    </p>

                    <p className="text-xs text-[#777970] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mobile-user-links">
                  <Link
                    href="/dashboard"
                    onClick={closeMenus}
                    className="mobile-sublink"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/add-studio"
                    onClick={closeMenus}
                    className="mobile-sublink"
                  >
                    Add New Studio
                  </Link>

                  <Link
                    href="/my-listings"
                    onClick={closeMenus}
                    className="mobile-sublink"
                  >
                    My Studio Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    onClick={closeMenus}
                    className="mobile-sublink"
                  >
                    My Bookings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mobile-sublink mobile-logout-btn"
                  >
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="button button-outline mobile-btn"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="button button-dark mobile-btn"
                >
                  Get started <ArrowIcon />
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Theme and authentication actions */}
        <div className="header-actions">
          <ThemeToggle />

          {isPending ? (
            <span className="login-link" aria-live="polite">
              Loading...
            </span>
          ) : user ? (
            <div className="relative" ref={profileRef}>
              {/* Profile button */}
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((previous) => !previous);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 rounded-full border border-[#181916]/15 bg-[#181916]/5 px-3 py-2 text-sm text-[#181916] transition hover:bg-[#181916]/10"
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                aria-label="Open profile menu"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#181916] font-bold text-[#d9fa70] text-xs">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}

                <span className="max-w-32 truncate font-semibold">
                  {user.name || "My Account"}
                </span>

                <span
                  className={`transition-transform ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  ⌄
                </span>
              </button>

              {/* Profile dropdown */}
              {profileMenuOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-3 w-60 rounded-xl border border-[#2b3026] bg-[#1c201b] p-2 text-white shadow-2xl"
                  role="menu"
                  aria-label="Profile menu"
                >
                  <div className="border-b border-[#2b3026] px-4 py-3">
                    <p className="truncate font-semibold text-sm text-white">
                      {user.name || "My Account"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-[#a5a99f]">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={closeMenus}
                    className="block rounded-lg px-4 py-2.5 text-sm text-[#e0e2dc] hover:bg-white/10 hover:text-white transition"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/add-studio"
                    role="menuitem"
                    onClick={closeMenus}
                    className="block rounded-lg px-4 py-2.5 text-sm text-[#e0e2dc] hover:bg-white/10 hover:text-white transition"
                  >
                    Add New Studio
                  </Link>

                  <Link
                    href="/my-listings"
                    role="menuitem"
                    onClick={closeMenus}
                    className="block rounded-lg px-4 py-2.5 text-sm text-[#e0e2dc] hover:bg-white/10 hover:text-white transition"
                  >
                    My Studio Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    role="menuitem"
                    onClick={closeMenus}
                    className="block rounded-lg px-4 py-2.5 text-sm text-[#e0e2dc] hover:bg-white/10 hover:text-white transition"
                  >
                    My Bookings
                  </Link>

                  <div className="my-1 border-t border-[#2b3026]" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="block w-full rounded-lg px-4 py-2.5 text-left text-sm text-[#f87171] hover:bg-red-500/10 hover:text-red-300 transition disabled:opacity-50"
                  >
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeMenus}
                className="login-link"
              >
                Log in
              </Link>

              <Link
                href="/register"
                onClick={closeMenus}
                className="button button-dark header-register"
              >
                Get started <ArrowIcon />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => {
            setMobileMenuOpen((previous) => !previous);
            setProfileMenuOpen(false);
          }}
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
