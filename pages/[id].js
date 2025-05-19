import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import incidents from "../data/incidents";
import styles from "./IncidentPage.module.css";
import { FaPlay } from "react-icons/fa6";
import LocationImage from "../images/location.png";
import FireImage from "../images/vector.png";
import { BiCommentDetail } from "react-icons/bi";
import { GoShareAndroid } from "react-icons/go";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaRegEye, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FiMaximize } from "react-icons/fi";
import { MdVolumeUp } from "react-icons/md";
import { MdVolumeOff } from "react-icons/md";
import Home from ".";
import { IoMdClose } from "react-icons/io";

// Helper function to format incident data
function formatIncidentData(data) {
  if (!data) return null;

  return {
    id: data._id,
    title: data.title,
    description: data.description,
    date: new Date(data.eventTime).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    }),
    time: getTimeAgo(new Date(data.eventTime)),
    notified: data.notifiedUserCount,
    media: data.attachments?.map((item) => item.attachment) || [],
    thumbnails: data.attachments?.map((item) => item.thumbnail) || [],
    mediaTypes: data.attachments?.map((item) => item.attachmentFileType) || [],
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

// Update the helper function to get video poster
function getVideoPoster(videoUrl) {
  if (!videoUrl) return "";
  return `https://awaazeye.com/api/v1/video-thumbnail?url=${encodeURIComponent(
    videoUrl
  )}`;
}

const getMediaType = (url) => {
  if (!url) return null;
  if (url.toLowerCase().endsWith(".mp4")) return "video";
  if (url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) return "image";
  return null;
};

