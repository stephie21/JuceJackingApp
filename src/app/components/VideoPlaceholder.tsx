import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Play, Video, SkipForward } from "lucide-react";

interface VideoPlaceholderProps {
  videoIndex: number;
  onComplete: () => void;
  staticMode?: boolean;
}

const VIDEO_TOPICS = [
  { title: "Wie funktioniert ein USB-Angriff?", description: "Ein manipuliertes Ladekabel oder eine kompromittierte Station sendet im Hintergrund Daten – ohne dass du es merkst." },
  { title: "Echte Juice Jacking Vorfälle", description: "Sicherheitsforscher demonstrieren, wie schnell Daten über einen öffentlichen USB-Port abgegriffen werden können." },
  { title: "USB Data Blocker in Aktion", description: "So funktioniert ein USB Kondom: Strom kommt durch, Datenleitungen werden physisch unterbrochen." },
  { title: "Malware über USB installieren", description: "In Sekunden kann Schadsoftware auf dein Gerät gelangen – Kontakte, Fotos, Passwörter sind das Ziel." },
];

const DURATION = 10;

export function VideoPlaceholder({ videoIndex, onComplete, staticMode = false }: VideoPlaceholderProps) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(!staticMode);
  const topic = VIDEO_TOPICS[videoIndex % VIDEO_TOPICS.length];
  const remaining = DURATION - elapsed;
  const progress = elapsed / DURATION;

  useEffect(() => {
    if (staticMode) return;
    if (!playing) return;
    if (elapsed >= DURATION) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(t);
  }, [elapsed, playing, onComplete, staticMode]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-16 py-12">
      {/* Video label */}
      <div className="flex items-center gap-2 mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#8888a0", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        <Video size={14} color="#f5e642" />
        Video {videoIndex + 1} von {VIDEO_TOPICS.length}
      </div>

      {/* Video placeholder frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative w-full rounded-3xl overflow-hidden mb-8"
        style={{
          maxWidth: 860,
          aspectRatio: "16 / 9",
          background: "#0d0e14",
          border: "2px solid rgba(245,230,66,0.2)",
        }}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
          }}
        />

        {/* Static noise pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "cover",
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          {/* Play button / playing indicator */}
          <motion.div
            animate={playing ? { scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center rounded-full cursor-pointer"
            style={{
              width: 96,
              height: 96,
              background: "rgba(245,230,66,0.12)",
              border: "2px solid rgba(245,230,66,0.5)",
              cursor: staticMode ? "default" : "pointer",
            }}
            onClick={() => {
              if (!staticMode) setPlaying((p) => !p);
            }}
          >
            {playing ? (
              <div className="flex gap-2">
                <div style={{ width: 6, height: 32, background: "#f5e642", borderRadius: 3 }} />
                <div style={{ width: 6, height: 32, background: "#f5e642", borderRadius: 3 }} />
              </div>
            ) : (
              <Play size={40} color="#f5e642" fill="#f5e642" style={{ marginLeft: 4 }} />
            )}
          </motion.div>

          <div className="text-center px-8">
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#f0f0f5", marginBottom: "0.4rem" }}>
              {topic.title}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#8888a0", lineHeight: 1.5 }}>
              {topic.description}
            </p>
          </div>

          {/* Placeholder badge */}
          <div
            className="px-4 py-1.5 rounded-full"
            style={{ background: "rgba(245,230,66,0.08)", border: "1px solid rgba(245,230,66,0.2)", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "#f5e642", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            Video-Platzhalter · 10 Sek.
          </div>
        </div>

        {/* Timer overlay top-right */}
        <div
          className="absolute top-4 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(245,230,66,0.2)" }}
        >
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: remaining <= 3 ? "#ff4757" : "#f5e642" }}>
            {remaining}s
          </span>
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: "rgba(245,230,66,0.1)" }}>
          <motion.div
            className="h-full"
            style={{ background: "#f5e642", width: `${progress * 100}%` }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Skip button */}
      <div className="flex items-center gap-6">
        <motion.button
          onClick={onComplete}
          className="flex items-center gap-2 px-8 py-3 rounded-xl border"
          style={{
            background: "transparent",
            borderColor: "rgba(245,230,66,0.3)",
            color: "#f5e642",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1.2rem",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.04, borderColor: "#f5e642" }}
          whileTap={{ scale: 0.97 }}
        >
          <SkipForward size={18} />
          Überspringen
        </motion.button>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#555566" }}>
          Weiter in {remaining} Sekunde{remaining !== 1 ? "n" : ""}
        </p>
      </div>
    </div>
  );
}
