
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
        name,
        email,
        password,
        photoURL,
        callbackURL: "/login",
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
            disabled={loading}
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
              cursor: loading ? "not-allowed" : "pointer",
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
