import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import Slider from "react-slick";
import incidents from "../data/incidents";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function IncidentPage({ incident }) {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState(incident?.media[0]);

  if (!incident) {
    return <h1 style={{ color: 'white', textAlign: 'center', marginTop: '2rem', fontFamily: 'Inter, sans-serif' }}>Incident Not Found</h1>;
  }

  const sliderSettings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <>
      {/* <Head>
        <title>{incident.title}</title>
        <meta name="description" content={incident.description} />
        <meta property="og:title" content={incident.title} />
        <meta property="og:description" content={incident.description} />
        <meta property="og:image" content={incident.media[0]} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`
            .slick-dots {
              bottom: -35px;
            }
            .slick-dots li button:before {
              color: white;
              opacity: 0.5;
              font-size: 8px;
            }
            .slick-dots li.slick-active button:before {
              color: white;
              opacity: 1;
            }
          `}
        </style>
      </Head> */}

      <Head>
        <title>{incident.title}</title>
        <meta name="description" content={incident.description} />

        <meta property="og:title" content={incident.title} />
        <meta property="og:description" content={incident.description} />
        {incident.media.some((item) => item.endsWith(".mp4")) ? (
          <>
            <meta property="og:video" content={incident.media.find((item) => item.endsWith(".mp4"))} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
          </>
        ) : (
          <meta property="og:image" content={incident.media[0]} />
        )}

        <meta name="twitter:card" content={incident.media.some((item) => item.endsWith(".mp4")) ? "player" : "summary_large_image"} />
        <meta name="twitter:title" content={incident.title} />
        <meta name="twitter:description" content={incident.description} />
        {incident.media.some((item) => item.endsWith(".mp4")) ? (
          <>
            <meta name="twitter:player" content={incident.media.find((item) => item.endsWith(".mp4"))} />
            <meta name="twitter:player:width" content="1280" />
            <meta name="twitter:player:height" content="720" />
          </>
        ) : (
          <meta name="twitter:image" content={incident.media[0]} />
        )}

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`
      .slick-dots {
        bottom: -35px;
      }
      .slick-dots li button:before {
        color: white;
        opacity: 0.5;
        font-size: 8px;
      }
      .slick-dots li.slick-active button:before {
        color: white;
        opacity: 1;
      }
    `}
        </style>
      </Head>


      <div style={styles.pageContainer}>
        <div style={styles.contentWrapper}>
          <div style={styles.sliderContainer}>
            <Slider {...sliderSettings}>
              {incident.media.map((item, index) => (
                <div key={index} style={styles.mediaItem}>
                  {item.endsWith(".mp4") ? (
                    <div style={styles.mediaWrapper}>
                      <video style={styles.video} controls>
                        <source src={item} type="video/mp4" />
                      </video>
                    </div>
                  ) : (
                    <div style={styles.mediaWrapper}>
                      <Image
                        src={item}
                        alt={incident.title}
                        width={400}
                        height={300}
                        style={styles.image}
                        objectFit="cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          </div>

          <div style={styles.detailsContainer}>
            <div style={styles.metaInfo}>
              <span style={styles.metaItem}>{incident.distance} km</span>
              <span style={styles.metaDot}>•</span>
              <span style={styles.metaItem}>{incident.date}</span>
              <span style={styles.metaDot}>•</span>
              <span style={styles.metaItem}>{incident.time} ago</span>
              <span style={styles.metaDot}>|</span>
              <span style={styles.notifiedCount}>{incident.notified} Notified</span>
            </div>
            <h1 style={styles.title}>{incident.title}</h1>
            <p style={styles.description}>{incident.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Server-side props
export async function getServerSideProps(context) {
  const { id } = context.params;
  const incident = incidents.find((item) => item.id === id) || null;
  return {
    props: { incident },
  };
}

// Enhanced styles
const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #000000, #1a1a1a)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem 1rem",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sliderContainer: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    padding: "2rem 2rem 4rem 2rem",
    marginBottom: "2rem",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    backdropFilter: "blur(4px)",
  },
  mediaItem: {
    padding: "0 10px",
  },
  mediaWrapper: {
    position: "relative",
    width: "100%",
    height: "300px",
    borderRadius: "12px",
    overflow: "hidden",
    // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
    // backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    backgroundColor: "#000",
  },
  detailsContainer: {
    marginTop: "2rem",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    backdropFilter: "blur(4px)",
  },
  metaInfo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "12px",
  },
  metaItem: {
    color: "#e2e8f0",
    fontSize: "0.95rem",
    fontFamily: "Inter, sans-serif",
    fontWeight: "500",
  },
  metaDot: {
    color: "#4a5568",
    margin: "0 0.5rem",
  },
  notifiedCount: {
    color: "#48bb78",
    fontSize: "0.95rem",
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    fontFamily: "Inter, sans-serif",
    color: "#ffffff",
    letterSpacing: "-0.5px",
  },
  description: {
    color: "#e2e8f0",
    fontSize: "1.1rem",
    lineHeight: "1.7",
    fontFamily: "Inter, sans-serif",
    fontWeight: "400",
    maxWidth: "800px",
    margin: "0 auto",
  },
};

