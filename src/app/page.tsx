import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl?: string;
  image?: string;
  rating?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const slides = [
  {
    eyebrow: "THE SPACE BEHIND THE STORY",
    title: "Make room for\nsomething creative.",
    description:
      "Discover inspiring studios, professional equipment, and spaces built for your next big idea.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=90",
  },
  {
    eyebrow: "YOUR NEXT CREATIVE HOME",
    title: "Find your perfect\ncreative space.",
    description:
      "From photography studios to recording rooms, find the right environment to bring your vision to life.",
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=2200&q=90",
  },
  {
    eyebrow: "CREATE. CONNECT. GROW.",
    title: "Great ideas need\ngreat spaces.",
    description:
      "Share your space with creators, reach new people, and turn your studio into an opportunity.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2200&q=90",
  },
];

const categories = [
  {
    name: "Photo Studios",
    description: "Perfect light. Perfect frame.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    icon: "◉",
    query: "Photo Studios",
  },
  {
    name: "Sound Stages",
    description: "Bring every scene to life.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85",
    icon: "▣",
    query: "Sound Stages",
  },
  {
    name: "Podcast Rooms",
    description: "Give your voice a space.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85",
    icon: "◖",
    query: "Podcast Rooms",
  },
  {
    name: "Music Suites",
    description: "Where sound becomes art.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=85",
    icon: "♫",
    query: "Music Suites",
  },
  {
    name: "Art Workshops",
    description: "Make something extraordinary.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
    icon: "✳",
    query: "Art Workshops",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover spaces",
    description:
      "Explore creative spaces that match your vision, location, and budget.",
    icon: "⌕",
  },
  {
    number: "02",
    title: "Select your hours",
    description:
      "Choose a date and the time that works best for your production.",
    icon: "◷",
  },
  {
    number: "03",
    title: "Book your space",
    description:
      "Send your booking request and manage your reservation in one place.",
    icon: "↗",
  },
  {
    number: "04",
    title: "Create & produce",
    description:
      "Show up, get inspired, and bring your creative vision to life.",
    icon: "✳",
  },
];

const assurances = [
  {
    title: "Verified profiles",
    description:
      "Connect with hosts and creators through transparent profile information.",
    icon: "✓",
  },
  {
    title: "Equipment safety",
    description:
      "Review studio details and amenities before choosing your workspace.",
    icon: "◇",
  },
  {
    title: "Host protection",
    description:
      "Clear booking information helps hosts and creators stay informed.",
    icon: "⌂",
  },
  {
    title: "Creator support",
    description:
      "A platform designed to make discovering and booking spaces easier.",
    icon: "♡",
  },
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ApertureIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="13.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 2.5 5.5 10.1M29.5 16H18M22.7 27.7l-5.4-10.2M2.5 16h11.8M9.3 4.3l5.4 10.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
    </svg>
  );
}

