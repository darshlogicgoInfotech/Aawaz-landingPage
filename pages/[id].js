import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import Slider from "react-slick";
import incidents from "../data/incidents";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

export default function IncidentPage({ incident: initialIncident }) {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [incident, setIncident] = useState(initialIncident);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchIncidentData = async () => {
      if (!router.query.id) return;

      try {
        setLoading(true);
        setError(false);
        setIncident(null);

        // Get data from static incidents array
        const staticIncident = incidents[0]; // Using first incident as example
        
        if (!staticIncident || !staticIncident.body) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = staticIncident.body;

        // Format the data to match our structure
        const formattedData = {
          id: data._id,
          title: data.title,
          description: data.description,
          date: new Date(data.eventTime).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short'
          }),
          time: getTimeAgo(new Date(data.eventTime)),
          notified: data.notifiedUserCount,
          media: data.attachments.map(attachment => attachment.attachment)
        };

        setIncident(formattedData);
        setSelectedMedia(formattedData.media[0]);
        setError(false);
      } catch (error) {
        console.error('Error:', error);
        setError(true);
        setIncident(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentData();
  }, [router.query.id]);

  // Function to get time ago
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + "y ago";
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + "mo ago";
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + "d ago";
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + "h ago";
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldShowSlider = (screenWidth, mediaLength) => {
    if (screenWidth > 1024) return mediaLength > 3;
    if (screenWidth > 600) return mediaLength > 2;
    return mediaLength > 1;
  };

  const getGridColumns = (mediaLength) => {
    if (windowWidth > 1024) return Math.min(mediaLength, 3);
    if (windowWidth > 600) return Math.min(mediaLength, 2);
    return 1;
  };

  if (error || !incident) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000, #1a1a1a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        color: "white",
        fontFamily: "Inter, sans-serif"
      }}>
        <h1 style={{
          fontSize: "1.5rem",
          textAlign: "center"
        }}>News Not Found!!!</h1>
      </div>
    );
  }

  const sliderSettings = {
    infinite: true,
    slidesToShow: windowWidth > 1024 ? 3 : windowWidth > 600 ? 2 : 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false,
  };

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>",incident)
  console.log("111111111111111",incident.media.find(item => item.endsWith('.mp4')))
  console.log("222222222222222",incident?.media?.some(item => item.endsWith('.mp4')))


  return (
    <>
      <Head>
        <title>{incident?.title || 'News Details'}</title>
        <meta name="description" content={incident?.description} />
        
        {/* Essential Open Graph tags */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://news.awaazeye.com//${router.query.id}`} />
        <meta property="og:title" content={incident?.title} />
        <meta property="og:description" content={incident?.description} />
        <meta property="og:site_name" content="Aawaz News" />

        {/* Handle media content */}
        {incident?.media?.some(item => item.endsWith('.mp4')) ? (
          <>
            <meta property="og:video" content={incident.media.find(item => item.endsWith('.mp4'))} />
            <meta property="og:video:url" content={incident.media.find(item => item.endsWith('.mp4'))} />
            <meta property="og:video:secure_url" content={incident.media.find(item => item.endsWith('.mp4'))} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
          </>
        ) : incident?.media?.length > 0 ? (
          <>
            <meta property="og:image" content={incident.media[0]} />
            <meta property="og:image:secure_url" content={incident.media[0]} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={incident?.title} />
          </>
        ) : null}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content={incident?.media?.some(item => item.endsWith('.mp4')) ? "player" : "summary_large_image"} />
        <meta name="twitter:site" content="@AawazNews" />
        <meta name="twitter:title" content={incident?.title} />
        <meta name="twitter:description" content={incident?.description} />
        
        {incident?.media?.some(item => item.endsWith('.mp4')) ? (
          <>
            <meta name="twitter:player" content={incident.media.find(item => item.endsWith('.mp4'))} />
            <meta name="twitter:player:width" content="1280" />
            <meta name="twitter:player:height" content="720" />
            <meta name="twitter:player:stream" content={incident.media.find(item => item.endsWith('.mp4'))} />
            <meta name="twitter:player:stream:content_type" content="video/mp4" />
          </>
        ) : incident?.media?.length > 0 ? (
          <>
            <meta name="twitter:image" content={incident.media[0]} />
            <meta name="twitter:image:alt" content={incident?.title} />
          </>
        ) : null}

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`
            .slick-dots {
              bottom: -35px;
            }
            .slick-dots li {
              margin: 0 4px;
            }
            .slick-dots li button {
              width: 12px;
              height: 12px;
            }
            .slick-dots li button:before {
              color: white !important;
              opacity: 0.4;
              font-size: 10px;
              line-height: 12px;
              width: 12px;
              height: 12px;
            }
            .slick-dots li.slick-active button:before {
              color: white !important;
              opacity: 1;
            }
            .media-slide {
              padding: 0 10px;
              height: 250px;
            }
            .slick-track {
              display: flex !important;
              align-items: center !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            .slick-slide {
              margin: 0 5px;
            }
            .slick-slide > div {
              height: 100%;
            }
            .loading-spinner {
              width: 50px;
              height: 50px;
              border: 5px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              border-top-color: #fff;
              animation: spin 1s ease-in-out infinite;
              margin: 2rem auto;
            }
            
            @keyframes spin {
              to { transform: rotate(360deg); }
            }

            .loading-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 300px;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 16px;
              padding: 2rem;
            }
          `}
        </style>
      </Head>

      <div style={styles.pageContainer}>
        <div style={styles.contentWrapper}>
          <div style={styles.sliderContainer}>
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner" />
              </div>
            ) : (
              <>
                {!shouldShowSlider(windowWidth, incident.media.length) ? (
                  <div style={{
                    ...styles.gridContainer,
                    gridTemplateColumns: `repeat(${getGridColumns(incident.media.length)}, 1fr)`,
                    gap: '1rem'
                  }}>
                    {incident.media.map((item, index) => (
                      <div key={index} className="media-slide" style={styles.gridItem}>
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
                              objectFit="contain"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Slider {...sliderSettings}>
                    {incident.media.map((item, index) => (
                      <div key={index} className="media-slide">
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
                              objectFit="contain"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </Slider>
                )}
              </>
            )}
          </div>

          <div style={styles.detailsContainer}>
            {loading ? (
              <div className="loading-container" style={{ minHeight: '150px' }}>
                <div className="loading-spinner" />
              </div>
            ) : (
              <>
                <div style={styles.metaInfo}>
                  <span style={styles.metaItem}>{incident.date}</span>
                  <span style={styles.metaDot}>•</span>
                  <span style={styles.metaItem}>{incident.time}</span>
                  <span style={styles.metaDot}>|</span>
                  <span style={styles.notifiedCount}>{incident.notified} Notified</span>
                </div>
                <h1 style={styles.title}>{incident.title}</h1>
                <p style={styles.description}>{incident.description}</p>
              </>
            )}
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
    padding: "1rem 1rem 3rem 1rem",
    marginBottom: "1.5rem",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)",
    backdropFilter: "blur(4px)",
  },
  gridContainer: {
    display: 'grid',
    width: '100%',
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '250px',
  },
  mediaWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    border: "3px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    background: "rgba(0, 0, 0, 0.4)",
    transition: "all 0.3s ease",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      border: "3px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    backgroundColor: "#000",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  detailsContainer: {
    marginTop: "1rem",
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    padding: "1.5rem",
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
