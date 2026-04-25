import { useCallback, useEffect, useRef, useState } from "react";

export interface GateTourProps {
  isActive: boolean;
  onClose: () => void;
}

// NOTE: These timestamps are approximate based on script pacing for the 2:41 video.
// Play the video at localhost:3000/deal-desk and note
// the exact second Diora begins talking about each section, then update these values accordingly.
const SCROLL_MAP = [
  { time: 0, sectionId: "gate-hero", label: "hero" },
  { time: 14, sectionId: "gate-tools", label: "tools" },
  { time: 35, sectionId: "gate-why", label: "why" },
  { time: 62, sectionId: "gate-timeline", label: "timeline" },
  { time: 115, sectionId: "gate-diff", label: "differentiators" },
  { time: 133, sectionId: "gate-access", label: "access" },
] as const;

const POSTER_SRC = "/images/deal-desk-video-poster.jpg";

function clearSectionHighlights() {
  SCROLL_MAP.forEach((entry) => {
    document.getElementById(entry.sectionId)?.classList.remove("gate-section-active");
  });
}

export function GateTour({ isActive, onClose }: GateTourProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    clearSectionHighlights();
    const v = videoRef.current;
    if (v) {
      v.pause();
    }
    setCurrentSection("");
    setVideoEnded(false);
    setIsPlaying(false);
    onClose();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [onClose]);

  const handleCtaAfterVideo = useCallback(() => {
    clearSectionHighlights();
    const v = videoRef.current;
    if (v) {
      v.pause();
    }
    setCurrentSection("");
    setVideoEnded(false);
    setIsPlaying(false);
    document.getElementById("gate-access")?.scrollIntoView({ behavior: "smooth", block: "start" });
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isActive) {
      clearSectionHighlights();
      setCurrentSection("");
      setVideoEnded(false);
      setProgressPct(0);
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    window.scrollTo({ top: 0, behavior: "smooth" });
    setVideoEnded(false);
    setCurrentSection("");

    playTimeoutRef.current = setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = 0;
      v.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }, 800);

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
    };
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive || videoEnded) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const activeEntry = [...SCROLL_MAP].reverse().find((entry) => currentTime >= entry.time);

      if (activeEntry && activeEntry.label !== currentSection) {
        setCurrentSection(activeEntry.label);
        const el = document.getElementById(activeEntry.sectionId);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }

      const pct = video.duration && Number.isFinite(video.duration) ? (video.currentTime / video.duration) * 100 : 0;
      setProgressPct(pct);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isActive, currentSection, videoEnded]);

  useEffect(() => {
    if (!isActive || videoEnded) return;

    clearSectionHighlights();
    if (!currentSection) return;

    const id = SCROLL_MAP.find((e) => e.label === currentSection)?.sectionId;
    if (id) {
      document.getElementById(id)?.classList.add("gate-section-active");
    }
  }, [isActive, currentSection, videoEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [isActive, videoEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    const onEnded = () => {
      setVideoEnded(true);
      setIsPlaying(false);
      setProgressPct(100);
      setCurrentSection("");
      clearSectionHighlights();
      document.getElementById("gate-access")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [isActive, videoEnded]);

  const togglePlayPause = useCallback(() => {
    if (videoEnded) return;
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [videoEnded]);

  const handleCtaClick = handleCtaAfterVideo;

  if (!isActive) {
    return null;
  }

  return (
    <div className="gate-tour-bubble" role="region" aria-label="Guided tour video">
      <div className="gate-tour-card">
        {!videoEnded ? (
          <video
            ref={videoRef}
            className="gate-tour-video"
            src="/videos/deal-desk-overview.mp4"
            poster={POSTER_SRC}
            playsInline
            preload="auto"
            onClick={togglePlayPause}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="gate-tour-ended-visual">
            <img src={POSTER_SRC} alt="" className="gate-tour-video gate-tour-video--static" />
            <div className="gate-tour-end gate-tour-end--overlay">
              <p>Ready to get started?</p>
              <button type="button" className="gate-tour-end-btn" onClick={handleCtaClick}>
                Enter your code →
              </button>
            </div>
          </div>
        )}

        <div className="gate-tour-controls">
          <span className="gate-tour-label">Guided Tour</span>
          <div className="gate-tour-controls__btns">
            {!videoEnded && (
              <button
                type="button"
                className="gate-tour-btn gate-tour-btn-play"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>
            )}
            <button
              type="button"
              className="gate-tour-btn gate-tour-btn-close"
              aria-label="Close tour"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="gate-tour-progress">
          <div className="gate-tour-progress-fill" style={{ width: `${videoEnded ? 100 : progressPct}%` }} />
        </div>
      </div>
    </div>
  );
}
