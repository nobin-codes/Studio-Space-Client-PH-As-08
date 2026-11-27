
"use client";

import "./explore.css";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  ArrowUpRight,
  SlidersHorizontal,
  Compass,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl?: string;
  image?: string;
  details?: string;
};

const categories = [
  "All Studios",
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900";

function normalizeCategory(value: string) {
  const normalized = value.trim().toLowerCase();

  // Keep older listings compatible with the current category name.
  if (normalized === "film stages") {
    return "sound stages";
  }

  return normalized;
}

function getStudiosFromResponse(result: unknown): Studio[] {
  if (Array.isArray(result)) {
    return result as Studio[];
  }

  if (!result || typeof result !== "object") {
    return [];
  }

  const data = result as {
    studios?: unknown;
    data?: unknown;
  };

  if (Array.isArray(data.studios)) {
    return data.studios as Studio[];
  }

  if (Array.isArray(data.data)) {
    return data.data as Studio[];
  }

  if (data.data && typeof data.data === "object") {
    const nestedData = data.data as { studios?: unknown };

    if (Array.isArray(nestedData.studios)) {
      return nestedData.studios as Studio[];
    }
  }

  return [];
}

function ExploreStudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const categoryParam = searchParams.get("category");
  const category = useMemo(() => {
    if (!categoryParam) return "All Studios";
    const matchedCategory = categories.find(
      (item) =>
        item !== "All Studios" &&
        normalizeCategory(item) === normalizeCategory(categoryParam)
    );
    return matchedCategory || "All Studios";
  }, [categoryParam]);

  // Load studios on mount
  useEffect(() => {
    const controller = new AbortController();

    const fetchAllStudios = async () => {
      try {
        const response = await fetch(`${API_URL}/api/studios`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load studios. Server returned ${response.status}.`
          );
        }

        const result: unknown = await response.json();
        const list = getStudiosFromResponse(result);

        setStudios(list);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to the StudioSpace server."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchAllStudios();

    return () => {
      controller.abort();
    };
  }, []);

  const handleRetry = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/studios`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load studios. Server returned ${response.status}.`
        );
      }

      const result: unknown = await response.json();
      const list = getStudiosFromResponse(result);

      setStudios(list);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the StudioSpace server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (selectedCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory === "All Studios") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/studios?${queryString}` : "/studios";

    router.replace(newUrl, { scroll: false });
  };

  const filteredStudios = useMemo(() => {
    let result = [...studios];

    if (category !== "All Studios") {
      result = result.filter(
        (studio) =>
          normalizeCategory(studio.category || "") ===
          normalizeCategory(category)
      );
    }

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();

      result = result.filter(
        (studio) =>
          studio.title?.toLowerCase().includes(keyword) ||
          studio.location?.toLowerCase().includes(keyword) ||
          studio.category?.toLowerCase().includes(keyword)
      );
    }

    if (sort === "low-to-high") {
      result.sort(
        (a, b) => Number(a.hourlyRate) - Number(b.hourlyRate)
      );
    }

    if (sort === "high-to-low") {
      result.sort(
        (a, b) => Number(b.hourlyRate) - Number(a.hourlyRate)
      );
    }

    return result;
  }, [studios, category, search, sort]);

  const clearFilters = () => {
    setSearch("");
    setSort("default");
    handleCategoryChange("All Studios");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f7f4",
        color: "#181916",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* Hero */}
      <section
        style={{
          background: "#20251e",
          color: "#fff",
          padding: "90px 24px 85px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <span
            style={{
              color: "#d9fa70",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            FIND YOUR CREATIVE SPACE
          </span>

          <h1
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(42px, 7vw, 76px)",
              lineHeight: 1.1,
              letterSpacing: -3,
              margin: "22px 0",
              fontWeight: 800,
            }}
          >
            Find the space.
            <br />
            <span style={{ color: "#d9fa70" }}>
              Make something great.
            </span>
          </h1>

          <p
            style={{
              color: "#c0c4b9",
              fontSize: 15,
              lineHeight: 1.8,
              margin: "0 auto",
            }}
          >
            Discover inspiring studios and creative spaces for your next
            project.
          </p>

          <div
            className="studio-search"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              maxWidth: 620,
              minHeight: 60,
              margin: "35px auto 0",
              padding: "0 20px",
              background: "#fff",
              borderRadius: 7,
              color: "#777970",
            }}
          >
            <Search size={21} />

            <input
              type="search"
              aria-label="Search studios"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search studios, locations or categories..."
              style={{
                width: "100%",
                height: 58,
                border: 0,
                outline: 0,
                background: "transparent",
                color: "#181916",
                fontSize: 14,
              }}
            />
          </div>
        </div>
      </section>

      {/* Studio Listing */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "75px 24px 110px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 35,
          }}
        >
          <div>
            <span style={eyebrowStyle}>EXPLORE SPACES</span>

            <h2
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "clamp(28px, 4vw, 40px)",
                letterSpacing: -1.5,
                margin: "12px 0 8px",
              }}
            >
              Studios worth creating in.
            </h2>

            <p style={{ color: "#777970", fontSize: 14 }}>
              Find the right environment for your next big idea.
            </p>
          </div>

          <div
            className="studio-sort"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid #e8e7e1",
              background: "#fff",
              padding: "0 13px",
              borderRadius: 6,
            }}
          >
            <SlidersHorizontal size={16} color="#777970" />

            <select
              aria-label="Sort studios"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              style={{
                border: 0,
                outline: 0,
                background: "transparent",
                padding: "13px 0",
                color: "#181916",
                fontSize: 13,
              }}
            >
              <option value="default">Recommended</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            borderBottom: "1px solid #e8e7e1",
            paddingBottom: 28,
          }}
        >
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => handleCategoryChange(item)}
                style={{
                  border: active
                    ? "1px solid #20251e"
                    : "1px solid #e8e7e1",
                  background: active ? "#20251e" : "#fff",
                  color: active ? "#fff" : "#55574f",
                  borderRadius: 30,
                  padding: "11px 18px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>

        {!loading && !error && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "27px 0 22px",
              color: "#777970",
              fontSize: 13,
            }}
          >
            <span>
              <strong style={{ color: "#181916" }}>
                {filteredStudios.length}
              </strong>{" "}
              studios found
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={messageStyle} role="status">
            <LoaderCircle
              size={35}
              color="#81965f"
              style={{ animation: "studioSpaceSpin 1s linear infinite" }}
            />

            <p>Finding creative spaces...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={messageStyle} role="alert">
            <Compass size={38} color="#81965f" />

            <h3 style={{ fontSize: 22 }}>
              Unable to connect to StudioSpace.
            </h3>

            <p style={{ color: "#777970", fontSize: 14 }}>
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              style={actionButtonStyle}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredStudios.length === 0 && (
          <div style={messageStyle}>
            <Compass size={38} color="#81965f" />

            <h3 style={{ fontSize: 22 }}>
              No studios found.
            </h3>

            <p style={{ color: "#777970", fontSize: 14 }}>
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              style={actionButtonStyle}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Studio Cards */}
        {!loading && !error && filteredStudios.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
              gap: 25,
            }}
          >
            {filteredStudios.map((studio) => (
              <Link
                key={studio._id}
                href={`/studios/${studio._id}`}
                style={{
                  display: "block",
                  background: "#fff",
                  border: "1px solid #e8e7e1",
                  overflow: "hidden",
                  color: "#181916",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    height: 235,
                    position: "relative",
                    background: "#e9e9e3",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={studio.imageUrl || studio.image || DEFAULT_IMAGE}
                    alt={studio.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      background: "#d9fa70",
                      padding: "8px 12px",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {studio.category}
                  </span>
                </div>

                <div style={{ padding: 21 }}>
                  <h3
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: 19,
                      margin: "0 0 13px",
                    }}
                  >
                    {studio.title}
                  </h3>

                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      color: "#777970",
                      fontSize: 12,
                    }}
                  >
                    <MapPin size={15} />
                    {studio.location}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: "1px solid #e8e7e1",
                      paddingTop: 17,
                      marginTop: 18,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 12 }}>
                      <strong style={{ fontSize: 19 }}>
                        ৳{Number(studio.hourlyRate).toLocaleString("en-BD")}
                      </strong>

                      <span style={{ color: "#777970" }}> / hour</span>
                    </p>

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      View studio <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes studioSpaceSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .studio-search:focus-within,
        .studio-sort:focus-within {
          outline: 2px solid #81965f;
          outline-offset: 2px;
        }
      `}</style>
    </main>
  );
}

export default function ExploreStudiosPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#f8f7f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={messageStyle}>
            <LoaderCircle
              size={35}
              color="#81965f"
              className="animate-spin"
            />
            <p>Loading studios...</p>
          </div>
        </main>
      }
    >
      <ExploreStudiosContent />
    </Suspense>
  );
}

const eyebrowStyle = {
  color: "#81965f",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 2,
};

const messageStyle = {
  minHeight: 260,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  gap: 13,
  textAlign: "center" as const,
};

const actionButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  border: 0,
  borderRadius: 6,
  background: "#20251e",
  color: "#fff",
  padding: "13px 22px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};
