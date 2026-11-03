
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ExploreStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Studios");
  const [sort, setSort] = useState("default");

  const fetchStudios = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/studios`);

      if (!response.ok) {
        throw new Error(`Server returned error ${response.status}`);
      }

      const result = await response.json();

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result.studios)
          ? result.studios
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.studios)
              ? result.data.studios
              : [];

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

  useEffect(() => {
    fetchStudios();
  }, []);

  const filteredStudios = useMemo(() => {
    let result = [...studios];

    if (category !== "All Studios") {
      result = result.filter(
        (studio) =>
          studio.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter(
        (studio) =>
          studio.title?.toLowerCase().includes(keyword) ||
          studio.location?.toLowerCase().includes(keyword) ||
          studio.category?.toLowerCase().includes(keyword)
      );
    }

    if (sort === "low-to-high") {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    }

    if (sort === "high-to-low") {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    }

    return result;
  }, [studios, category, search, sort]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f7f4",
        color: "#181916",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* Navigation */}
      <header
        style={{
          height: 76,
          background: "#fff",
          borderBottom: "1px solid #e8e7e1",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 max(24px, calc((100% - 1200px) / 2))",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-1.3px",
          }}
        >
          Studio<span style={{ color: "#81965f" }}>Space.</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link href="/" style={navStyle}>Home</Link>
          <Link href="/studios" style={{ ...navStyle, color: "#81965f" }}>
            Explore Studios
          </Link>
          <Link href="/dashboard" style={navStyle}>Dashboard</Link>
        </nav>
      </header>

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
            Discover inspiring studios and creative spaces for your next project.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 13,
              maxWidth: 620,
              height: 60,
              margin: "35px auto 0",
              padding: "0 20px",
              background: "#fff",
              borderRadius: 7,
              color: "#777970",
            }}
          >
            <Search size={21} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search studios, locations or categories..."
              style={{
                width: "100%",
                height: "100%",
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
                onClick={() => setCategory(item)}
                style={{
                  border: active ? "1px solid #20251e" : "1px solid #e8e7e1",
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

        {/* Loading */}
        {loading && (
          <div style={messageStyle}>
            <LoaderCircle
              size={35}
              color="#81965f"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p>Finding creative spaces...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={messageStyle}>
            <Compass size={38} color="#81965f" />
            <h3 style={{ fontSize: 22 }}>Unable to connect to StudioSpace.</h3>
            <p style={{ color: "#777970", fontSize: 14 }}>{error}</p>
            <button
              type="button"
              onClick={fetchStudios}
              style={actionButtonStyle}
            >
              <RefreshCw size={16} />
              Try again
            </button>
            <p style={{ color: "#777970", fontSize: 12 }}>
              Make sure your backend server is running on port 5000.
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredStudios.length === 0 && (
          <div style={messageStyle}>
            <Compass size={38} color="#81965f" />
            <h3 style={{ fontSize: 22 }}>No studios found.</h3>
            <p style={{ color: "#777970", fontSize: 14 }}>
              Try another search or category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All Studios");
              }}
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
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
                    src={
                      studio.imageUrl ||
                      studio.image ||
                      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900"
                    }
                    alt={studio.title}
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
                        ৳{studio.hourlyRate}
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

      <footer
        style={{
          background: "#191d18",
          color: "#fff",
          padding: "30px 24px",
          textAlign: "center",
          fontSize: 12,
        }}
      >
        © 2026 StudioSpace. All rights reserved.
      </footer>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(goooooo
          360deg); }
        }

        @media (max-width: 600px) {
          header nav {
            gap: 12px !important;
          }
          header nav a {
            font-size: 11px !important;
          }
        }
      `}</style>
    </main>
  );
}

const navStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "#696b63",
};

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
