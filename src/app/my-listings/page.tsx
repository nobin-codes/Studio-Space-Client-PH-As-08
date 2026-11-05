
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Plus,
  MapPin,
  Clock,
  Users,
  Pencil,
  Trash2,
  Building2,
  RefreshCw,
  ArrowLeft,
  X,
  AlertTriangle,
} from "lucide-react";

type Studio = {
  _id: string;
  id?: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  maxCapacity: number;
  ownerEmail?: string;
  hostEmail?: string;
};

function getStudioId(studio: Studio) {
  return studio._id || studio.id || "";
}

function extractStudios(data: unknown): Studio[] {
  if (Array.isArray(data)) return data as Studio[];

  if (data && typeof data === "object") {
    const result = data as Record<string, unknown>;

    if (Array.isArray(result.studios)) return result.studios as Studio[];
    if (Array.isArray(result.data)) return result.data as Studio[];

    if (
      result.data &&
      typeof result.data === "object" &&
      Array.isArray((result.data as Record<string, unknown>).studios)
    ) {
      return (result.data as { studios: Studio[] }).studios;
    }
  }

  return [];
}

export default function MyListingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const fetchListings = useCallback(async () => {
    if (!session?.user.email) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/studios`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Unable to load studio listings.");
      }

      const data: unknown = await response.json();
      const allStudios = extractStudios(data);

      const myStudios = allStudios.filter((studio) => {
        const email = studio.ownerEmail || studio.hostEmail;
        return email?.toLowerCase() === session.user.email.toLowerCase();
      });

      setStudios(myStudios);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user.email]);

  useEffect(() => {
    if (!isPending && session) {
      void fetchListings();
    }

    if (!isPending && !session) {
      setLoading(false);
    }
  }, [isPending, session, fetchListings]);

  useEffect(() => {
    if (!deleteTarget) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deletingId) {
        setDeleteTarget(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [deleteTarget, deletingId]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Unable to delete this studio.");
      }

      setStudios((previous) =>
        previous.filter((studio) => getStudioId(studio) !== id)
      );

      setDeleteTarget(null);
      toast.success("Studio listing deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete listing."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#09070d",
          color: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <RefreshCw
            size={30}
            style={{
              color: "#b48aff",
              animation: "spin 1s linear infinite",
              margin: "0 auto 15px",
            }}
          />
          <p style={{ color: "#b9adca", fontSize: "14px" }}>
            Loading your listings...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background: "#09070d",
          color: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "25px", fontWeight: 800 }}>
            Login required
          </h1>
          <p style={{ color: "#a59aaf", margin: "12px 0 22px" }}>
            Please log in to manage your studio listings.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-block",
              padding: "12px 22px",
              borderRadius: "10px",
              background: "#8b5cf6",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          padding: "38px 20px 80px",
          background:
            "radial-gradient(ellipse at top left, #251637 0%, transparent 38%), #09070d",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#b9a9ca",
              fontSize: "13px",
              textDecoration: "none",
              marginBottom: "30px",
            }}
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#b48aff",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  marginBottom: "10px",
                }}
              >
                HOST WORKSPACE
              </p>
              <h1
                style={{
                  fontSize: "clamp(28px, 4vw, 38px)",
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  margin: 0,
                }}
              >
                My Listings
              </h1>
              <p style={{ color: "#a59aaf", fontSize: "14px", marginTop: "9px" }}>
                Manage the creative spaces you've shared.
              </p>
            </div>

            <Link
              href="/add-studio"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "9px",
                padding: "13px 19px",
                borderRadius: "11px",
                background: "#8b5cf6",
                border: "1px solid #b48aff",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <Plus size={17} />
              Add New Studio
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "22px",
              padding: "17px 20px",
              border: "1px solid #30263c",
              borderRadius: "13px",
              background: "#15111c",
            }}
          >
            <div>
              <p style={{ color: "#a59aaf", fontSize: "12px", margin: 0 }}>
                TOTAL LISTINGS
              </p>
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "25px",
                  fontWeight: 800,
                  margin: "4px 0 0",
                }}
              >
                {studios.length}
              </p>
            </div>

            <Building2 size={28} color="#b48aff" />
          </div>

          {studios.length === 0 ? (
            <div
              style={{
                padding: "65px 20px",
                textAlign: "center",
                border: "1px dashed #49345e",
                borderRadius: "18px",
                background: "#15111c",
              }}
            >
              <Building2
                size={42}
                color="#b48aff"
                style={{ margin: "0 auto 18px" }}
              />
              <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                No studios listed yet
              </h2>
              <p
                style={{
                  color: "#a59aaf",
                  fontSize: "13px",
                  margin: "10px 0 23px",
                }}
              >
                Your studio listings will appear here after you publish them.
              </p>
              <Link
                href="/add-studio"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 19px",
                  borderRadius: "10px",
                  background: "#8b5cf6",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <Plus size={16} />
                List Your First Studio
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 310px), 1fr))",
                gap: "20px",
              }}
            >
              {studios.map((studio) => {
                const id = getStudioId(studio);

                return (
                  <article
                    key={id}
                    style={{
                      overflow: "hidden",
                      border: "1px solid #30263c",
                      borderRadius: "17px",
                      background: "#15111c",
                    }}
                  >
                    <div
                      style={{
                        height: "205px",
                        background: "#21172e",
                        overflow: "hidden",
                      }}
                    >
                      {studio.imageUrl ? (
                        <img
                          src={studio.imageUrl}
                          alt={studio.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <Building2 size={40} color="#b48aff" />
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "20px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          background: "#291b3b",
                          color: "#c4a5ff",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        {studio.category}
                      </span>

                      <h2
                        style={{
                          margin: "13px 0 10px",
                          color: "#ffffff",
                          fontSize: "19px",
                          fontWeight: 750,
                        }}
                      >
                        {studio.title}
                      </h2>

                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          color: "#a59aaf",
                          fontSize: "12px",
                          marginBottom: "17px",
                        }}
                      >
                        <MapPin size={14} />
                        {studio.location}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                          padding: "14px 0",
                          borderTop: "1px solid #30263c",
                          borderBottom: "1px solid #30263c",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#e5d8f6",
                            fontSize: "12px",
                          }}
                        >
                          <Clock size={14} color="#b48aff" />
                          ${studio.hourlyRate}/hr
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#e5d8f6",
                            fontSize: "12px",
                          }}
                        >
                          <Users size={14} color="#b48aff" />
                          {studio.maxCapacity} guests
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "17px",
                        }}
                      >
                        <Link
                          href={`/studios/edit/${id}`}
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "7px",
                            padding: "11px",
                            borderRadius: "9px",
                            border: "1px solid #62458a",
                            background: "#291b3b",
                            color: "#d7c3ff",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({ id, title: studio.title })
                          }
                          disabled={deletingId === id}
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "7px",
                            padding: "11px",
                            borderRadius: "9px",
                            border: "1px solid #713c4b",
                            background: "#321923",
                            color: "#ff9eae",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor:
                              deletingId === id ? "not-allowed" : "pointer",
                            opacity: deletingId === id ? 0.6 : 1,
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {deleteTarget && (
        <div
          onClick={() => {
            if (!deletingId) setDeleteTarget(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "grid",
            placeItems: "center",
            padding: "20px",
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(7px)",
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "28px",
              border: "1px solid #49345e",
              borderRadius: "20px",
              background: "#17111f",
              boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "14px",
                  background: "rgba(239, 68, 68, 0.12)",
                  color: "#ff8999",
                }}
              >
                <AlertTriangle size={24} />
              </div>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={Boolean(deletingId)}
                aria-label="Close confirmation dialog"
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "36px",
                  height: "36px",
                  border: "1px solid #40334c",
                  borderRadius: "10px",
                  background: "transparent",
                  color: "#b9adca",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <h2
              id="delete-dialog-title"
              style={{
                margin: "0 0 10px",
                fontSize: "21px",
                fontWeight: 800,
              }}
            >
              Delete this listing?
            </h2>

            <p
              style={{
                margin: "0 0 25px",
                color: "#b9adca",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: "#ffffff" }}>
                {deleteTarget.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={Boolean(deletingId)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #493b57",
                  borderRadius: "10px",
                  background: "#241b2e",
                  color: "#e5d8f6",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Keep Listing
              </button>

              <button
                type="button"
                onClick={() => void handleDelete(deleteTarget.id)}
                disabled={Boolean(deletingId)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #a83f55",
                  borderRadius: "10px",
                  background: "#a8324b",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: deletingId ? "not-allowed" : "pointer",
                  opacity: deletingId ? 0.7 : 1,
                }}
              >
                {deletingId ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
