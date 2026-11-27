"use client";

import "./my-bookings.css";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CalendarCheck,
  LoaderCircle,
  Ticket,
  XCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id?: string;
  id?: string;
  studioId?: string;
  studioTitle?: string;
  studioLocation?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  totalPrice?: number;
  status?: string;
};

function getBookingId(booking: Booking) {
  return booking._id || booking.id || "";
}

function formatDate(value = "") {
  if (!value) return "Date not available";

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  const date = dateOnly
    ? new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3]),
      )
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function normalizeStatus(value = "") {
  return value.trim().toLowerCase();
}

function getStatusStyle(status = ""): CSSProperties {
  const value = normalizeStatus(status);

  if (value === "confirmed") {
    return {
      background: "rgba(197, 244, 119, 0.13)",
      color: "#c5f477",
      border: "1px solid rgba(197, 244, 119, 0.25)",
    };
  }

  if (value === "cancelled") {
    return {
      background: "rgba(248, 113, 113, 0.12)",
      color: "#fca5a5",
      border: "1px solid rgba(248, 113, 113, 0.22)",
    };
  }

  if (value === "pending") {
    return {
      background: "rgba(251, 191, 36, 0.12)",
      color: "#fbbf24",
      border: "1px solid rgba(251, 191, 36, 0.22)",
    };
  }

  return {
    background: "rgba(167, 139, 250, 0.12)",
    color: "#c4b5fd",
    border: "1px solid rgba(167, 139, 250, 0.22)",
  };
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export default function MyBookingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");
  const [cancelTarget, setCancelTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const modalRef = useRef<HTMLElement | null>(null);
  const cancellingIdRef = useRef(cancellingId);

  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    const controller = new AbortController();

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/bookings/my-bookings`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        const result: unknown = await response.json().catch(() => null);

        const data =
          result && typeof result === "object"
            ? (result as { data?: unknown; message?: unknown })
            : null;

        if (!response.ok) {
          throw new Error(
            typeof data?.message === "string"
              ? data.message
              : "Unable to load your bookings.",
          );
        }

        setBookings(Array.isArray(data?.data) ? (data.data as Booking[]) : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";

        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchBookings();

    return () => {
      controller.abort();
    };
  }, [session?.user?.email, isPending]);

  useEffect(() => {
    cancellingIdRef.current = cancellingId;
  }, [cancellingId]);

  useEffect(() => {
    if (!cancelTarget) return;

    const modal = modalRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      modal
        ? Array.from(
            modal.querySelectorAll<HTMLElement>(focusableSelector),
          ).filter((element) => element.offsetParent !== null)
        : [];

    getFocusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!cancellingIdRef.current) {
          setCancelTarget(null);
        }

        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [cancelTarget]);

  const handleCancelBooking = async (id: string) => {
    if (cancellingId) return;

    try {
      setCancellingId(id);

      const response = await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });

      const result: unknown = await response.json().catch(() => null);

      const message =
        result &&
        typeof result === "object" &&
        typeof (result as { message?: unknown }).message === "string"
          ? (result as { message: string }).message
          : "";

      if (!response.ok) {
        throw new Error(message || "Failed to cancel booking.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          getBookingId(booking) === id
            ? { ...booking, status: "Cancelled" }
            : booking,
        ),
      );

      setCancelTarget(null);
      toast.success("Booking cancelled successfully.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to cancel booking.";

      toast.error(message);
    } finally {
      setCancellingId("");
    }
  };

  if (isPending) {
    return (
      <main className="my-bookings-state">
        <LoaderCircle size={34} className="my-bookings-spinner" />
        <p>Loading your bookings...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="my-bookings-state">
        <div className="my-bookings-state-icon">
          <Ticket size={30} />
        </div>

        <h2>Login required</h2>

        <p>Please log in to view your bookings.</p>

        <Link href="/login" className="my-bookings-primary-button">
          Login
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="my-bookings-state">
        <LoaderCircle size={34} className="my-bookings-spinner" />
        <p>Loading your bookings...</p>
      </main>
    );
  }

  const confirmedCount = bookings.filter(
    (booking) => normalizeStatus(booking.status) === "confirmed",
  ).length;

  const pendingCount = bookings.filter(
    (booking) => normalizeStatus(booking.status) === "pending",
  ).length;

  return (
    <>
      <main className="my-bookings-page">
        <div className="my-bookings-container">
          <header className="my-bookings-header">
            <div className="my-bookings-heading-content">
              <p className="my-bookings-eyebrow">YOUR ACTIVITY</p>

              <h1>My Bookings</h1>

              <p className="my-bookings-subtitle">
                Keep track of the studios you have booked.
              </p>
            </div>

            <Link href="/studios" className="my-bookings-primary-button">
              <CalendarDays size={17} />
              Explore Studios
            </Link>
          </header>

          <section className="my-bookings-stats" aria-label="Booking summary">
            <article className="my-bookings-stat-card">
              <div className="my-bookings-stat-icon total">
                <CalendarCheck size={21} />
              </div>

              <div>
                <p className="my-bookings-stat-number">{bookings.length}</p>
                <p className="my-bookings-stat-label">Total bookings</p>
              </div>
            </article>

            <article className="my-bookings-stat-card">
              <div className="my-bookings-stat-icon confirmed">
                <CalendarDays size={21} />
              </div>

              <div>
                <p className="my-bookings-stat-number">{confirmedCount}</p>
                <p className="my-bookings-stat-label">Confirmed</p>
              </div>
            </article>

            <article className="my-bookings-stat-card">
              <div className="my-bookings-stat-icon pending">
                <Clock size={21} />
              </div>

              <div>
                <p className="my-bookings-stat-number">{pendingCount}</p>
                <p className="my-bookings-stat-label">Pending</p>
              </div>
            </article>
          </section>

          <div className="my-bookings-section-header">
            <div>
              <p className="my-bookings-section-eyebrow">OVERVIEW</p>
              <h2>Booking History</h2>
            </div>

            <span className="my-bookings-count">
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </span>
          </div>

          {error ? (
            <div className="my-bookings-empty-card my-bookings-error-card">
              <div className="my-bookings-state-icon error">
                <AlertTriangle size={28} />
              </div>

              <h3>Unable to load bookings</h3>

              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="my-bookings-secondary-button"
              >
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="my-bookings-empty-card">
              <div className="my-bookings-state-icon">
                <CalendarDays size={30} />
              </div>

              <p className="my-bookings-empty-eyebrow">NOTHING HERE YET</p>

              <h3>No bookings yet</h3>

              <p>
                Your studio bookings will appear here once you make a
                reservation.
              </p>

              <Link href="/studios" className="my-bookings-primary-button">
                <Ticket size={17} />
                Find a Studio
              </Link>
            </div>
          ) : (
            <section className="my-bookings-list" aria-label="Your bookings">
              {bookings.map((booking, index) => {
                const id = getBookingId(booking);
                const status = normalizeStatus(booking.status);
                const canCancel = status === "pending" && Boolean(id);

                return (
                  <article key={id || index} className="my-bookings-card">
                    <div className="my-bookings-card-top">
                      <div className="my-bookings-card-heading">
                        <span className="my-bookings-card-label">
                          STUDIO RESERVATION
                        </span>

                        <h3>{booking.studioTitle || "Studio Booking"}</h3>

                        <p className="my-bookings-id">
                          Booking ID: {id || "Not available"}
                        </p>
                      </div>

                      <span
                        className={`my-bookings-status ${status || "unknown"}`}
                        style={getStatusStyle(booking.status)}
                      >
                        <span className="my-bookings-status-dot" />
                        {booking.status || "Unknown"}
                      </span>
                    </div>

                    <div className="my-bookings-details">
                      <div className="my-bookings-detail">
                        <span className="my-bookings-detail-icon">
                          <CalendarDays size={17} />
                        </span>

                        <div>
                          <span className="my-bookings-detail-label">
                            BOOKING DATE
                          </span>
                          <p>{formatDate(booking.bookingDate)}</p>
                        </div>
                      </div>

                      <div className="my-bookings-detail">
                        <span className="my-bookings-detail-icon">
                          <Clock size={17} />
                        </span>

                        <div>
                          <span className="my-bookings-detail-label">
                            TIME SLOT
                          </span>
                          <p>
                            {booking.startTime || "N/A"}
                            {booking.endTime ? ` - ${booking.endTime}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="my-bookings-detail">
                        <span className="my-bookings-detail-icon">
                          <MapPin size={17} />
                        </span>

                        <div>
                          <span className="my-bookings-detail-label">
                            LOCATION
                          </span>
                          <p>
                            {booking.studioLocation || "Location not available"}
                          </p>
                        </div>
                      </div>

                      <div className="my-bookings-detail">
                        <span className="my-bookings-detail-icon">
                          <Users size={17} />
                        </span>

                        <div>
                          <span className="my-bookings-detail-label">
                            RESERVATION
                          </span>
                          <p>Studio reservation</p>
                        </div>
                      </div>
                    </div>

                    <div className="my-bookings-card-bottom">
                      <div className="my-bookings-price-block">
                        <p>Total amount</p>

                        <strong>
                          {typeof booking.totalPrice === "number"
                            ? `$${booking.totalPrice.toFixed(2)}`
                            : "Not available"}
                        </strong>
                      </div>

                      <div className="my-bookings-actions">
                        {booking.studioId && (
                          <Link
                            href={`/studios/${booking.studioId}`}
                            className="my-bookings-secondary-button"
                          >
                            View Studio
                          </Link>
                        )}

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() =>
                              setCancelTarget({
                                id,
                                title: booking.studioTitle || "this studio",
                              })
                            }
                            disabled={Boolean(cancellingId)}
                            className="my-bookings-cancel-button"
                          >
                            <XCircle size={16} />
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>

      {cancelTarget && (
        <div
          className="my-bookings-modal-overlay"
          onClick={() => {
            if (!cancellingId) {
              setCancelTarget(null);
            }
          }}
        >
          <section
            ref={modalRef}
            className="my-bookings-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="my-bookings-modal-header">
              <div className="my-bookings-modal-icon">
                <AlertTriangle size={24} />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!cancellingId) {
                    setCancelTarget(null);
                  }
                }}
                disabled={Boolean(cancellingId)}
                aria-label="Close confirmation dialog"
                className="my-bookings-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="my-bookings-modal-eyebrow">BOOKING CANCELLATION</p>

            <h2 id="cancel-dialog-title">Cancel this booking?</h2>

            <p className="my-bookings-modal-description">
              Are you sure you want to cancel your booking for{" "}
              <strong>{cancelTarget.title}</strong>? This action may not be
              reversible.
            </p>

            <div className="my-bookings-modal-actions">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={Boolean(cancellingId)}
                className="my-bookings-keep-button"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={() => void handleCancelBooking(cancelTarget.id)}
                disabled={Boolean(cancellingId)}
                className="my-bookings-confirm-cancel"
              >
                {cancellingId ? (
                  <>
                    <LoaderCircle size={16} className="my-bookings-spinner" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    Yes, Cancel
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
