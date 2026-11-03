
"use client";

import { Suspense, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
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
  LoaderCircle,
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

type StudioFormData = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  overview: string;
};

type Studio = {
  _id?: string;
  id?: string;
  title?: string;
  category?: string;
  hourlyRate?: number | string;
  securityDeposit?: number | string;
  maxCapacity?: number | string;
  location?: string;
  imageUrl?: string;
  overview?: string;
  details?: string;
  description?: string;
  amenities?: string[];
  ownerEmail?: string;
  hostEmail?: string;
};

const initialFormData: StudioFormData = {
  title: "",
  category: "Photo Studios",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  imageUrl: "",
  overview: "",
};

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

function extractStudio(data: unknown): Studio | null {
  if (!data || typeof data !== "object") return null;

  const result = data as Record<string, unknown>;

  if (result._id || result.id) {
    return result as Studio;
  }

  if (result.studio && typeof result.studio === "object") {
    return result.studio as Studio;
  }

  if (result.data && typeof result.data === "object") {
    const nested = result.data as Record<string, unknown>;

    if (nested._id || nested.id) {
      return nested as Studio;
    }

    if (nested.studio && typeof nested.studio === "object") {
      return nested.studio as Studio;
    }
  }

  return null;
}

function EditStudioContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { data: session, isPending } = authClient.useSession();

  const hostName = session?.user.name ?? "";
  const hostEmail = session?.user.email ?? "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [formData, setFormData] =
    useState<StudioFormData>(initialFormData);

  useEffect(() => {
    const studioId = params.id;

    if (!studioId) {
      toast.error("Invalid studio ID.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchStudio = async () => {
      setLoading(true);

      try {
        const response: unknown = await api(
          `/api/studios/${encodeURIComponent(studioId)}`
        );

        const studio = extractStudio(response);

        if (!studio) {
          throw new Error("Unable to read studio information.");
        }

        if (cancelled) return;

        setFormData({
          title: studio.title ?? "",
          category: studio.category ?? "Photo Studios",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          maxCapacity: String(studio.maxCapacity ?? ""),
          location: studio.location ?? "",
          imageUrl: studio.imageUrl ?? "",
          overview:
            studio.overview ??
            studio.details ??
            studio.description ??
            "",
        });

        setAmenities(
          Array.isArray(studio.amenities)
            ? studio.amenities.filter(
                (item): item is string => typeof item === "string"
              )
            : []
        );
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load studio information."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchStudio();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const handleChange = (
    event: ChangeEvent<
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
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!session) {
      toast.error("Please log in before editing your studio.");
      router.push("/login");
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.overview.trim() ||
      !formData.imageUrl.trim()
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    const hourlyRate = Number(formData.hourlyRate);
    const securityDeposit = Number(formData.securityDeposit);
    const maxCapacity = Number(formData.maxCapacity);

    if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
      toast.error("Please enter a valid hourly rate.");
      return;
    }

    if (!Number.isFinite(securityDeposit) || securityDeposit < 0) {
      toast.error("Please enter a valid security deposit.");
      return;
    }

    if (!Number.isInteger(maxCapacity) || maxCapacity < 1) {
      toast.error("Please enter a valid maximum capacity.");
      return;
    }

    setSaving(true);

    try {
      await api(`/api/studios/${encodeURIComponent(params.id)}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          location: formData.location.trim(),
          overview: formData.overview.trim(),
          imageUrl: formData.imageUrl.trim(),
          hourlyRate,
          securityDeposit,
          maxCapacity,
          amenities,
        }),
      });

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update studio."
      );
    } finally {
      setSaving(false);
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

  if (loading || isPending) {
    return (
      <main style={centerStyle}>
        <LoaderCircle
          size={35}
          color="#b48aff"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p style={{ color: "#b9adca", marginTop: 15 }}>
          Loading studio information...
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

  if (!session) {
    return (
      <main style={centerStyle}>
        <ShieldCheck size={42} color="#b48aff" />
        <h1 style={{ fontSize: 24, margin: "15px 0 8px" }}>
          Login required
        </h1>
        <p style={{ color: "#a59aaf", marginBottom: 22 }}>
          Please log in to manage your studio listing.
        </p>
        <Link href="/login" style={buttonStyle}>
          Go to login
        </Link>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/my-listings" style={backStyle}>
          <ArrowLeft size={16} />
          Back to my listings
        </Link>

        <div style={{ marginBottom: "34px" }}>
          <div style={badgeStyle}>
            <Sparkles size={13} />
            STUDIO SPACE HOST
          </div>

          <h1 style={headingStyle}>
            Make your space{" "}
            <span style={{ color: "#b48aff" }}>even better.</span>
          </h1>

          <p style={introStyle}>
            Update your studio information, pricing and amenities.
            Keep your listing accurate so creators can find the
            perfect space for their next project.
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
          <section style={sectionStyle}>
            {sectionHeading(
              <Building2 size={20} />,
              "Basic information",
              "Update the details creators see about your studio."
            )}

            <div style={columnStyle}>
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
                      style={{
                        backgroundColor: "#15111c",
                        color: "#ffffff",
                      }}
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

              <div style={hostCardStyle}>
                <div style={hostHeadingStyle}>
                  <ShieldCheck size={16} />
                  HOST INFORMATION
                </div>

                <div style={hostGridStyle}>
                  <div>
                    <label htmlFor="hostName" style={labelStyle}>
                      Host name
                    </label>
                    <input
                      id="hostName"
                      value={hostName}
                      readOnly
                      style={readOnlyInputStyle}
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
                      style={readOnlyInputStyle}
                    />
                  </div>
                </div>

                <p style={hostNoteStyle}>
                  Your account information is associated with this listing.
                </p>
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            {sectionHeading(
              <Wallet size={20} />,
              "Pricing and capacity",
              "Manage your studio rental rate and visitor limit."
            )}

            <div style={responsiveGridStyle}>
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

          <section style={sectionStyle}>
            {sectionHeading(
              <MapPin size={20} />,
              "Location and images",
              "Keep your studio location and image up to date."
            )}

            <div style={columnStyle}>
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

                <p style={helperTextStyle}>
                  Use a direct image URL that displays your actual studio.
                </p>

                {formData.imageUrl && (
                  <div style={previewStyle}>
                    <img
                      src={formData.imageUrl}
                      alt="Studio preview"
                      style={{
                        width: "100%",
                        maxHeight: 240,
                        objectFit: "cover",
                        borderRadius: 10,
                      }}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            {sectionHeading(
              <Check size={20} />,
              "Studio amenities",
              "Select the facilities currently available to your guests."
            )}

            <div style={amenitiesGridStyle}>
              {availableAmenities.map((amenity) => {
                const selected = amenities.includes(amenity);

                return (
                  <label
                    key={amenity}
                    style={{
                      ...amenityLabelStyle,
                      border: selected
                        ? "1px solid #9264d6"
                        : "1px solid #382e49",
                      backgroundColor: selected
                        ? "#291b3b"
                        : "#100c18",
                      color: selected ? "#e1d0ff" : "#b8adbf",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAmenity(amenity)}
                      style={{
                        width: 16,
                        height: 16,
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

            <p style={amenityCountStyle}>
              {amenities.length} of {availableAmenities.length} amenities
              selected
            </p>
          </section>

          <section style={publishStyle}>
            <div>
              <h3 style={publishTitleStyle}>
                Ready to save your changes?
              </h3>
              <p style={publishDescriptionStyle}>
                Your updated information will replace the current listing details.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...publishButtonStyle,
                opacity: saving ? 0.65 : 1,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? (
                <>
                  <LoaderCircle
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Saving changes...
                </>
              ) : (
                <>
                  Save changes
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </section>
        </form>

        <p style={footerStyle}>
          <ImageIcon
            size={12}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: 5,
            }}
          />
          StudioSpace · Helping creative spaces get discovered.
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .edit-studio-section {
            padding: 20px !important;
          }
        }
      `}</style>
    </main>
  );
}

export default function EditStudioPage() {
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
            Loading edit page...
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
      <EditStudioContent />
    </Suspense>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "40px 18px 80px",
  background:
    "radial-gradient(ellipse at top left, #251637 0%, transparent 38%), #09070d",
  color: "#ffffff",
};

const centerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: "#09070d",
  color: "#ffffff",
  textAlign: "center",
};

const buttonStyle: React.CSSProperties = {
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

const backStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 32,
  color: "#b9a9ca",
  fontSize: 13,
  textDecoration: "none",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 17,
  padding: "8px 12px",
  border: "1px solid #49345e",
  borderRadius: 30,
  backgroundColor: "#21172e",
  color: "#c5a5ff",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1,
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: "clamp(30px, 5vw, 44px)",
  fontWeight: 800,
  letterSpacing: "-1.5px",
  lineHeight: 1.15,
};

const introStyle: React.CSSProperties = {
  maxWidth: 570,
  marginTop: 14,
  color: "#a59aaf",
  fontSize: 14,
  lineHeight: 1.8,
};

const columnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const responsiveGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 17,
};

const hostCardStyle: React.CSSProperties = {
  padding: 17,
  border: "1px solid #3a3047",
  borderRadius: 12,
  backgroundColor: "#100c18",
};

const hostHeadingStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 15,
  color: "#c4a5ff",
  fontSize: 12,
  fontWeight: 700,
};

const hostGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 15,
};

const readOnlyInputStyle: React.CSSProperties = {
  ...inputStyle,
  backgroundColor: "#1a1522",
  color: "#a99bb7",
};

const hostNoteStyle: React.CSSProperties = {
  marginTop: 12,
  color: "#81758e",
  fontSize: 11,
};

const helperTextStyle: React.CSSProperties = {
  marginTop: 8,
  color: "#81758e",
  fontSize: 11,
};

const previewStyle: React.CSSProperties = {
  marginTop: 15,
  overflow: "hidden",
  borderRadius: 10,
  border: "1px solid #382e49",
};

const amenitiesGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 10,
};

const amenityLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 11,
  padding: 13,
  borderRadius: 11,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const amenityCountStyle: React.CSSProperties = {
  marginTop: 16,
  color: "#91869e",
  fontSize: 12,
};

const publishStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 18,
  padding: "23px 26px",
  border: "1px solid #49345e",
  borderRadius: 18,
  background: "linear-gradient(120deg, #21172e 0%, #171020 100%)",
};

const publishTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: 15,
  fontWeight: 700,
};

const publishDescriptionStyle: React.CSSProperties = {
  marginTop: 6,
  color: "#a99bb7",
  fontSize: 12,
  lineHeight: 1.6,
};

const publishButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "14px 22px",
  border: "1px solid #b99aff",
  borderRadius: 11,
  background: "linear-gradient(135deg, #9565e8, #713bc2)",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 700,
};

const footerStyle: React.CSSProperties = {
  marginTop: 25,
  textAlign: "center",
  color: "#71677c",
  fontSize: 11,
};
