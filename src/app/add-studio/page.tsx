
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Image as ImageIcon,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

const categories = [
  "Photo Studios",
  "Film Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

const availableAmenities = [
  "Professional Lighting",
  "Camera Equipment",
  "Soundproofing",
  "Air Conditioning",
  "Wi-Fi",
  "Makeup Room",
  "Changing Room",
  "Parking",
  "Restroom",
  "Waiting Area",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 15px",
  border: "1px solid #382e49",
  borderRadius: "11px",
  backgroundColor: "#100c18",
  color: "#ffffff",
  fontSize: "14px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "9px",
  color: "#e7e0ef",
  fontSize: "13px",
  fontWeight: 600,
};

const sectionStyle: React.CSSProperties = {
  padding: "28px",
  border: "1px solid #30263c",
  borderRadius: "18px",
  backgroundColor: "#15111c",
};

export default function AddStudioPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const hostName = session?.user.name ?? "";
  const hostEmail = session?.user.email ?? "";

  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Photo Studios",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    imageUrl: "",
    overview: "",
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity]
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!session) {
      toast.error("Please log in before listing your studio.");
      router.push("/login");
      return;
    }

    if (!formData.title.trim() || !formData.location.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      await api("/api/studios", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          hourlyRate: Number(formData.hourlyRate),
          securityDeposit: Number(formData.securityDeposit),
          maxCapacity: Number(formData.maxCapacity),
          amenities,
        }),
      });

      toast.success("Your studio has been listed successfully!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create studio."
      );
    } finally {
      setLoading(false);
    }
  };

  const sectionHeading = (
    icon: React.ReactNode,
    title: string,
    description: string
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        marginBottom: "25px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          backgroundColor: "#2b1e3d",
          color: "#c4a5ff",
        }}
      >
        {icon}
      </div>

      <div>
        <h2
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "17px",
            fontWeight: 700,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            marginTop: "5px",
            color: "#91869e",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 18px 80px",
        background:
          "radial-gradient(ellipse at top left, #251637 0%, transparent 38%), #09070d",
        color: "#ffffff",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
            color: "#b9a9ca",
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div style={{ marginBottom: "34px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "17px",
              padding: "8px 12px",
              border: "1px solid #49345e",
              borderRadius: "30px",
              backgroundColor: "#21172e",
              color: "#c5a5ff",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            <Sparkles size={13} />
            STUDIO SPACE HOST
          </div>

          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "clamp(30px, 5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.15,
            }}
          >
            Give your space a place{" "}
            <span style={{ color: "#b48aff" }}>to shine.</span>
          </h1>

          <p
            style={{
              maxWidth: "570px",
              marginTop: "14px",
              color: "#a59aaf",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            Share your creative space with the community. Add your studio
            details and help creators find the perfect place for their next
            project.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Basic information */}
          <section style={sectionStyle}>
            {sectionHeading(
              <Building2 size={20} />,
              "Basic information",
              "Tell creators what makes your studio special."
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label htmlFor="title" style={labelStyle}>
                  Studio name *
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. The Creative Loft"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="category" style={labelStyle}>
                  Studio category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      style={{ backgroundColor: "#15111c", color: "#ffffff" }}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="overview" style={labelStyle}>
                  Studio overview *
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  placeholder="Describe your studio, its atmosphere and what makes it special..."
                  required
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.7,
                  }}
                />
              </div>

              <div
                style={{
                  padding: "17px",
                  border: "1px solid #3a3047",
                  borderRadius: "12px",
                  backgroundColor: "#100c18",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "15px",
                    color: "#c4a5ff",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  <ShieldCheck size={16} />
                  HOST INFORMATION
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <div>
                    <label htmlFor="hostName" style={labelStyle}>
                      Host name
                    </label>
                    <input
                      id="hostName"
                      value={hostName}
                      readOnly
                      placeholder="Loading..."
                      style={{
                        ...inputStyle,
                        backgroundColor: "#1a1522",
                        color: "#a99bb7",
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="hostEmail" style={labelStyle}>
                      Host email
                    </label>
                    <input
                      id="hostEmail"
                      value={hostEmail}
                      readOnly
                      placeholder="Loading..."
                      style={{
                        ...inputStyle,
                        backgroundColor: "#1a1522",
                        color: "#a99bb7",
                      }}
                    />
                  </div>
                </div>

                <p
                  style={{
                    marginTop: "12px",
                    color: "#81758e",
                    fontSize: "11px",
                  }}
                >
                  Your account information is automatically added to your
                  listing.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section style={sectionStyle}>
            {sectionHeading(
              <Wallet size={20} />,
              "Pricing and capacity",
              "Set your studio's rental rate and visitor limit."
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "17px",
              }}
            >
              <div>
                <label htmlFor="hourlyRate" style={labelStyle}>
                  Hourly rate ($) *
                </label>
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min="1"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required
                  placeholder="50"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="securityDeposit" style={labelStyle}>
                  Security deposit ($) *
                </label>
                <input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  min="0"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  required
                  placeholder="100"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="maxCapacity" style={labelStyle}>
                  Max capacity *
                </label>
                <input
                  id="maxCapacity"
                  name="maxCapacity"
                  type="number"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  required
                  placeholder="10"
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* Location and image */}
          <section style={sectionStyle}>
            {sectionHeading(
              <MapPin size={20} />,
              "Location and images",
              "Help creators find your space and see what it looks like."
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label htmlFor="location" style={labelStyle}>
                  Full location / address *
                </label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="City, area and full address"
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="imageUrl" style={labelStyle}>
                  Studio image URL *
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com/studio-image.jpg"
                  style={inputStyle}
                />
                <p
                  style={{
                    marginTop: "8px",
                    color: "#81758e",
                    fontSize: "11px",
                  }}
                >
                  Use a direct image URL that displays your actual studio.
                </p>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section style={sectionStyle}>
            {sectionHeading(
              <Check size={20} />,
              "Studio amenities",
              "Select the facilities available to your guests."
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "10px",
              }}
            >
              {availableAmenities.map((amenity) => {
                const selected = amenities.includes(amenity);

                return (
                  <label
                    key={amenity}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "11px",
                      padding: "13px",
                      border: selected
                        ? "1px solid #9264d6"
                        : "1px solid #382e49",
                      borderRadius: "11px",
                      backgroundColor: selected ? "#291b3b" : "#100c18",
                      color: selected ? "#e1d0ff" : "#b8adbf",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAmenity(amenity)}
                      style={{
                        width: "16px",
                        height: "16px",
                        accentColor: "#a78bfa",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    />
                    {amenity}
                  </label>
                );
              })}
            </div>

            <p
              style={{
                marginTop: "16px",
                color: "#91869e",
                fontSize: "12px",
              }}
            >
              {amenities.length} of {availableAmenities.length} amenities
              selected
            </p>
          </section>

          {/* Publish */}
          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "18px",
              padding: "23px 26px",
              border: "1px solid #49345e",
              borderRadius: "18px",
              background:
                "linear-gradient(120deg, #21172e 0%, #171020 100%)",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                Ready to share your space?
              </h3>
              <p
                style={{
                  marginTop: "6px",
                  color: "#a99bb7",
                  fontSize: "12px",
                }}
              >
                Review your details before publishing.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || isPending || !session}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 22px",
                border: "1px solid #b99aff",
                borderRadius: "11px",
                background: loading
                  ? "#59427e"
                  : "linear-gradient(135deg, #9565e8, #713bc2)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor:
                  loading || isPending || !session
                    ? "not-allowed"
                    : "pointer",
                opacity: loading || isPending || !session ? 0.6 : 1,
              }}
            >
              {loading
                ? "Publishing..."
                : isPending
                  ? "Checking account..."
                  : "Publish studio"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </section>
        </form>

        <p
          style={{
            marginTop: "25px",
            textAlign: "center",
            color: "#71677c",
            fontSize: "11px",
          }}
        >
          <ImageIcon
            size={12}
            style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }}
          />
          StudioSpace · Helping creative spaces get discovered.
        </p>
      </div>
    </main>
  );
}
