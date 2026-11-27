
import Link from "next/link";

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

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Link href="/" className="brand footer-brand">
              <span className="brand-icon">
                <ApertureIcon />
              </span>
              <span>
                studio<span className="brand-light">space</span>
              </span>
            </Link>

            <p>
              A home for creative spaces and the people who bring ideas to life.
            </p>

            <div className="footer-socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                ig
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                ð
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <Link href="/studios">All studios</Link>
            <Link href="/studios?category=Photo%20Studios">Photo studios</Link>
            <Link href="/studios?category=Sound%20Stages">Sound stages</Link>
            <Link href="/studios?category=Podcast%20Rooms">Podcast rooms</Link>
            <Link href="/studios?category=Music%20Suites">Music suites</Link>
            <Link href="/studios?category=Art%20Workshops">Art workshops</Link>
          </div>

          <div className="footer-column">
            <h4>StudioSpace</h4>
            <Link href="/#about">About us</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/login">Log in</Link>
            <Link href="/register">Create an account</Link>
            <Link href="/add-studio">Host your space</Link>
          </div>

          <div className="footer-newsletter">
            <h4>Have a creative space?</h4>
            <p>
              Turn your space into someone&apos;s next creative destination.
              Share it with the StudioSpace community.
            </p>

            <Link href="/add-studio" className="footer-host-link">
              List your space
              <ArrowIcon />
            </Link>

            <span className="newsletter-note">
              Your next opportunity starts here.
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 StudioSpace. All rights reserved.</span>

          <span className="footer-tagline">MADE FOR THE MAKERS.</span>

          <Link
            href="https://github.com/nobin-codes"
            target="_blank"
            rel="noreferrer"
            className="footer-credit"
            aria-label="StudioSpace crafted by Nobin, visit GitHub profile"
          >
            <span className="footer-credit-label">
              CRAFTED WITH CREATIVITY BY
            </span>
            <span className="footer-credit-name">
              <span className="footer-credit-sparkle" aria-hidden="true">
                ✳
              </span>
              Nobin
              <span className="footer-credit-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
          </Link>

          <div className="footer-legal-links">
            <Link href="/#about">Terms</Link>
            <Link href="/#about">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
