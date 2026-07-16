import { motion } from "motion/react";
import { Zap } from "lucide-react";

interface AttractScreenProps {
  onStart: () => void;
}

export function AttractScreen({ onStart }: AttractScreenProps) {
  return (
    <div
      className="kiosk-screen kiosk-page-shell attract-screen cursor-pointer select-none relative overflow-hidden"
      onClick={onStart}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onStart()}
      role="button"
      tabIndex={0}
    >
      <div className="attract-grid" />

      <motion.div
        className="attract-glow"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="kiosk-header attract-header kiosk-content">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="attract-icon-orb"
        >
          <Zap className="attract-icon" color="var(--accent)" fill="var(--accent)" />
        </motion.div>
        <p className="attract-kicker">Usable Security · Barbara Böhm & Stephanie Motz</p>
      </header>

      <main className="kiosk-main attract-main kiosk-content">
        <h1 className="attract-title">
          <span className="attract-title-line">
            <span className="attract-title-bolt">⚡</span>
            JUICE
          </span>
          <br />
          <span>JACKING</span>
        </h1>
        <p className="attract-subtitle">Lerne, wie du dein Smartphone unterwegs sicher lädst.</p>
      </main>

      <footer className="kiosk-action-zone attract-action-zone kiosk-content">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="kiosk-action attract-primary-action"
        >
          Hier tippen zum Starten →
        </motion.div>

        <p className="attract-meta">10 Fragen · ca. 4 Minuten</p>
      </footer>
    </div>
  );
}
