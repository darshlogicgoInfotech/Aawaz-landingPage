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
import { createMetadata } from "../utils/commonMeta";

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

export default function IncidentPage({ initialData, error: serverError }) {
  const router = useRouter();
  const { id } = router.query;

  // State for main incident
  const [incident, setIncident] = useState(initialData);
  // State for nearby events
  const [nearbyEvents, setNearbyEvents] = useState([]);
  // Loading and error states (optional)
  const [loading, setLoading] = useState(true);

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
    if (matched) setFullscreenMedia(matched);
  };

  const handleCardClick = (id) => {
    router.push(`/${id}`);
  };

  const getMediaType = (url) => {
    if (!url) return null;
    if (url.toLowerCase().endsWith(".mp4")) return "video";
    if (url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) return "image";
    return null;
  };

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
  const videoPoster = firstVideoItem;
  const fallbackImage = firstThumbnail || videoPoster || firstImageItem || "";

  const hasVideo = !!firstVideoItem;

  const metadata = createMetadata({
    title: incident.title || "Incident Report",
    description: incident.description || "View details about this incident",
    img: firstThumbnail || fallbackImage,
    type: hasVideo ? "video.other" : "article",
    url: `https://news.awaazeye.com/${id}`,
    siteName: "Awaaz Eye",
  });

  console.log("meta" , metadata)

  console.log("hasVideo" , hasVideo)
  console.log("firstVideoItem" , firstVideoItem)
  console.log("fallbackImage" , fallbackImage)
  console.log("metadata.title" , metadata.title)

  return (
    <>
      <Head>
        {/* HTML Meta Tags */}
        <title>Essential Steps for Effective Budget Management: A Guide to Financial Success</title>
        <meta name="description" content="Whether you live from paycheque to paycheque or can easily afford some indulgences, you must know how to manage money properly. It's not as complicated as it might seem. You go over your spending, work out a budget, and do your best to stick to it. Here you will find some basic money management tips to help you navigate the world of personal finances." />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://walletsync.app/blog/essential-steps-for-effective-budget-management-a-guide-to-financial-success" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Essential Steps for Effective Budget Management: A Guide to Financial Success" />
        <meta property="og:description" content="Whether you live from paycheque to paycheque or can easily afford some indulgences, you must know how to manage money properly. It's not as complicated as it might seem. You go over your spending, work out a budget, and do your best to stick to it. Here you will find some basic money management tips to help you navigate the world of personal finances." />
        <meta property="og:image" content="https://guardianshot.blr1.digitaloceanspaces.com/expense/blogs/93919a05-0fd3-4622-9faa-4799c7112fdd.jpg" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="walletsync.app" />
        <meta property="twitter:url" content="https://walletsync.app/blog/essential-steps-for-effective-budget-management-a-guide-to-financial-success" />
        <meta name="twitter:title" content="Essential Steps for Effective Budget Management: A Guide to Financial Success" />
        <meta name="twitter:description" content="Whether you live from paycheque to paycheque or can easily afford some indulgences, you must know how to manage money properly. It's not as complicated as it might seem. You go over your spending, work out a budget, and do your best to stick to it. Here you will find some basic money management tips to help you navigate the world of personal finances." />
        <meta name="twitter:image" content="https://guardianshot.blr1.digitaloceanspaces.com/expense/blogs/93919a05-0fd3-4622-9faa-4799c7112fdd.jpg" />
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
                    {!item.attachment ? (
                      <div
                        className={styles.sliderImg}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#222",
                        }}
                      >
                        <svg
                          width="63"
                          height="63"
                          viewBox="0 0 63 63"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_1123_5031)">
                            <path
                              d="M56.1117 63.0419H43.7292L32.0379 54.4461L20.5348 63.0419H7.92578L32.1061 21.4736L56.1117 63.0419ZM45.2253 58.5097H48.2475L32.0924 30.538L15.82 58.5097H19.0214L32.0178 48.7981L45.2253 58.5097Z"
                              fill="white"
                            />
                            <path
                              d="M52.6317 32.154C52.6334 36.1082 51.4869 39.9785 49.3303 43.2977L46.5564 38.9676C47.5633 36.8377 48.0851 34.5121 48.0843 32.1576C48.0843 23.3479 40.8931 16.1807 32.0539 16.1807C23.2147 16.1807 16.0225 23.3443 16.0225 32.154C16.0193 34.6855 16.621 37.1815 17.7778 39.4353L15.043 43.7065C13.2286 41.0531 12.0645 38.0122 11.6444 34.8286C11.2244 31.645 11.5601 28.4076 12.6246 25.3769C13.6891 22.3462 15.4526 19.6069 17.7731 17.3795C20.0937 15.152 22.9066 13.4987 25.9853 12.5524C29.064 11.6062 32.3227 11.3936 35.4989 11.9316C38.6751 12.4697 41.6803 13.7434 44.2725 15.6502C46.8647 17.5571 48.9715 20.0438 50.4234 22.9103C51.8753 25.7768 52.6317 28.9429 52.6317 32.154Z"
                              fill="white"
                            />
                            <g opacity="0.3">
                              <path
                                d="M63.0264 30.9389C63.0305 38.6982 60.1015 46.1742 54.8229 51.8775L52.2763 47.9019C56.2842 43.1531 58.4803 37.1461 58.4771 30.9407C58.479 16.3978 46.6112 4.5743 32.0259 4.5743C17.4406 4.5743 5.57375 16.3978 5.57375 30.9389C5.56169 37.323 7.88489 43.4927 12.1083 48.2926L9.57636 52.2483C6.07573 48.5921 3.52799 44.1362 2.15629 39.2709C0.7846 34.4056 0.630799 29.2793 1.70836 24.341C2.78592 19.4027 5.06198 14.803 8.33717 10.9449C11.6124 7.08678 15.7868 4.0879 20.4948 2.21092C25.2028 0.333943 30.3007 -0.363876 35.3421 0.178588C40.3835 0.721051 45.2146 2.48725 49.4121 5.32248C53.6096 8.15771 57.0456 11.9755 59.4191 16.4414C61.7926 20.9073 63.0312 25.8852 63.0264 30.9389Z"
                                fill="white"
                              />
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_1123_5031">
                              <rect width="63" height="63" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    ) : item.attachmentFileType === "Video" ? (
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

export async function getServerSideProps({ params, res }) {
  if (params.id === "favicon.ico") {
    return { notFound: true };
  }

  // Set strict no-cache headers
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "-1");
  res.setHeader("Surrogate-Control", "no-store");

  try {
    const response = await axios.get(
      `https://awaazeye.com/api/v1/event-post/event/${params.id}`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Cache-Control": "no-store",
          Expires: "0",
        },
      }
    );

    const nearbyEvents = await axios.get(
      `https://awaazeye.com/api/v1/event-post/other-nearby-events/${params.id}`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          "Cache-Control": "no-store",
          Expires: "0",
        },
      }
    );
    // console.log("responce >>>>>>>>", response.data?.body)

    // const [mainIncident, nearbyEvents] = await Promise.all([
    //   fetch(`https://awaazeye.com/api/v1/event-post/event/${params.id}`),
    //   fetch(`https://awaazeye.com/api/v1/event-post/other-nearby-events/${params.id}`)
    // ]);

    // console.log("main incidenet" , mainIncident)
    console.log("nearby events ??????????????", nearbyEvents);
    if (!response?.data?.body) {
      return {
        props: {
          error: true,
          initialData: null,
        },
      };
    }

    // const formattedData = formatIncidentData(response.data.body);

    return {
      props: {
        initialData: response.data.body,
        error: false,
        timestamp: new Date().getTime(), // Adding timestamp to force refresh
      },
    };
  } catch (error) {
    console.error("Server-side error fetching incident:", error);
    return {
      props: {
        error: true,
        initialData: null,
        timestamp: new Date().getTime(),
      },
    };
  }
}
