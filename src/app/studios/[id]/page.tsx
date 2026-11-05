"use client";

import { Suspense, useEffect, useState } from "react";

import type { FormEvent } from "react";

import Link from "next/link";

import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Swiper, SwiperSlide } from "swiper/react";

import { Pagination } from "swiper/modules";

import "swiper/css";

import "swiper/css/pagination";

import {
  ArrowLeft,
  MapPin,
  Users,
  Clock,
  CalendarDays,
  LoaderCircle,
  Building2,
  CheckCircle2,
  ShieldCheck,
  X,
  Wallet,
  Wifi,
} from "lucide-react";

type StudioReview = {
  name?: string;

  rating?: number;

  comment?: string;

  createdAt?: string;
};

type Studio = {
  _id: string;

  title: string;

  category: string;

  hourlyRate: number;

  location: string;

  imageUrl?: string;

  image?: string;

  images?: string[];

  gallery?: string[];

  maxCapacity?: number;

  overview?: string;

  details?: string;

  description?: string;

  securityDeposit?: number;

  amenities?: string[];

  hostName?: string;

  rating?: number;

  reviews?: StudioReview[];
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200";

function getLocalDate(): string {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function extractStudio(data: unknown): Studio | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const result = data as Record<string, unknown>;

  if (result._id && typeof result._id === "string") {
    return result as unknown as Studio;
  }

  if (result.data && typeof result.data === "object") {
    const nested = result.data as Record<string, unknown>;

    if (nested._id && typeof nested._id === "string") {
      return nested as unknown as Studio;
    }

    if (nested.studio && typeof nested.studio === "object") {
      return nested.studio as Studio;
    }
  }

  if (result.studio && typeof result.studio === "object") {
    return result.studio as Studio;
  }

  return null;
}

function getErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const result = data as Record<string, unknown>;

  if (typeof result.message === "string") {
    return result.message;
  }

  return null;
}

