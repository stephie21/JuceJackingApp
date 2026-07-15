import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SkipForward, Video } from "lucide-react";

interface VideoPlaceholderProps {
  videoIndex: number;
  onComplete: () => void;
  staticMode?: boolean;
  paused?: boolean;
  skippable?: boolean;
  videoTotal?: number;
  videoTotalLabel?: string;
}

export function VideoPlaceholder({
  videoIndex,
  onComplete,
  staticMode = false,
  paused = false,
  skippable = true,
  videoTotal = 5,
  videoTotalLabel,
}: VideoPlaceholderProps) {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoNumber = videoIndex + 1;
  const videoSrc = `/videos/${videoNumber}.mp4`;
  const videoKicker = videoTotalLabel ?? `Video ${videoNumber} von ${videoTotal}`;

  useEffect(() => {
    let cancelled = false;

    setHasError(false);
    if (staticMode) return () => {
      cancelled = true;
    };

    const video = videoRef.current;
    if (!video) return () => {
      cancelled = true;
    };

    video.load();
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        if (!cancelled) setHasError(true);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [staticMode, videoSrc]);

  useEffect(() => {
    if (staticMode) return;

    const video = videoRef.current;
    if (!video) return;

    if (paused) {
      video.pause();
      return;
    }

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => setHasError(true));
    }
  }, [paused, staticMode]);

  return (
    <div className="kiosk-screen kiosk-pad video-screen">
      <header className="kiosk-header video-header">
        <div className="video-screen-kicker">
          <Video className="video-kicker-icon" color="var(--accent)" />
          {videoKicker}
        </div>
      </header>

      <main className="kiosk-main video-main">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="public-video-frame"
        >
          {!hasError && (
            <video
              ref={videoRef}
              className="public-video-element"
              src={videoSrc}
              muted
              playsInline
              autoPlay={!staticMode}
              controls={false}
              preload="auto"
              onEnded={staticMode ? undefined : () => {
                if (!paused) onComplete();
              }}
              onError={() => setHasError(true)}
            />
          )}

          {hasError && (
            <div className="video-error-panel" role="status" aria-live="polite">
              <Video className="video-error-icon" color="var(--accent)" />
              <h1>Video konnte nicht geladen werden.</h1>
              <p>Die Quizfrage ist trotzdem direkt erreichbar.</p>
            </div>
          )}
        </motion.div>
      </main>

      {(hasError || skippable) && (
        <footer className="kiosk-action-zone video-action-zone">
          <motion.button
            onClick={onComplete}
            className={hasError ? "kiosk-action video-primary-action" : "kiosk-action video-skip-action"}
            whileHover={{ scale: 1.04, borderColor: "var(--accent)" }}
            whileTap={{ scale: 0.97 }}
          >
            {!hasError && <SkipForward className="video-button-icon" />}
            {hasError ? "Weiter" : "Zur Frage"}
          </motion.button>
        </footer>
      )}
    </div>
  );
}
