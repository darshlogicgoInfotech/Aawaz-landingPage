import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Static data for testing
const incidents = [
  {
    _id: "67cfbc725cd45c3a15343fe4",
    title: "Traffic Jam Alert",
    description: "Heavy traffic reported on Main Street due to construction work",
    eventTime: "2024-03-11T04:29:43.879Z",
    viewCounts: "1",
    commentCounts: "0",
    reactionCounts: "0",
    sharedCount: "0",
    notifiedUserCount: "5",
    address: "Main Street",
    attachments: [
      {
        type: "default",
        title: "Traffic Jam",
        attachment: "https://guardianshot.blr1.cdn.digitaloceanspaces.com/eagleEye/event-post/1741667441653.mp4",
        thumbnail: "https://guardianshot.blr1.cdn.digitaloceanspaces.com/eagleEye/event-post/1741667441844.png",
        description: "Traffic situation",
        attachmentFileType: "Video"
      }
    ]
  },
  {
    _id: "67cfd4605cd45c3a153440cb",
    title: "Road Accident Alert",
    description: "Minor accident reported near City Center",
    eventTime: "2024-03-11T05:45:00.000Z",
    viewCounts: "3",
    commentCounts: "1",
    reactionCounts: "2",
    sharedCount: "1",
    notifiedUserCount: "10",
    address: "City Center",
    attachments: [
      {
        type: "default",
        title: "Accident Scene",
        attachment: "https://guardianshot.blr1.cdn.digitaloceanspaces.com/eagleEye/event-post/accident.jpg",
        thumbnail: "https://guardianshot.blr1.cdn.digitaloceanspaces.com/eagleEye/event-post/accident_thumb.jpg",
        description: "Accident situation",
        attachmentFileType: "Image"
      }
    ]
  }
];

function formatIncidentData(data) {
  if (!data) return null;
  
  return {
    id: data._id,
    title: data.title || 'Awaaz Eye News',
    description: data.description || 'Latest news and updates from Awaaz Eye',
    date: new Date(data.eventTime).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    }),
    time: getTimeAgo(new Date(data.eventTime)),
    notified: data.notifiedUserCount,
    media: data.attachments?.map(item => item.attachment) || [],
    thumbnails: data.attachments?.map(item => item.thumbnail) || [],
    mediaTypes: data.attachments?.map(item => item.attachmentFileType) || [],
    ogImage: data.attachments?.[0]?.thumbnail || data.attachments?.[0]?.attachment || '',
    ogVideo: data.attachments?.find(item => item.attachmentFileType === 'Video')?.attachment || '',
    ogType: data.attachments?.some(item => item.attachmentFileType === 'Video') ? 'video.other' : 'website',
    url: `https://aawaz-landingpage.onrender.com/${data._id}`
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

export default function IncidentPage({ incident }) {
  const router = useRouter();

  if (!incident) {
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
        <h1>News Not Found</h1>
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

  return (
    <>
      <Head>
        <title>{incident.title}</title>
        <meta name="description" content={incident.description} />
        
        {/* Basic Meta Tags */}
        <meta name="title" content={incident.title} />
        <meta name="description" content={incident.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={incident.ogType} />
        <meta property="og:url" content={incident.url} />
        <meta property="og:title" content={incident.title} />
        <meta property="og:description" content={incident.description} />
        <meta property="og:site_name" content="Awaaz Eye" />
        <meta property="og:locale" content="en_US" />
        
        {incident.ogVideo ? (
          <>
            <meta property="og:video" content={incident.ogVideo} />
            <meta property="og:video:url" content={incident.ogVideo} />
            <meta property="og:video:secure_url" content={incident.ogVideo} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
            <meta property="og:image" content={incident.ogImage} />
            <meta property="og:image:secure_url" content={incident.ogImage} />
          </>
        ) : (
          <>
            <meta property="og:image" content={incident.ogImage} />
            <meta property="og:image:secure_url" content={incident.ogImage} />
          </>
        )}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={incident.title} />

        {/* Twitter */}
        <meta name="twitter:card" content={incident.ogVideo ? "player" : "summary_large_image"} />
        <meta name="twitter:site" content="@AwaazEye" />
        <meta name="twitter:creator" content="@AwaazEye" />
        <meta name="twitter:title" content={incident.title} />
        <meta name="twitter:description" content={incident.description} />
        
        {incident.ogVideo ? (
          <>
            <meta name="twitter:player" content={incident.ogVideo} />
            <meta name="twitter:player:width" content="1280" />
            <meta name="twitter:player:height" content="720" />
            <meta name="twitter:player:stream" content={incident.ogVideo} />
            <meta name="twitter:player:stream:content_type" content="video/mp4" />
            <meta name="twitter:image" content={incident.ogImage} />
          </>
        ) : (
          <>
            <meta name="twitter:image" content={incident.ogImage} />
            <meta name="twitter:image:alt" content={incident.title} />
          </>
        )}

        {/* Additional Meta Tags for Better Social Media Support */}
        <meta property="article:published_time" content={new Date().toISOString()} />
        <meta property="article:author" content="Awaaz Eye" />
        
        {/* Microsoft Teams / Skype */}
        <meta name="msapplication-TileImage" content={incident.ogImage} />
        <meta name="thumbnail" content={incident.ogImage} />

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
      </Head>

      <div style={styles.pageContainer}>
        <div style={styles.contentWrapper}>
          <div style={styles.sliderContainer}>
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
    objectFit: "cover",
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
  // Set cache control headers
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  // Set content type
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    // Find incident from static data
    const incident = incidents.find(item => item._id === params.id);
    
    if (!incident) {
      return {
        props: {
          incident: null
        }
      };
    }

    // Format the incident data
    const formattedIncident = formatIncidentData(incident);

    return {
      props: {
        incident: formattedIncident
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      props: {
        incident: null
      }
    };
  }
}