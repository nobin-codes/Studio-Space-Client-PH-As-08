
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleRegister = async () => {
    if (loading || googleLoading) return;

    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
      });

      if (error) {
        toast.error(error.message || "Google registration failed.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to continue with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      toast.error("Password must contain uppercase and lowercase letters.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoURL.trim() || undefined,
        callbackURL: `${window.location.origin}/login`,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 15px",
    backgroundColor: "#0d0a13",
    color: "#ffffff",
    border: "1px solid #352b43",
    borderRadius: "12px",
    outline: "none",
    fontSize: "14px",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "9px",
    color: "#e8e2f0",
    fontSize: "13px",
    fontWeight: 600,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 18px",
        background:
          "radial-gradient(ellipse at top left, #28183e 0%, transparent 45%), #09070d",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "36px",
          border: "1px solid #30263c",
          borderRadius: "24px",
          backgroundColor: "#15111c",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          boxSizing: "border-box",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginBottom: "30px",
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: 800,
            textDecoration: "none",
            letterSpacing: "-1px",
          }}
        >
          Studio<span style={{ color: "#b48aff" }}>Space</span>
        </Link>

        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-block",
              marginBottom: "16px",
              padding: "7px 12px",
              borderRadius: "30px",
              backgroundColor: "#291b3b",
              color: "#c7a8ff",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            JOIN THE COMMUNITY
          </div>

          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "32px",
              fontWeight: 800,
              letterSpacing: "-1.2px",
            }}
          >
            Create your account
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#a59aaf",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            Find your creative space or share your studio with the world.
          </p>
        </div>

        {/* Google Registration */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading || googleLoading}
          style={{
            width: "100%",
            padding: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            border: "1px solid #453951",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            color: "#1f1f1f",
            fontSize: "14px",
            fontWeight: 700,
            cursor: loading || googleLoading ? "not-allowed" : "pointer",
            opacity: googleLoading ? 0.7 : 1,
            transition: "all 0.2s ease",
          }}
        >
          <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.47 13.72 17.74 9.5 24 9.5Z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.64 5.93c4.46-4.12 7.13-10.2 7.13-17.58Z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.91-5.87l-7.64-5.93c-2.12 1.42-4.84 2.26-8.27 2.26-6.26 0-11.53-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
            />
          </svg>

          {googleLoading ? "Connecting to Google..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            margin: "24px 0",
            color: "#81758e",
            fontSize: "11px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#352b43",
            }}
          />
          OR REGISTER WITH EMAIL
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#352b43",
            }}
          />
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "19px" }}>
            <label htmlFor="name" style={labelStyle}>
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#352b43")}
            />
          </div>

          <div style={{ marginBottom: "19px" }}>
            <label htmlFor="email" style={labelStyle}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#352b43")}
            />
          </div>

          <div style={{ marginBottom: "19px" }}>
            <label htmlFor="photoURL" style={labelStyle}>
              Profile photo URL{" "}
              <span style={{ color: "#81758e", fontWeight: 400 }}>
                (Optional)
              </span>
            </label>
            <input
              id="photoURL"
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#352b43")}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                autoComplete="new-password"
                required
                style={{ ...inputStyle, paddingRight: "75px" }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#a78bfa")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#352b43")
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#c2a6ef",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <p
              style={{
                marginTop: "9px",
                color: "#81758e",
                fontSize: "11px",
                lineHeight: 1.6,
              }}
            >
              Use at least 6 characters, including uppercase and lowercase
              letters.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            style={{
              width: "100%",
              padding: "14px",
              border: "1px solid #a78bfa",
              borderRadius: "12px",
              background: loading
                ? "#59427e"
                : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading || googleLoading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 8px 24px rgba(139,92,246,0.2)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div
          style={{
            height: "1px",
            backgroundColor: "#30263c",
            margin: "27px 0 22px",
          }}
        />

        <p
          style={{
            margin: 0,
            textAlign: "center",
            color: "#a59aaf",
            fontSize: "13px",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#c4a5ff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </p>

        <p
          style={{
            marginTop: "25px",
            marginBottom: 0,
            textAlign: "center",
            color: "#756a80",
            fontSize: "11px",
          }}
        >
          © 2026 StudioSpace. All rights reserved.
        </p>
      </div>
    </main>
  );
}
