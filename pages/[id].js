import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Helper function to format incident data
function formatIncidentData(data) {
  if (!data) return null;
  
  return {
    id: data._id,
    title: data.title,
    description: data.description,
    date: new Date(data.eventTime).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    }),
    time: getTimeAgo(new Date(data.eventTime)),
    notified: data.notifiedUserCount,
    media: data.attachments?.map(item => item.attachment) || [],
    thumbnails: data.attachments?.map(item => item.thumbnail) || [],
    mediaTypes: data.attachments?.map(item => item.attachmentFileType) || []
  };
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + "y";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + "mo";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + "d";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + "h";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + "m";
  return Math.floor(seconds) + "s";
}

export default function IncidentPage({ initialData, error: serverError }) {
  const router = useRouter();
  const [incident, setIncident] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(serverError);

  useEffect(() => {
    if (!router.query.id || initialData) return;

    const fetchIncidentData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get(`https://awaazeye.com/api/v1/event-post/event/${router.query.id}`);
        
        if (!response?.data?.body) {
          setError(true);
          return;
        }

        const formattedData = formatIncidentData(response.data.body);
        setIncident(formattedData);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidentData();
  }, [router.query.id, initialData]);

  if (loading || error || !incident || !router.query.id) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000, #1a1a1a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "Inter, sans-serif"
      }}>
        <h1>News Not Found!!</h1>
      </div>
    );
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

  // Improved media type detection
  const getMediaType = (url) => {
    if (!url) return null;
    if (url.toLowerCase().endsWith('.mp4')) return 'video';
    if (url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) return 'image';
    return null;
  };

  // Safe media checks
  const mediaItems = incident?.media || [];
  const thumbnails = incident?.thumbnails || [];
  
  const firstVideoItem = mediaItems.find(url => getMediaType(url) === 'video');
  const firstImageItem = mediaItems.find(url => getMediaType(url) === 'image');
  const firstThumbnail = thumbnails[0] || '';
  
  const hasVideo = !!firstVideoItem;
  const fallbackImage = firstThumbnail || firstImageItem || '';

  return (
    <>
      <Head>
        <title>{incident.title}</title>
        
        {/* Cache Control Meta Tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* Basic Meta Tags */}
        <meta name="title" content={incident.title} />
        <meta name="description" content={incident.description} />
        
        {/* Open Graph / Facebook & WhatsApp */}
        <meta property="og:type" content={hasVideo ? "video.other" : "website"} />
        <meta property="og:url" content={`https://news.awaazeye.com/${router.query.id}`} />
        <meta property="og:title" content={incident.title} />
        <meta property="og:description" content={incident.description} />
        <meta property="og:site_name" content="Awaaz Eye" />
        
        {hasVideo ? (
          <>
            {/* Video Meta Tags */}
            <meta property="og:video" content={firstVideoItem} />
            <meta property="og:video:url" content={firstVideoItem} />
            <meta property="og:video:secure_url" content={firstVideoItem} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
            
            {/* Fallback image for platforms that don't support video */}
            <meta property="og:image" content={fallbackImage} />
            <meta property="og:image:secure_url" content={fallbackImage} />
            <meta property="og:image:type" content="image/jpeg" />
          </>
        ) : (
          <>
            <meta property="og:image" content={firstImageItem || fallbackImage} />
            <meta property="og:image:secure_url" content={firstImageItem || fallbackImage} />
            <meta property="og:image:type" content="image/jpeg" />
          </>
        )}
        
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={incident.title} />
        <meta property="og:updated_time" content={new Date().toISOString()} />

        {/* Twitter */}
        <meta name="twitter:card" content={hasVideo ? "player" : "summary_large_image"} />
        <meta name="twitter:site" content="@AwaazEye" />
        <meta name="twitter:title" content={incident.title} />
        <meta name="twitter:description" content={incident.description} />
        
        {hasVideo ? (
          <>
            <meta name="twitter:player" content={firstVideoItem} />
            <meta name="twitter:player:width" content="1280" />
            <meta name="twitter:player:height" content="720" />
            <meta name="twitter:player:stream" content={firstVideoItem} />
            <meta name="twitter:player:stream:content_type" content="video/mp4" />
            <meta name="twitter:image" content={fallbackImage} />
          </>
        ) : (
          <>
            <meta name="twitter:image" content={firstImageItem || fallbackImage} />
            <meta name="twitter:image:alt" content={incident.title} />
          </>
        )}

        {/* Microsoft Teams / Skype */}
        <meta name="msapplication-TileImage" content={fallbackImage} />
        <meta name="thumbnail" content={fallbackImage} />
        
        {/* Additional Meta Tags for Better Social Media Support */}
        <meta property="article:published_time" content={new Date().toISOString()} />
        <meta property="article:modified_time" content={new Date().toISOString()} />
        <meta property="article:author" content="Awaaz Eye" />

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`
            .slick-dots {
              bottom: -35px;
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
          `}
        </style>
        <meta name="timestamp" content={new Date().getTime()} />
      </Head>

      <div style={styles.pageContainer}>
        <div style={styles.contentWrapper}>
          <div style={styles.sliderContainer}>
            {mediaItems.length > 0 && (
              mediaItems.length <= 3 ? (
                <div style={styles.staticMediaGrid}>
                  {mediaItems.map((item, index) => (
                    <div key={index} style={styles.staticMediaItem}>
                      {getMediaType(item) === 'video' ? (
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
                </div>
              ) : (
                <Slider {...sliderSettings}>
                  {mediaItems.map((item, index) => (
                    <div key={index} className="media-slide">
                      {getMediaType(item) === 'video' ? (
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
              )
            )}
          </div>

          <div style={styles.detailsContainer}>
            <div style={styles.metaInfo}>
              <span style={styles.metaItem}>{incident.date}</span>
              <span style={styles.metaDot}>•</span>
              <span style={styles.metaItem}>{incident.time}</span>
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
  staticMediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    justifyItems: "center",
    alignItems: "center",
    padding: "0 10px",
    "@media (min-width: 1024px)": {
      gridTemplateColumns: props => 
        props.mediaCount === 1 ? "minmax(250px, 600px)" :
        props.mediaCount === 2 ? "repeat(2, 1fr)" :
        "repeat(3, 1fr)",
    },
    "@media (min-width: 601px) and (max-width: 1023px)": {
      gridTemplateColumns: props => 
        props.mediaCount === 1 ? "minmax(250px, 500px)" :
        "repeat(2, 1fr)",
    },
    "@media (max-width: 600px)": {
      gridTemplateColumns: "minmax(250px, 1fr)",
    }
  },
  staticMediaItem: {
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
  },
  mediaWrapper: {
    position: "relative",
    width: "100%",
    height: "250px",
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
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "",
    backgroundColor: "#000",
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

export async function getServerSideProps({ params, res }) {
  if (params.id === 'favicon.ico') {
    return { notFound: true };
  }

  // Set strict no-cache headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '-1');
  res.setHeader('Surrogate-Control', 'no-store');
  
  try {
    const response = await axios.get(`https://awaazeye.com/api/v1/event-post/event/${params.id}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-store',
        'Expires': '0'
      }
    });
    
    if (!response?.data?.body) {
      return {
        props: { 
          error: true, 
          initialData: null 
        }
      };
    }

    const formattedData = formatIncidentData(response.data.body);

    return {
      props: {
        initialData: formattedData,
        error: false,
        timestamp: new Date().getTime() // Adding timestamp to force refresh
      }
    };
  } catch (error) {
    console.error('Server-side error fetching incident:', error);
    return {
      props: { 
        error: true, 
        initialData: null,
        timestamp: new Date().getTime()
      }
    };
  }
}