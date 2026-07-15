import { motion, useReducedMotion } from "motion/react";
import { Cable, Play } from "lucide-react";

interface TransitionScreenProps {
  onStartVideo: () => void;
}

export function TransitionScreen({ onStartVideo }: TransitionScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="kiosk-screen kiosk-pad kiosk-page-shell transition-screen">
      <header className="kiosk-header transition-header kiosk-content">
        <span>Neues Szenario</span>
        <h1>Teil 2</h1>
      </header>

      <motion.main
        className="kiosk-main transition-main kiosk-content"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.36, ease: "easeOut" }}
      >
        <div className="transition-icon-orb" aria-hidden="true">
          <Cable className="transition-icon" color="var(--accent)" />
        </div>
        <div className="transition-copy">
          <h2>Ein fremdes USB-Kabel</h2>
          <p>Du bist unterwegs und erhältst ein USB-Kabel von einer fremden Person.</p>
          <strong>Wie würdest du reagieren?</strong>
        </div>
      </motion.main>

      <footer className="kiosk-action-zone transition-action-zone kiosk-content">
        <motion.button
          type="button"
          onClick={onStartVideo}
          className="kiosk-action transition-primary-action"
          whileHover={{ scale: 1.04, borderColor: "var(--accent)" }}
          whileTap={{ scale: 0.97 }}
        >
          <Play className="transition-button-icon" fill="var(--accent-foreground)" />
          Video starten
        </motion.button>
      </footer>
    </div>
  );
}
