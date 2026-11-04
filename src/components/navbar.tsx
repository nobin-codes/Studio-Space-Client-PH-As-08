
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

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

  // Close menus when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  // Close profile menu when clicking outside
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

  // Close mobile navigation with Escape
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
        </nav>

        {/* Authentication actions */}
        <div className="header-actions">
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
                className="flex items-center gap-3 rounded-full border border-white/15 px-3 py-2 text-sm text-white transition hover:bg-white/5"
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
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}

                <span className="max-w-32 truncate">
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
                  className="absolute right-0 top-full z-50 mt-3 w-56 rounded-xl border border-white/10 bg-[#15111c] p-2 text-white shadow-xl"
                  role="menu"
                  aria-label="Profile menu"
                >
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="truncate font-semibold">
                      {user.name || "My Account"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={closeMenus}
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-white/10"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/add-studio"
                    role="menuitem"
                    onClick={closeMenus}
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-white/10"
                  >
                    Add New Studio
                  </Link>

                  <Link
                    href="/my-listings"
                    role="menuitem"
                    onClick={closeMenus}
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-white/10"
                  >
                    My Studio Listings
                  </Link>

                  <Link
                    href="/my-bookings"
                    role="menuitem"
                    onClick={closeMenus}
                    className="block rounded-lg px-4 py-3 text-sm hover:bg-white/10"
                  >
                    My Bookings
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="block w-full rounded-lg px-4 py-3 text-left text-sm text-red-400 transition hover:bg-white/10 disabled:opacity-50"
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
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
