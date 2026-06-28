import { motion } from "motion/react";
import { Zap } from "lucide-react";

interface AttractScreenProps {
  onStart: () => void;
}

export function AttractScreen({ onStart }: AttractScreenProps) {
  return (
    <div
      className="kiosk-screen flex flex-col items-center justify-center cursor-pointer select-none relative overflow-hidden"
      onClick={onStart}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onStart()}
      tabIndex={0}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(245,230,66,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,230,66,0.3) 1px, transparent 1px)`,
          backgroundSize: "clamp(2.5rem, 7vw, 3.75rem) clamp(2.5rem, 7vw, 3.75rem)",
        }}
      />

      {/* Pulsing glow orb */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: "clamp(20rem, 58vw, 38rem)", height: "clamp(20rem, 58vw, 38rem)", background: "radial-gradient(circle, rgba(245,230,66,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-[clamp(1.25rem,3vh,2rem)] text-center px-[clamp(1.5rem,6vw,3rem)] py-[clamp(2rem,7vh,5rem)]">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center w-[clamp(5.25rem,11vw,7rem)] h-[clamp(5.25rem,11vw,7rem)] rounded-full"
          style={{ background: "rgba(245,230,66,0.12)", border: "2px solid rgba(245,230,66,0.4)" }}
        >
          <Zap className="size-[clamp(2.75rem,6vw,3.5rem)]" color="var(--accent)" fill="var(--accent)" />
        </motion.div>

        <div>
          <p className="text-accent uppercase tracking-[0.3em] mb-[clamp(0.5rem,1.5vh,0.75rem)]" style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.72rem, 1.5vw, 0.85rem)", fontWeight: 600 }}>
            Usable Security · Barbara Böhm & Stephanie Motz
          </p>
          <h1
            className="text-foreground uppercase leading-none mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3.5rem, min(12vw, 10vh), 8rem)", fontWeight: 900, letterSpacing: "-0.01em" }}
          >
            ⚡ JUICE
            <br />
            <span style={{ color: "var(--accent)" }}>JACKING</span>
          </h1>
          <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(1.05rem, 2.4vw, 1.4rem)", fontWeight: 400 }}>
            Teste dein Wissen über USB-Sicherheit
          </p>
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="kiosk-action mt-[clamp(0.25rem,1.5vh,1rem)] flex items-center justify-center px-[clamp(1.75rem,5vw,2.5rem)] py-[clamp(1rem,2.2vh,1.25rem)] rounded-full border-2"
          style={{
            background: "rgba(245,230,66,0.08)",
            borderColor: "var(--accent)",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            fontWeight: 800,
            color: "var(--accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Hier tippen zum Starten →
        </motion.div>

        <p className="text-muted-foreground" style={{ fontSize: "clamp(0.8rem, 1.6vw, 0.9rem)" }}>
          5 Fragen · ca. 2 Minuten
        </p>
      </div>
    </div>
  );
}
