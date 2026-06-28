import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SkipForward, Video } from "lucide-react";

interface VideoPlaceholderProps {
  videoIndex: number;
  onComplete: () => void;
  staticMode?: boolean;
}

export function VideoPlaceholder({ videoIndex, onComplete, staticMode = false }: VideoPlaceholderProps) {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoNumber = videoIndex + 1;
  const videoSrc = `/videos/${videoNumber}.mov`;

  useEffect(() => {
    setHasError(false);
    if (staticMode) return;

    const video = videoRef.current;
    if (!video) return;

    video.load();
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => undefined);
    }
  }, [staticMode, videoSrc]);

  return (
    <div className="kiosk-screen kiosk-pad video-screen flex flex-col items-center justify-center">
      <div className="video-screen-kicker">
        <Video size={16} color="var(--accent)" />
        Video {videoNumber} von 5
      </div>

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
            onEnded={staticMode ? undefined : onComplete}
            onError={() => setHasError(true)}
          />
        )}

        {hasError && (
          <div className="video-error-panel" role="status" aria-live="polite">
            <Video size={64} color="var(--accent)" />
            <h1>Video konnte nicht geladen werden.</h1>
            <p>Die Quizfrage ist trotzdem direkt erreichbar.</p>
            <motion.button
              onClick={onComplete}
              className="kiosk-action video-primary-action"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Weiter
            </motion.button>
          </div>
        )}
      </motion.div>

      {!hasError && (
        <motion.button
          onClick={onComplete}
          className="kiosk-action video-skip-action"
          whileHover={{ scale: 1.04, borderColor: "var(--accent)" }}
          whileTap={{ scale: 0.97 }}
        >
          <SkipForward size={20} />
          Überspringen
        </motion.button>
      )}
    </div>
  );
}
