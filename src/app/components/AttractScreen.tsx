import { motion } from "motion/react";
import { Zap } from "lucide-react";

interface AttractScreenProps {
  onStart: () => void;
}

export function AttractScreen({ onStart }: AttractScreenProps) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer select-none relative overflow-hidden"
      onClick={onStart}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onStart()}
      tabIndex={0}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(245,230,66,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,230,66,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Pulsing glow orb */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(245,230,66,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-12">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center w-28 h-28 rounded-full"
          style={{ background: "rgba(245,230,66,0.12)", border: "2px solid rgba(245,230,66,0.4)" }}
        >
          <Zap size={56} color="#f5e642" fill="#f5e642" />
        </motion.div>

        <div>
          <p className="text-accent uppercase tracking-[0.3em] mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>
            Usable Security · Barbara Böhm & Stephanie Motz
          </p>
          <h1
            className="text-foreground uppercase leading-none mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 900, letterSpacing: "-0.01em" }}
          >
            ⚡ JUICE
            <br />
            <span style={{ color: "#f5e642" }}>JACKING</span>
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.4rem", fontWeight: 400 }}>
            Teste dein Wissen über USB-Sicherheit
          </p>
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mt-4 px-10 py-5 rounded-full border-2"
          style={{
            background: "rgba(245,230,66,0.08)",
            borderColor: "#f5e642",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#f5e642",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Hier tippen zum Starten →
        </motion.div>

        <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
          5 Fragen · ca. 2 Minuten
        </p>
      </div>
    </div>
  );
}