export default function IncidentPage() {
  const router = useRouter();
  const { id } = router.query;

  // State for main incident
  const [incident, setIncident] = useState(null);
  // State for nearby events
  const [nearbyEvents, setNearbyEvents] = useState([]);
  // Loading and error states (optional)
  const [loading, setLoading] = useState(true);
  console.log("incident >>>>>>>>>", incident);
  const mediaItems =
    incident?.attachments?.map((item) => item.attachment) || [];
  const thumbnails = incident?.attachments?.map((item) => item.thumbnail) || [];

  const firstVideoItem = mediaItems.find(
    (url) => getMediaType(url) === "video"
  );
  const firstImageItem = mediaItems.find(
    (url) => getMediaType(url) === "image"
  );
  const firstThumbnail = thumbnails[0];
  const videoPoster = firstVideoItem
    ? `https://awaazeye.com/api/v1/video-thumbnail?url=${encodeURIComponent(
        firstVideoItem
      )}`
    : "";
  const fallbackImage = firstThumbnail || videoPoster || firstImageItem || "";

  const hasVideo = !!firstVideoItem;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Fetch main incident
    axios
      .get(`https://awaazeye.com/api/v1/event-post/event/${id}`)
      .then((res) => setIncident(res.data.body))
      .catch(() => setIncident(null));

    // Fetch nearby events
    axios
      .get(`https://awaazeye.com/api/v1/event-post/other-nearby-events/${id}`)
      .then((res) => setNearbyEvents(res.data.body || []))
      .catch(() => setNearbyEvents([]))
      .finally(() => setLoading(false));
  }, [id]);

  const [currentBg, setCurrentBg] = useState(incident?.media?.[0] || null);
  const videoRefs = useRef([]);
  const [mutedStates, setMutedStates] = useState([]);
  const [fullscreenMedia, setFullscreenMedia] = useState(null);

  useEffect(() => {
    if (incident?.media?.length > 0) {
      setMutedStates(Array(incident.media.length).fill(true));
    }
  }, [incident]);

  if (loading) return <div>Loading...</div>;
  if (!incident) return <Home />;

  const handlePlayClick = (item) => {
    const matched = incident.attachments.find(
      (att) => att.attachmentId === item.attachmentId
    );
    console.log("matched >>>>>>>>>", matched.attachment);
    if (matched) setFullscreenMedia(matched);
  };

  const handleCardClick = (id) => {
    router.push(`/${id}`);
  };

  return (
    <>
      <Head>
        <title>{incident.title}</title>
        {/* Cache Control Meta Tags */}
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Basic Meta Tags */}
        <meta name="title" content={incident.title} />
        <meta name="description" content={incident.description} />

        {/* Open Graph tags for link preview */}
        <meta property="og:type" content={hasVideo ? "video" : "article"} />
        <meta
          property="og:url"
          content={`https://news.awaazeye.com/${router.query.id}`}
        />
        <meta property="og:title" content={incident.title} />
        <meta property="og:description" content={incident.description} />
        <meta property="og:site_name" content="Awaaz Eye" />

        {hasVideo ? (
          <>
            {/* Video preview meta tags */}
            <meta property="og:video" content={firstVideoItem} />
            <meta property="og:video:type" content="video/mp4" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />
            <meta property="og:image" content={fallbackImage} />
            <meta property="og:image:width" content="1280" />
            <meta property="og:image:height" content="720" />
            <meta property="og:image:alt" content={incident.title} />

            {/* Twitter video card */}
            <meta name="twitter:card" content="player" />
            <meta name="twitter:site" content="@AwaazEye" />
            <meta name="twitter:title" content={incident.title} />
            <meta name="twitter:description" content={incident.description} />
            <meta name="twitter:player" content={firstVideoItem} />
            <meta name="twitter:player:width" content="1280" />
            <meta name="twitter:player:height" content="720" />
            <meta name="twitter:image" content={fallbackImage} />
          </>
        ) : (
          <>
            {/* Image preview meta tags */}
            <meta
              property="og:image"
              content={firstImageItem || fallbackImage}
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={incident.title} />

            {/* Twitter image card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@AwaazEye" />
            <meta name="twitter:title" content={incident.title} />
            <meta name="twitter:description" content={incident.description} />
            <meta
              name="twitter:image"
              content={firstImageItem || fallbackImage}
            />
          </>
        )}

        {/* Microsoft Teams / Skype preview */}
        <meta name="msapplication-TileImage" content={fallbackImage} />
        <meta name="thumbnail" content={fallbackImage} />

        {/* Force refresh for link preview */}
        <meta property="og:updated_time" content={new Date().toISOString()} />

        {/* Additional Meta Tags for Better Social Media Support */}
        <meta
          property="article:published_time"
          content={new Date().toISOString()}
        />
        <meta
          property="article:modified_time"
          content={new Date().toISOString()}
        />
        <meta property="article:author" content="Awaaz Eye" />
      </Head>
      <div
        className={styles.mainBg}
        style={{
          backgroundImage: currentBg ? `url(${currentBg})` : "none",
        }}
      >
        <div className={styles.centerContent}>
          <div className={styles.stickyHeader}>{incident?.address}</div>
          {/* Slider */}
          <div className={styles.sliderBox}>
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              onSlideChange={(swiper) =>
                setCurrentBg(
                  incident?.attachments?.[swiper.activeIndex]?.attachment ||
                    null
                )
              }
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
            >
              {incident.attachments?.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className={styles.sliderMedia}>
                    {/* Overlay for views */}
                    <div className={styles.sliderViewsOverlay}>
                      <span className={styles.viewsIcon}>
                        <FaRegEye />
                      </span>
                      <span className={styles.viewsText}>
                        {incident.viewCounts} views
                      </span>
                    </div>
                    {item.attachmentFileType === "Video" ? (
                      <div className={styles.videoWrapper}>
                        <video
                          className={styles.sliderImg}
                          src={item.attachment}
                          autoPlay
                          muted
                          loop
                          playsInline
                          ref={(el) => (videoRefs.current[idx] = el)}
                        />

                        {/* Fullscreen Button */}
                        <button
                          className={styles.fullscreenBtn}
                          onClick={() => {
                            const video = videoRefs.current[idx];
                            if (video?.requestFullscreen) {
                              video.requestFullscreen();
                            } else if (video?.webkitRequestFullscreen) {
                              video.webkitRequestFullscreen();
                            } else if (video?.msRequestFullscreen) {
                              video.msRequestFullscreen();
                            }
                          }}
                        >
                          <FiMaximize color="white" size={18} />
                        </button>

                        {/* Mute/Unmute Button */}
                        <button
                          className={styles.muteBtn}
                          onClick={() => {
                            const video = videoRefs.current[idx];
                            if (video) {
                              const newMuted = !video.muted;
                              video.muted = newMuted;

                              setMutedStates((prev) => {
                                const updated = [...prev];
                                updated[idx] = newMuted;
                                return updated;
                              });
                            }
                          }}
                        >
                          {videoRefs.current[idx]?.muted ?? true ? (
                            <MdVolumeOff color="white" size={18} />
                          ) : (
                            <MdVolumeUp color="white" size={18} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <img
                        className={styles.sliderImg}
                        src={item.attachment}
                        alt="media"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={styles.sliderOverlay}></div>
          </div>

          {/* Meta info */}
          <div className={styles.metaRow}>
            {incident?.distance && (
              <>
                <span>{incident?.distance}</span>
                <span className={styles.dot}>•</span>
              </>
            )}
            {incident?.eventTime && (
              <>
                <span>
                  {incident?.eventTime
                    ? new Date(incident.eventTime).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
                <span className={styles.dot}>•</span>
                {/* Time ago */}
                <span>
                  {incident?.eventTime
                    ? getTimeAgo(new Date(incident.eventTime)) + " ago"
                    : ""}
                </span>
              </>
            )}
          </div>
          <span className={styles.notified}>
            {incident?.notifiedUserCount ? incident?.notifiedUserCount : 0}{" "}
            Notified
          </span>

          {/* Title & Description */}
          <div>
            <div className={styles.titleRow}>
              {incident?.title ? incident?.title : "No Title"}
            </div>
            <div className={styles.descRow}>
              {incident?.description ? incident?.description : "No Description"}
            </div>
          </div>

          <div className={styles.incidentActions}>
            <Image
              src={LocationImage}
              className={styles.actionIconImage}
              alt="location"
            />
            <div className={styles.actionIcon}>
              <Image src={FireImage} alt="reaction" />
            </div>
            <div className={styles.actionText}>
              {incident?.reactionCounts ? incident?.reactionCounts : 0}
            </div>
            <div className={styles.actionIcon}>
              <BiCommentDetail color="white" />
            </div>
            <div className={styles.actionText}>
              {incident?.commentCounts ? incident?.commentCounts : 0}
            </div>
            <div className={styles.actionIcon}>
              <GoShareAndroid color="white" />
            </div>
          </div>

          {fullscreenMedia && (
            <div className={styles.fullscreenOverlayCustom}>
              <div className={styles.fullscreenMediaCenter}>
                {fullscreenMedia.attachmentFileType === "Video" ? (
                  <video
                    src={fullscreenMedia.attachment}
                    className={styles.fullscreenMedia}
                    autoPlay
                    loop
                    muted={fullscreenMedia.muted}
                    ref={(el) => (fullscreenMedia.videoRef = el)}
                  />
                ) : (
                  <img
                    src={fullscreenMedia.attachment}
                    className={styles.fullscreenMedia}
                    alt="media"
                  />
                )}
                {/* Close Button */}
                <button
                  className={styles.fullscreenCloseBtn}
                  onClick={() => setFullscreenMedia(null)}
                >
                  ×
                </button>
                {/* Mute/Unmute Button */}
                {fullscreenMedia.attachmentFileType === "Video" && (
                  <button
                    className={styles.fullscreenMuteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      const video = document.querySelector(
                        `.${styles.fullscreenMedia}`
                      );
                      if (video) {
                        video.muted = !video.muted;
                        setFullscreenMedia({
                          ...fullscreenMedia,
                          muted: video.muted,
                        });
                      }
                    }}
                  >
                    {fullscreenMedia.muted ? (
                      <MdVolumeOff color="white" size={22} />
                    ) : (
                      <MdVolumeUp color="white" size={22} />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          {incident?.timeLines && incident.timeLines.length > 0 ? (
            <>
              <div className={styles.timelineTitle}>Timeline</div>
              <div className={styles.timelineList}>
                {incident.timeLines?.map((item, idx) => (
                  <div className={styles.timelineItem} key={idx}>
                    {item?.eventTime && (
                      <div className={styles.timelineTime}>
                        <span>
                          {new Date(item.eventTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span
                          className={styles.playIcon}
                          onClick={() => handlePlayClick(item)}
                        >
                          <FaPlay size={12} color="#FFFFFF" />
                        </span>
                      </div>
                    )}{" "}
                    : (<></>)
                    {item.description && (
                      <div className={styles.timelineDesc}>
                        {item?.description ? item.description : ""}
                      </div>
                    )}
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineVert} />
                    <div className={styles.timelineDotBottom}></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}

          {/* In this area */}
          <div className={styles.areaTitle}>In this area</div>
          <div className={styles.areaList}>
            {nearbyEvents.length > 0 ? (
              nearbyEvents.map((card, idx) => (
                <div
                  className={styles.areaCard}
                  key={card._id}
                  onClick={() => handleCardClick(card._id)}
                >
                  <div className={styles.areaCardLeft}>
                    <div className={styles.areaMetaRow}>
                      <span>{card.distance}</span>
                      <span className={styles.dot}>•</span>
                      <span>
                        {incident?.eventTime
                          ? getTimeAgo(new Date(incident.eventTime)) + " ago"
                          : ""}
                      </span>
                    </div>
                    <div className={styles.areaCardTitle}>{card.title}</div>
                    <div className={styles.areaCardDesc}>
                      {card.description}
                    </div>
                  </div>
                  <div className={styles.areaCardImgWrap}>
                    {card.attachmentFileType === "Video" ? (
                      <video
                        className={styles.areaCardImg}
                        src={card.attachment}
                        controls
                      />
                    ) : (
                      <img
                        className={styles.areaCardImg}
                        src={card.attachment}
                        alt="area"
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noNearbyEvents}>
                No nearby events found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// export async function getServerSideProps({ params, res }) {
//   if (params.id === 'favicon.ico') {
//     return { notFound: true };
//   }

//   // Set strict no-cache headers
//   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
//   res.setHeader('Pragma', 'no-cache');
//   res.setHeader('Expires', '-1');
//   res.setHeader('Surrogate-Control', 'no-store');

//   try {
//     const response = await axios.get(`https://awaazeye.com/api/v1/event-post/event/${params.id}`, {
//       headers: {
//         'Cache-Control': 'no-cache',
//         'Pragma': 'no-cache',
//         'Cache-Control': 'no-store',
//         'Expires': '0'
//       }
//     });

//     if (!response?.data?.body) {
//       return {
//         props: {
//           error: true,
//           initialData: null
//         }
//       };
//     }

//     const formattedData = formatIncidentData(response.data.body);

//     return {
//       props: {
//         initialData: formattedData,
//         error: false,
//         timestamp: new Date().getTime() // Adding timestamp to force refresh
//       }
//     };
//   } catch (error) {
//     console.error('Server-side error fetching incident:', error);
//     return {
//       props: {
//         error: true,
//         initialData: null,
//         timestamp: new Date().getTime()
//       }
//     };
//   }
// }