function StudioCard({ studio }: { studio: Studio }) {
  const image = studio.imageUrl || studio.image;

  return (
    <article className="studio-card group">
      <Link
        href={`/studios/${studio._id}`}
        className="studio-card-image"
        aria-label={`View ${studio.title}`}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={studio.title} />
        ) : (
          <div className="studio-image-fallback">
            <ApertureIcon />
          </div>
        )}

        <span className="studio-category">{studio.category}</span>

        <span className="studio-image-arrow">
          <ArrowIcon />
        </span>
      </Link>

      <div className="studio-card-content">
        <div className="studio-location">
          <span>⌖</span>
          {studio.location}
        </div>

        <h3>{studio.title}</h3>

        <div className="studio-card-bottom">
          <p className="studio-price">
            ${studio.hourlyRate}
            <span> / hour</span>
          </p>

          <Link
            href={`/studios/${studio._id}`}
            className="studio-view-link"
          >
            View details <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const response = await fetch(`${API_URL}/api/studios/featured`);

        if (!response.ok) {
          throw new Error("Unable to load studios");
        }

        const data = await response.json();

        const studioList = Array.isArray(data)
          ? data
          : Array.isArray(data.studios)
            ? data.studios
            : Array.isArray(data.data)
              ? data.data
              : [];

        setStudios(studioList.slice(0, 6));
      } catch (error) {
        console.error("Featured studios:", error);
        setStudios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  return (
    <main className="studio-home">
      {/* HERO SLIDER */}
      <section className="hero-section">
        {isMounted ? (
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={900}
            loop
            autoplay={{
              delay: 5500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="hero-swiper"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.eyebrow}>
                <div
                  className="hero-slide"
                  style={{ backgroundImage: `url("${slide.image}")` }}
                >
                  <div className="hero-overlay" />

                  <div className="hero-content page-container">
                    <div className="hero-copy">
                      <span className="eyebrow hero-eyebrow">
                        <span className="eyebrow-dot" />
                        {slide.eyebrow}
                      </span>

                      <h1>{slide.title}</h1>
                      <p>{slide.description}</p>

                      <div className="hero-actions">
                        <Link
                          href="/studios"
                          className="button button-accent"
                        >
                          Explore studios <ArrowIcon />
                        </Link>

                        <Link
                          href="/add-studio"
                          className="hero-secondary-link"
                        >
                          Host your space <span>↗</span>
                        </Link>
                      </div>
                    </div>

                    <div className="hero-slide-number">
                      <span>0{index + 1}</span>
                      <span className="hero-number-line" />
                      <span>03</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="hero-swiper" />
        )}

        <div className="hero-bottom-note">
          <span>MADE FOR THE MAKERS</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="intro-strip">
        <div className="page-container intro-strip-inner">
          <p>
            A space for every <span>creative possibility.</span>
          </p>
          <span className="intro-strip-note">
            DISCOVER · CREATE · SHARE
          </span>
        </div>
      </section>

      {/* FEATURED STUDIOS */}
      <section className="section featured-section" id="studios">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FIND YOUR SPACE</span>
              <h2>
                Spaces worth <span>creating in.</span>
              </h2>
              <p>
                Explore creative workspaces made for ideas that deserve to be
                brought to life.
              </p>
            </div>

            <Link
              href="/studios"
              className="text-link desktop-section-link"
            >
              Explore all studios <ArrowIcon />
            </Link>
          </div>

          {loading ? (
            <div className="studio-grid">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="studio-skeleton" key={index}>
                  <div className="skeleton-image" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              ))}
            </div>
          ) : studios.length > 0 ? (
            <div className="studio-grid">
              {studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          ) : (
            <div className="featured-empty">
              <span className="empty-icon">
                <ApertureIcon />
              </span>
              <h3>Your next creative space starts here.</h3>
              <p>
                No studios have been listed yet. Be one of the first hosts to
                share a creative space.
              </p>
              <Link href="/studios" className="button button-dark">
                Explore studios <ArrowIcon />
              </Link>
            </div>
          )}

          <Link
            href="/studios"
            className="button button-outline mobile-all-link"
          >
            Explore all studios <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE BY CATEGORY</span>
              <h2>
                Find the right space
                <br />
                for <span>your kind of work.</span>
              </h2>
            </div>

            <p className="heading-aside">
              Every creative project is different.
              Find an environment that fits yours.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <Link
                href={`/studios?category=${encodeURIComponent(category.query)}`}
                className={`category-card category-card-${index + 1}`}
                key={category.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={category.image} alt={category.name} />

                <div className="category-shade" />
                <span className="category-icon">{category.icon}</span>

                <div className="category-info">
                  <span>{category.description}</span>
                  <h3>{category.name}</h3>
                </div>

                <span className="category-arrow">
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section process-section" id="how-it-works">
        <div className="page-container">
          <div className="section-heading process-heading">
            <div>
              <span className="eyebrow">SIMPLE BY DESIGN</span>
              <h2>
                From idea to <span>incredible.</span>
              </h2>
              <p>
                Your next production is closer than you think. Four simple
                steps to get started.
              </p>
            </div>

            <span className="process-side-note">
              LESS SEARCHING.
              <br />
              MORE CREATING.
            </span>
          </div>

          <div className="process-grid">
            {steps.map((step) => (
              <article className="process-card" key={step.number}>
                <div className="process-card-top">
                  <span className="process-number">{step.number}</span>
                  <span className="process-icon">{step.icon}</span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="process-card-line" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOST CTA */}
      <section className="host-section" id="about">
        <div className="host-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=90"
            alt="Creative studio workspace"
          />
        </div>

        <div className="host-content">
          <span className="eyebrow">BUILT FOR CREATORS & HOSTS</span>

          <h2>
            Your space could be
            <br />
            someone's <span>next big idea.</span>
          </h2>

          <p>
            Have a studio, workshop, or production space? Put it on the map.
            Connect with creators and make more of the space you already have.
          </p>

          <Link href="/add-studio" className="button button-accent">
            Host your space <ArrowIcon />
          </Link>

          <span className="host-footnote">
            SHARE YOUR SPACE. SUPPORT CREATIVITY.
          </span>
        </div>
      </section>

      {/* TRUST & SUPPORT */}
      <section className="section assurance-section">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A BETTER WAY TO CREATE</span>
              <h2>
                Good spaces. <span>Good people.</span>
              </h2>
              <p>
                A more thoughtful way for studio hosts and creators to connect.
              </p>
            </div>
          </div>

          <div className="assurance-grid">
            {assurances.map((item, index) => (
              <article className="assurance-card" key={item.title}>
                <span className="assurance-icon">{item.icon}</span>
                <span className="assurance-index">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="page-container final-cta-inner">
          <div>
            <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>
              Make something
              <br />
              <span>worth remembering.</span>
            </h2>
          </div>

          <Link href="/studios" className="button button-light">
            Find your studio <ArrowIcon />
          </Link>
        </div>

        <div className="final-cta-decoration">S</div>
      </section>
    </main>
  );
}