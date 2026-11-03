
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CalendarCheck,
  LoaderCircle,
  Ticket,
  XCircle,
} from "lucide-react";
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

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusStyle(status = "") {
  const value = status.toLowerCase();

  if (value === "confirmed") {
    return { background: "#dcfce7", color: "#166534" };
  }

  if (value === "cancelled") {
    return { background: "#fee2e2", color: "#991b1b" };
  }

  if (value === "pending") {
    return { background: "#fef3c7", color: "#92400e" };
  }

  return { background: "#ede9fe", color: "#5b21b6" };
}

export default function MyBookingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(
          `${apiUrl}/api/bookings/my-bookings?email=${encodeURIComponent(session.user.email)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load your bookings.");
        }

        setBookings(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.email, isPending]);

  const handleCancelBooking = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(id);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(
        `${apiUrl}/api/bookings/${id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          getBookingId(booking) === id
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Unable to cancel booking."
      );
    } finally {
      setCancellingId("");
    }
  };

  if (isPending || loading) {
    return (
      <main style={styles.center}>
        <LoaderCircle size={32} className="animate-spin" color="#a78bfa" />
        <p style={styles.muted}>Loading your bookings...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main style={styles.center}>
        <Ticket size={48} color="#a78bfa" />
        <h2 style={styles.heading}>Login required</h2>
        <p style={styles.muted}>Please log in to view your bookings.</p>
        <Link href="/login" style={styles.primaryButton}>
          Login
        </Link>
      </main>
    );
  }

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>YOUR ACTIVITY</p>
            <h1 style={styles.title}>My Bookings</h1>
            <p style={styles.subtitle}>
              Keep track of the studios you have booked.
            </p>
          </div>

          <Link href="/studios" style={styles.primaryButton}>
            Explore Studios
          </Link>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <CalendarCheck size={22} color="#a78bfa" />
            <div>
              <p style={styles.statNumber}>{bookings.length}</p>
              <p style={styles.statLabel}>Total bookings</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <CalendarDays size={22} color="#34d399" />
            <div>
              <p style={styles.statNumber}>{confirmedCount}</p>
              <p style={styles.statLabel}>Confirmed</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <Clock size={22} color="#fbbf24" />
            <div>
              <p style={styles.statNumber}>{pendingCount}</p>
              <p style={styles.statLabel}>Pending</p>
            </div>
          </div>
        </div>

        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Booking History</h2>
          <span style={styles.count}>{bookings.length} bookings</span>
        </div>

        {error ? (
          <div style={styles.emptyCard}>
            <p style={{ color: "#fca5a5" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={styles.secondaryButton}
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>
              <CalendarDays size={30} color="#a78bfa" />
            </div>
            <h3 style={styles.emptyTitle}>No bookings yet</h3>
            <p style={styles.muted}>
              Your studio bookings will appear here once you make a reservation.
            </p>
            <Link href="/studios" style={styles.primaryButton}>
              Find a Studio
            </Link>
          </div>
        ) : (
          <div style={styles.bookingList}>
            {bookings.map((booking, index) => {
              const id = getBookingId(booking);

              return (
                <article key={id || index} style={styles.bookingCard}>
                  <div style={styles.bookingTop}>
                    <div>
                      <h3 style={styles.bookingTitle}>
                        {booking.studioTitle || "Studio Booking"}
                      </h3>
                      <p style={styles.bookingId}>
                        Booking ID: {id || "Not available"}
                      </p>
                    </div>

                    <span
                      style={{
                        ...styles.status,
                        ...getStatusStyle(booking.status),
                      }}
                    >
                      {booking.status || "Unknown"}
                    </span>
                  </div>

                  <div style={styles.detailsGrid}>
                    <div style={styles.detail}>
                      <CalendarDays size={17} color="#a78bfa" />
                      <span>{formatDate(booking.bookingDate)}</span>
                    </div>

                    <div style={styles.detail}>
                      <Clock size={17} color="#a78bfa" />
                      <span>
                        {booking.startTime || "N/A"}
                        {booking.endTime ? ` - ${booking.endTime}` : ""}
                      </span>
                    </div>

                    <div style={styles.detail}>
                      <MapPin size={17} color="#a78bfa" />
                      <span>
                        {booking.studioLocation || "Location not available"}
                      </span>
                    </div>

                    <div style={styles.detail}>
                      <Users size={17} color="#a78bfa" />
                      <span>Studio reservation</span>
                    </div>
                  </div>

                  <div style={styles.bookingBottom}>
                    <div>
                      <p style={styles.priceLabel}>Total amount</p>
                      <p style={styles.price}>
                        {typeof booking.totalPrice === "number"
                          ? `$${booking.totalPrice.toFixed(2)}`
                          : "Not available"}
                      </p>
                    </div>

                    <div style={styles.actions}>
                      {booking.studioId && (
                        <Link
                          href={`/studios/${booking.studioId}`}
                          style={styles.secondaryButton}
                        >
                          View Studio
                        </Link>
                      )}

                      {booking.status === "Pending" && id && (
                        <button
                          onClick={() => handleCancelBooking(id)}
                          disabled={cancellingId === id}
                          style={{
                            ...styles.cancelButton,
                            opacity: cancellingId === id ? 0.6 : 1,
                          }}
                        >
                          {cancellingId === id ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            <XCircle size={15} />
                          )}
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0b0912",
    color: "#f5f3ff",
    padding: "56px 20px 90px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  center: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    background: "#0b0912",
    color: "#f5f3ff",
    textAlign: "center",
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "36px",
  },
  eyebrow: {
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "2px",
    marginBottom: "10px",
  },
  title: {
    fontSize: "clamp(30px, 5vw, 42px)",
    fontWeight: 800,
    letterSpacing: "-1.5px",
    margin: 0,
  },
  subtitle: {
    color: "#a8a1b8",
    marginTop: "10px",
    fontSize: "15px",
  },
  muted: {
    color: "#a8a1b8",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#8b5cf6",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "14px",
    textDecoration: "none",
    border: "1px solid #a78bfa",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#211a31",
    color: "#e9ddff",
    padding: "10px 16px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid #403456",
    cursor: "pointer",
  },
  cancelButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    background: "#3b1824",
    color: "#fda4af",
    padding: "10px 16px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: 600,
    border: "1px solid #713044",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "16px",
    marginBottom: "48px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#15111f",
    border: "1px solid #292237",
    borderRadius: "14px",
    padding: "22px",
  },
  statNumber: {
    fontSize: "25px",
    fontWeight: 800,
    margin: 0,
  },
  statLabel: {
    color: "#a8a1b8",
    fontSize: "13px",
    margin: "4px 0 0",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "21px",
    fontWeight: 700,
    margin: 0,
  },
  count: {
    color: "#a8a1b8",
    fontSize: "13px",
  },
  emptyCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "14px",
    background: "#15111f",
    border: "1px solid #292237",
    borderRadius: "16px",
    padding: "55px 20px",
  },
  emptyIcon: {
    width: "64px",
    height: "64px",
    display: "grid",
    placeItems: "center",
    background: "#241a39",
    borderRadius: "50%",
  },
  emptyTitle: {
    fontSize: "21px",
    fontWeight: 700,
    margin: 0,
  },
  bookingList: {
    display: "grid",
    gap: "18px",
  },
  bookingCard: {
    background: "#15111f",
    border: "1px solid #292237",
    borderRadius: "15px",
    padding: "24px",
  },
  bookingTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "14px",
    paddingBottom: "20px",
    borderBottom: "1px solid #30283e",
  },
  bookingTitle: {
    fontSize: "18px",
    fontWeight: 700,
    margin: 0,
  },
  bookingId: {
    color: "#827b91",
    fontSize: "12px",
    marginTop: "7px",
    wordBreak: "break-all",
  },
  status: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "capitalize",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
    padding: "22px 0",
  },
  detail: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#d2cddd",
    fontSize: "13px",
    minWidth: 0,
    overflowWrap: "anywhere",
  },
  bookingBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
    paddingTop: "18px",
    borderTop: "1px solid #30283e",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  priceLabel: {
    color: "#a8a1b8",
    fontSize: "12px",
    margin: 0,
  },
  price: {
    color: "#c4b5fd",
    fontSize: "22px",
    fontWeight: 800,
    margin: "5px 0 0",
  },
  heading: {
    fontSize: "24px",
    fontWeight: 800,
    margin: 0,
  },
};
