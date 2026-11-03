
"use client";

import { Suspense, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  CalendarDays,
  LoaderCircle,
  Building2,
  CheckCircle2,
} from "lucide-react";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl?: string;
  image?: string;
  maxCapacity?: number;
  details?: string;
  description?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function extractStudio(data: unknown): Studio | null {
  if (!data || typeof data !== "object") return null;

  const result = data as Record<string, unknown>;

  if (result._id) return result as unknown as Studio;

  if (result.studio && typeof result.studio === "object") {
    return result.studio as Studio;
  }

  if (result.data && typeof result.data === "object") {
    const nested = result.data as Record<string, unknown>;

    if (nested._id) return nested as unknown as Studio;

    if (nested.studio && typeof nested.studio === "object") {
      return nested.studio as Studio;
    }
  }

  return null;
}

function StudioDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();

    const localDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    setToday(localDate);
  }, []);

  useEffect(() => {
    const studioId = params.id;

    if (!studioId) {
      setError("Invalid studio ID.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchStudio = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/studios/${encodeURIComponent(studioId)}`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "This studio could not be found."
              : "Unable to load studio details."
          );
        }

        const data: unknown = await response.json();
        const result = extractStudio(data);

        if (!result) {
          throw new Error("Invalid studio information received.");
        }

        setStudio(result);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchStudio();

    return () => controller.abort();
  }, [params.id]);

  const handleBooking = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!session) {
      toast.error("Please log in before booking a studio.");
      router.push("/login");
      return;
    }

    if (!studio) return;

    if (!bookingDate || !startTime || !endTime) {
      toast.error("Please complete all booking fields.");
      return;
    }

    if (today && bookingDate < today) {
      toast.error("Please select today or a future date.");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be later than start time.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate,
          startTime,
          endTime,
        }),
      });

      const result: unknown = await response.json().catch(() => null);

      const errorMessage =
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof result.message === "string"
          ? result.message
          : "Unable to complete your booking.";

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      toast.success("Booking request submitted successfully!");

      setBookingDate("");
      setStartTime("");
      setEndTime("");

      router.push("/my-bookings");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Booking failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <main style={centerStyle}>
        <div style={{ textAlign: "center" }}>
          <LoaderCircle
            size={35}
            color="#b48aff"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <p style={{ color: "#b9adca", marginTop: 15 }}>
            Loading studio details...
          </p>
        </div>

        <style jsx global>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  if (error || !studio) {
    return (
      <main style={centerStyle}>
        <Building2 size={45} color="#b48aff" />

        <h1 style={{ fontSize: 25, margin: "15px 0 8px" }}>
          Studio not found
        </h1>

        <p style={{ color: "#a59aaf", marginBottom: 22 }}>
          {error || "This studio may have been removed."}
        </p>

        <Link href="/studios" style={buttonStyle}>
          Explore Studios
        </Link>
      </main>
    );
  }

  const image =
    studio.imageUrl ||
    studio.image ||
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200";

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Link href="/studios" style={backStyle}>
          <ArrowLeft size={16} />
          Back to studios
        </Link>

        <div className="studio-details-layout" style={layoutStyle}>
          <section>
            <div style={imageContainerStyle}>
              <img
                src={image}
                alt={studio.title}
                style={imageStyle}
              />
            </div>

            <div style={{ marginTop: 28 }}>
              <span style={categoryStyle}>
                {studio.category}
              </span>

              <h1 style={titleStyle}>{studio.title}</h1>

              <p style={locationStyle}>
                <MapPin size={17} color="#b48aff" />
                {studio.location}
              </p>

              <div style={statsStyle}>
                <div style={statItemStyle}>
                  <Clock size={20} color="#b48aff" />

                  <div>
                    <p style={statLabelStyle}>Hourly rate</p>
                    <strong>৳{studio.hourlyRate}</strong>
                  </div>
                </div>

                <div style={statItemStyle}>
                  <Users size={20} color="#b48aff" />

                  <div>
                    <p style={statLabelStyle}>
                      Maximum capacity
                    </p>

                    <strong>
                      {studio.maxCapacity ?? "Not specified"} guests
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 35 }}>
                <h2 style={sectionTitleStyle}>
                  About this space
                </h2>

                <p style={descriptionStyle}>
                  {studio.details ||
                    studio.description ||
                    "Contact the host for more information about this creative space."}
                </p>
              </div>

              <div style={featuresStyle}>
                <CheckCircle2 size={18} color="#b48aff" />
                <span>Book directly through StudioSpace</span>
              </div>

              <div style={featuresStyle}>
                <CheckCircle2 size={18} color="#b48aff" />
                <span>Secure booking request</span>
              </div>
            </div>
          </section>

          <aside style={bookingCardStyle}>
            <p style={eyebrowStyle}>RESERVE YOUR SPACE</p>

            <h2 style={{ fontSize: 25, margin: "10px 0" }}>
              Book this studio
            </h2>

            <p style={{ color: "#a59aaf", fontSize: 13 }}>
              Choose your preferred date and time.
            </p>

            <div style={priceStyle}>
              <strong>৳{studio.hourlyRate}</strong>
              <span>/ hour</span>
            </div>

            <form onSubmit={handleBooking}>
              <label style={labelStyle}>Booking date</label>

              <div style={inputWrapperStyle}>
                <CalendarDays size={17} color="#b48aff" />

                <input
                  type="date"
                  value={bookingDate}
                  min={today || undefined}
                  onChange={(event) =>
                    setBookingDate(event.target.value)
                  }
                  required
                  style={inputStyle}
                />
              </div>

              <label style={labelStyle}>Start time</label>

              <div style={inputWrapperStyle}>
                <Clock size={17} color="#b48aff" />

                <input
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(event.target.value)
                  }
                  required
                  style={inputStyle}
                />
              </div>

              <label style={labelStyle}>End time</label>

              <div style={inputWrapperStyle}>
                <Clock size={17} color="#b48aff" />

                <input
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(event.target.value)
                  }
                  required
                  style={inputStyle}
                />
              </div>

              {!session ? (
                <p style={loginNoticeStyle}>
                  You need to log in before submitting a booking
                  request.
                </p>
              ) : (
                <p style={loginNoticeStyle}>
                  Booking requests are submitted as pending until
                  confirmed.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...submitButtonStyle,
                  opacity: submitting ? 0.65 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? (
                  <>
                    <LoaderCircle
                      size={17}
                      style={{
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Submitting...
                  </>
                ) : (
                  "Request Booking"
                )}
              </button>
            </form>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        input[type="date"],
        input[type="time"] {
          color-scheme: dark;
        }

        @media (max-width: 760px) {
          .studio-details-layout {
            grid-template-columns: 1fr !important;
          }

          .studio-details-layout > aside {
            position: static !important;
          }
        }

        @media (max-width: 480px) {
          .studio-details-layout img {
            height: 260px;
          }
        }
      `}</style>
    </main>
  );
}

export default function StudioDetailsPage() {
  return (
    <Suspense
      fallback={
        <main style={centerStyle}>
          <LoaderCircle
            size={35}
            color="#b48aff"
            style={{ animation: "spin 1s linear infinite" }}
          />

          <p style={{ color: "#b9adca", marginTop: 15 }}>
            Loading studio details...
          </p>

          <style jsx global>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </main>
      }
    >
      <StudioDetailsContent />
    </Suspense>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "38px 20px 80px",
  background:
    "radial-gradient(ellipse at top left, #251637 0%, transparent 38%), #09070d",
  color: "#ffffff",
};

const centerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: "#09070d",
  color: "#ffffff",
  textAlign: "center" as const,
};

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 22px",
  borderRadius: 10,
  background: "linear-gradient(135deg, #9b6dff, #7041d8)",
  color: "#ffffff",
  fontWeight: 600,
  textDecoration: "none",
};

const backStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  color: "#b9a9ca",
  fontSize: 13,
  textDecoration: "none",
  marginBottom: 30,
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.5fr) minmax(300px, 0.8fr)",
  gap: 35,
  alignItems: "start",
};

const imageContainerStyle = {
  height: 390,
  overflow: "hidden",
  borderRadius: 18,
  background: "#21172e",
  border: "1px solid #30263c",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const categoryStyle = {
  display: "inline-block",
  padding: "7px 12px",
  borderRadius: 20,
  background: "#291b3b",
  color: "#c4a5ff",
  fontSize: 11,
  fontWeight: 700,
};

const titleStyle = {
  fontSize: "clamp(28px, 5vw, 40px)",
  fontWeight: 800,
  letterSpacing: "-1px",
  margin: "17px 0 12px",
};

const locationStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#b9adca",
  fontSize: 14,
};

const statsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 15,
  marginTop: 28,
};

const statItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 18,
  border: "1px solid #30263c",
  borderRadius: 12,
  background: "#15111c",
};

const statLabelStyle = {
  color: "#a59aaf",
  fontSize: 11,
  margin: "0 0 5px",
};

const sectionTitleStyle = {
  fontSize: 21,
  fontWeight: 750,
  marginBottom: 12,
};

const descriptionStyle = {
  color: "#b9adca",
  fontSize: 14,
  lineHeight: 1.9,
  whiteSpace: "pre-wrap" as const,
};

const featuresStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#d7c3ff",
  fontSize: 13,
  marginTop: 15,
};

const bookingCardStyle = {
  padding: 25,
  border: "1px solid #49345e",
  borderRadius: 17,
  background: "#15111c",
  position: "sticky" as const,
  top: 25,
};

const eyebrowStyle = {
  color: "#b48aff",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1.7,
};

const priceStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: 6,
  margin: "24px 0",
  paddingBottom: 20,
  borderBottom: "1px solid #30263c",
};

const labelStyle = {
  display: "block",
  color: "#d7c3ff",
  fontSize: 12,
  fontWeight: 650,
  margin: "18px 0 8px",
};

const inputWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "0 13px",
  height: 49,
  border: "1px solid #49345e",
  borderRadius: 9,
  background: "#09070d",
};

const inputStyle = {
  width: "100%",
  height: "100%",
  border: 0,
  outline: 0,
  background: "transparent",
  color: "#ffffff",
  fontSize: 13,
};

const loginNoticeStyle = {
  color: "#a59aaf",
  fontSize: 11,
  lineHeight: 1.7,
  margin: "18px 0",
};

const submitButtonStyle = {
  width: "100%",
  minHeight: 49,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  border: 0,
  borderRadius: 9,
  background: "#8b5cf6",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 750,
};