function StudioDetailsPageContent() {
  const params = useParams<{ id: string }>();

  const router = useRouter();

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [studio, setStudio] = useState<Studio | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [bookingDate, setBookingDate] = useState("");

  const [startTime, setStartTime] = useState("");

  const [endTime, setEndTime] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(getLocalDate());
  }, []);

  useEffect(() => {
    if (!bookingModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBookingModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleEscape);
    };
  }, [bookingModalOpen]);

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
          },
        );

        const data: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            getErrorMessage(data) ||
              (response.status === 404
                ? "This studio could not be found."
                : "Unable to load studio details."),
          );
        }

        const result = extractStudio(data);

        if (!result) {
          throw new Error("Invalid studio information received.");
        }

        setStudio(result);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchStudio();

    return () => controller.abort();
  }, [params.id]);

  const galleryImages = studio
    ? Array.from(
        new Set(
          [
            ...(Array.isArray(studio.gallery) ? studio.gallery : []),

            ...(Array.isArray(studio.images) ? studio.images : []),

            studio.imageUrl,

            studio.image,
          ].filter(
            (image): image is string =>
              typeof image === "string" && image.trim().length > 0,
          ),
        ),
      )
    : [];

  const images = galleryImages.length > 0 ? galleryImages : [FALLBACK_IMAGE];

  const description =
    studio?.overview ||
    studio?.details ||
    studio?.description ||
    "The host has not added a description for this creative space yet.";

  const duration =
    startTime && endTime
      ? (() => {
          const [startHour, startMinute] = startTime.split(":").map(Number);

          const [endHour, endMinute] = endTime.split(":").map(Number);

          return (
            (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60
          );
        })()
      : 0;

  const estimatedPrice =
    studio && duration > 0 ? duration * studio.hourlyRate : 0;

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session) {
      toast.error("Please log in before booking a studio.");

      router.push("/login");

      return;
    }

    if (!studio) {
      toast.error("Studio information is unavailable.");

      return;
    }

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

    if (bookingDate === today) {
      const now = new Date();

      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}`;

      if (startTime <= currentTime) {
        toast.error("Please select a future start time.");

        return;
      }
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

      if (!response.ok) {
        throw new Error(
          getErrorMessage(result) || "Unable to complete your booking.",
        );
      }

      toast.success("Booking request submitted successfully!");

      setBookingDate("");

      setStartTime("");

      setEndTime("");

      setBookingModalOpen(false);

      router.push("/my-bookings");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Booking failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <main style={centerStyle}>
        <LoaderCircle
          size={38}
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
    );
  }

  if (error || !studio) {
    return (
      <main style={centerStyle}>
        <Building2 size={48} color="#b48aff" />

        <h1 style={{ fontSize: 25, margin: "15px 0 8px" }}>Studio not found</h1>

        <p style={{ color: "#a59aaf", marginBottom: 22 }}>
          {error || "This studio may have been removed."}
        </p>

        <Link href="/studios" style={buttonStyle}>
          Explore Studios
        </Link>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={contentStyle}>
        <Link href="/studios" style={backStyle}>
          <ArrowLeft size={16} />
          Back to studios
        </Link>

        <div className="studio-details-layout" style={layoutStyle}>
          <section style={{ minWidth: 0 }}>
            <div style={imageContainerStyle}>
              <Swiper
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                }}
                className="studio-gallery-swiper"
              >
                {images.map((photo, index) => (
                  <SwiperSlide key={`${photo}-${index}`}>
                    <img
                      src={photo}
                      alt={`${studio.title}, image ${index + 1}`}
                      style={imageStyle}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {images.length > 1 && (
                <span style={galleryCountStyle}>{images.length} photos</span>
              )}
            </div>

            <div style={{ marginTop: 28 }}>
              <span style={categoryStyle}>{studio.category}</span>

              <h1 style={titleStyle}>{studio.title}</h1>

              <p style={locationStyle}>
                <MapPin size={17} color="#b48aff" />

                {studio.location}
              </p>

              <div style={statsStyle}>
                <div style={statItemStyle}>
                  <Clock size={21} color="#b48aff" />

                  <div>
                    <p style={statLabelStyle}>Hourly rate</p>

                    <strong>৳{studio.hourlyRate}</strong>
                  </div>
                </div>

                <div style={statItemStyle}>
                  <Users size={21} color="#b48aff" />

                  <div>
                    <p style={statLabelStyle}>Maximum capacity</p>

                    <strong>
                      {studio.maxCapacity
                        ? `${studio.maxCapacity} guests`
                        : "Not specified"}
                    </strong>
                  </div>
                </div>
              </div>

              <section style={contentSectionStyle}>
                <h2 style={sectionTitleStyle}>About this space</h2>

                <p style={descriptionStyle}>{description}</p>
              </section>

              <section style={contentSectionStyle}>
                <h2 style={sectionTitleStyle}>Security deposit</h2>

                <div style={depositCardStyle}>
                  <Wallet size={22} color="#b48aff" />

                  <div>
                    <strong style={{ fontSize: 18 }}>
                      ৳{studio.securityDeposit ?? 0}
                    </strong>

                    <p style={mutedTextStyle}>
                      {typeof studio.securityDeposit === "number"
                        ? "Deposit amount set by the host."
                        : "No security deposit specified."}
                    </p>
                  </div>
                </div>
              </section>

              <section style={contentSectionStyle}>
                <h2 style={sectionTitleStyle}>Amenities</h2>

                {studio.amenities?.length ? (
                  <div style={amenitiesGridStyle}>
                    {studio.amenities.map((amenity) => (
                      <div key={amenity} style={amenityStyle}>
                        <CheckCircle2 size={16} color="#b48aff" />

                        {amenity}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={mutedTextStyle}>
                    The host has not added any amenities yet.
                  </p>
                )}
              </section>

              <section style={contentSectionStyle}>
                <h2 style={sectionTitleStyle}>Your host</h2>

                <div style={hostCardStyle}>
                  <div style={hostAvatarStyle}>
                    <Building2 size={24} color="#c4a5ff" />
                  </div>

                  <div>
                    <p style={mutedTextStyle}>Hosted by</p>

                    <strong style={{ fontSize: 16 }}>
                      {studio.hostName || "Studio host"}
                    </strong>

                    <p style={mutedTextStyle}>StudioSpace host</p>
                  </div>
                </div>
              </section>

              <section style={contentSectionStyle}>
                <h2 style={sectionTitleStyle}>Reviews</h2>

                {studio.reviews?.length ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    {studio.reviews.map((review, index) => (
                      <article
                        key={`${review.name || "creator"}-${index}`}
                        style={reviewCardStyle}
                      >
                        <div style={reviewHeaderStyle}>
                          <strong>{review.name || "Creator"}</strong>

                          {typeof review.rating === "number" && (
                            <span style={ratingStyle}>
                              ★ {review.rating.toFixed(1)}
                            </span>
                          )}
                        </div>

                        {review.comment && (
                          <p style={descriptionStyle}>{review.comment}</p>
                        )}

                        {review.createdAt && (
                          <p style={reviewDateStyle}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div style={emptyReviewsStyle}>
                    <p style={{ color: "#d7c3ff", margin: 0 }}>
                      No reviews yet
                    </p>

                    <p style={mutedTextStyle}>
                      Reviews will appear here when they are available.
                    </p>
                  </div>
                )}
              </section>

              <div style={featuresStyle}>
                <ShieldCheck size={19} color="#b48aff" />

                <span>Booking requests are processed securely.</span>
              </div>

              <div style={featuresStyle}>
                <CheckCircle2 size={19} color="#b48aff" />

                <span>Book directly through StudioSpace.</span>
              </div>
            </div>
          </section>

          <aside style={bookingCardStyle}>
            <p style={eyebrowStyle}>RESERVE YOUR SPACE</p>

            <h2 style={bookingTitleStyle}>Book this studio</h2>

            <p style={mutedTextStyle}>Choose your preferred date and time.</p>

            <div style={priceStyle}>
              <strong>৳{studio.hourlyRate}</strong>

              <span>/ hour</span>
            </div>

            <div style={bookingInfoStyle}>
              <CalendarDays size={18} color="#b48aff" />

              <span>Flexible date and time selection</span>
            </div>

            <div style={bookingInfoStyle}>
              <ShieldCheck size={18} color="#b48aff" />

              <span>Booking confirmation by host</span>
            </div>

            <button
              type="button"
              onClick={() => setBookingModalOpen(true)}
              style={submitButtonStyle}
            >
              Request a Booking
            </button>

            {!session && (
              <p style={loginNoticeStyle}>
                You will need to log in before submitting your booking.
              </p>
            )}

            <div style={depositNoticeStyle}>
              <Wallet size={16} color="#b48aff" />

              <span>Security deposit: ৳{studio.securityDeposit ?? 0}</span>
            </div>
          </aside>
        </div>

        {bookingModalOpen && (
          <div
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setBookingModalOpen(false);
              }
            }}
            style={modalOverlayStyle}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-modal-title"
              style={modalCardStyle}
            >
              <div style={modalHeaderStyle}>
                <div>
                  <p style={eyebrowStyle}>STUDIOSPACE BOOKING</p>

                  <h2 id="booking-modal-title" style={modalTitleStyle}>
                    Book {studio.title}
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close booking modal"
                  onClick={() => setBookingModalOpen(false)}
                  style={closeButtonStyle}
                >
                  <X size={21} />
                </button>
              </div>

              <p style={mutedTextStyle}>
                Select the date and time you want to reserve this space.
              </p>

              <form onSubmit={handleBooking}>
                <label htmlFor="bookingDate" style={labelStyle}>
                  Booking date
                </label>

                <div style={inputWrapperStyle}>
                  <CalendarDays size={17} color="#b48aff" />

                  <input
                    id="bookingDate"
                    type="date"
                    value={bookingDate}
                    min={today || undefined}
                    onChange={(event) => setBookingDate(event.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <label htmlFor="startTime" style={labelStyle}>
                  Start time
                </label>

                <div style={inputWrapperStyle}>
                  <Clock size={17} color="#b48aff" />

                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                <label htmlFor="endTime" style={labelStyle}>
                  End time
                </label>

                <div style={inputWrapperStyle}>
                  <Clock size={17} color="#b48aff" />

                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>

                {duration > 0 && (
                  <div style={estimateCardStyle}>
                    <div style={estimateRowStyle}>
                      <span>Duration</span>

                      <strong>
                        {Number.isInteger(duration)
                          ? duration
                          : duration.toFixed(2)}{" "}
                        hours
                      </strong>
                    </div>

                    <div style={estimateRowStyle}>
                      <span>Hourly rate</span>

                      <strong>৳{studio.hourlyRate}</strong>
                    </div>

                    <div style={estimateTotalStyle}>
                      <span>Estimated total</span>

                      <strong>
                        ৳
                        {estimatedPrice.toLocaleString("en-BD", {
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>
                  </div>
                )}

                <p style={loginNoticeStyle}>
                  {session
                    ? "Your request will remain pending until the host confirms it."
                    : "You need to log in before submitting a booking request."}
                </p>

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
                    "Confirm Booking Request"
                  )}
                </button>
              </form>
            </section>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .studio-gallery-swiper {
          width: 100%;

          height: 100%;
        }

        .studio-gallery-swiper .swiper-slide {
          height: 100%;
        }

        .studio-gallery-swiper .swiper-pagination {
          bottom: 16px;
        }

        .studio-gallery-swiper .swiper-pagination-bullet {
          background: #ffffff;

          opacity: 0.55;
        }

        .studio-gallery-swiper .swiper-pagination-bullet-active {
          background: #b48aff;

          opacity: 1;
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
          .studio-gallery-swiper img {
            height: 260px !important;
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
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        </div>
      }
    >
      <StudioDetailsPageContent />
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

const contentStyle = {
  maxWidth: 1120,

  margin: "0 auto",
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

  gridTemplateColumns: "minmax(0, 1.5fr) minmax(280px, 0.8fr)",

  gap: 35,

  alignItems: "start",
};

const imageContainerStyle = {
  height: 390,

  position: "relative" as const,

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

const galleryCountStyle = {
  position: "absolute" as const,

  top: 15,

  right: 15,

  zIndex: 5,

  padding: "7px 12px",

  borderRadius: 30,

  background: "#09070dcc",

  color: "#ffffff",

  fontSize: 11,

  fontWeight: 650,
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

const contentSectionStyle = {
  marginTop: 32,
};

const sectionTitleStyle = {
  fontSize: 21,

  fontWeight: 750,

  marginBottom: 14,
};

const descriptionStyle = {
  color: "#b9adca",

  fontSize: 14,

  lineHeight: 1.9,

  whiteSpace: "pre-wrap" as const,
};

const mutedTextStyle = {
  color: "#a59aaf",

  fontSize: 13,

  lineHeight: 1.7,
};

const depositCardStyle = {
  display: "flex",

  alignItems: "center",

  gap: 14,

  padding: 18,

  border: "1px solid #30263c",

  borderRadius: 12,

  background: "#15111c",
};

const amenitiesGridStyle = {
  display: "grid",

  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",

  gap: 11,
};

const amenityStyle = {
  display: "flex",

  alignItems: "center",

  gap: 9,

  padding: "12px 14px",

  border: "1px solid #30263c",

  borderRadius: 10,

  background: "#15111c",

  color: "#d7c3ff",

  fontSize: 12,
};

const hostCardStyle = {
  display: "flex",

  alignItems: "center",

  gap: 14,

  padding: 18,

  border: "1px solid #30263c",

  borderRadius: 12,

  background: "#15111c",
};

const hostAvatarStyle = {
  width: 52,

  height: 52,

  display: "grid",

  placeItems: "center",

  borderRadius: "50%",

  background: "#291b3b",
};

const reviewCardStyle = {
  padding: 17,

  border: "1px solid #30263c",

  borderRadius: 12,

  background: "#15111c",
};

const reviewHeaderStyle = {
  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  gap: 12,

  marginBottom: 10,
};

const ratingStyle = {
  color: "#fbbf24",

  fontSize: 13,

  fontWeight: 700,
};

const reviewDateStyle = {
  color: "#81758e",

  fontSize: 11,

  marginTop: 10,
};

const emptyReviewsStyle = {
  padding: 18,

  border: "1px solid #30263c",

  borderRadius: 12,

  background: "#15111c",
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

const bookingTitleStyle = {
  fontSize: 25,

  fontWeight: 750,

  margin: "10px 0",
};

const priceStyle = {
  display: "flex",

  alignItems: "baseline",

  gap: 6,

  margin: "24px 0",

  paddingBottom: 20,

  borderBottom: "1px solid #30263c",
};

const bookingInfoStyle = {
  display: "flex",

  alignItems: "center",

  gap: 10,

  marginBottom: 15,

  color: "#b9adca",

  fontSize: 12,
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

  cursor: "pointer",
};

const loginNoticeStyle = {
  color: "#a59aaf",

  fontSize: 11,

  lineHeight: 1.7,

  margin: "18px 0",
};

const depositNoticeStyle = {
  display: "flex",

  alignItems: "center",

  gap: 8,

  paddingTop: 18,

  marginTop: 18,

  borderTop: "1px solid #30263c",

  color: "#b9adca",

  fontSize: 12,
};

const modalOverlayStyle = {
  position: "fixed" as const,

  inset: 0,

  zIndex: 220,

  background: "#000b",

  display: "grid",

  placeItems: "center",

  padding: 20,

  overflowY: "auto" as const,
};

const modalCardStyle = {
  width: "min(520px, 100%)",

  maxHeight: "90vh",

  overflowY: "auto" as const,

  background: "#15111c",

  color: "#ffffff",

  border: "1px solid #49345e",

  borderRadius: 18,

  padding: 25,

  boxShadow: "0 24px 80px #0008",
};

const modalHeaderStyle = {
  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  gap: 15,

  marginBottom: 15,
};

const modalTitleStyle = {
  fontSize: 22,

  fontWeight: 800,

  margin: "8px 0 0",
};

const closeButtonStyle = {
  width: 38,

  height: 38,

  display: "grid",

  placeItems: "center",

  border: "1px solid #49345e",

  borderRadius: 9,

  background: "#21172e",

  color: "#ffffff",

  cursor: "pointer",
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

const estimateCardStyle = {
  marginTop: 20,

  padding: 16,

  border: "1px solid #49345e",

  borderRadius: 12,

  background: "#21172e",
};

const estimateRowStyle = {
  display: "flex",

  justifyContent: "space-between",

  gap: 12,

  color: "#b9adca",

  fontSize: 12,

  marginBottom: 12,
};

const estimateTotalStyle = {
  display: "flex",

  justifyContent: "space-between",

  gap: 12,

  paddingTop: 13,

  borderTop: "1px solid #49345e",

  color: "#ffffff",

  fontSize: 14,

  fontWeight: 750,
};
