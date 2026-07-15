import { motion, useReducedMotion } from "motion/react";
import {
  BatteryCharging,
  Cable,
  PlugZap,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface ProtectionPosterScreenProps {
  onRestart: () => void;
}

interface ProtectionMeasure {
  number: number;
  title: string;
  description?: string;
  Icon: LucideIcon;
  wide?: boolean;
}

const PROTECTION_MEASURES: ProtectionMeasure[] = [
  {
    number: 1,
    title: "Eigenes Netzteil verwenden",
    description: "— An einer normalen Steckdose laden",
    Icon: PlugZap,
  },
  {
    number: 2,
    title: "Powerbank nutzen",
    Icon: BatteryCharging,
  },
  {
    number: 3,
    title: "USB Data Blocker verwenden",
    Icon: ShieldCheck,
  },
  {
    number: 4,
    title: "Keine fremden USB-Kabel verwenden",
    Icon: Cable,
  },
  {
    number: 5,
    title: "„Diesem Computer vertrauen?“",
    description: "→ Nein",
    Icon: Smartphone,
  },
  {
    number: 6,
    title: "Smartphone aktuell halten",
    Icon: RefreshCw,
  },
  {
    number: 7,
    title: "Kabellos laden, wenn möglich",
    Icon: Zap,
    wide: true,
  },
];

export function ProtectionPosterScreen({ onRestart }: ProtectionPosterScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="kiosk-screen kiosk-pad kiosk-page-shell protection-poster-screen">
      <header className="kiosk-header protection-poster-header kiosk-content">
        <h1>So schützt du dich vor Juice Jacking</h1>
        <p>Die wichtigsten Schutzmaßnahmen auf einen Blick</p>
      </header>

      <main className="kiosk-main protection-poster-main kiosk-content" aria-label="Schutzmaßnahmen gegen Juice Jacking">
        <section className="protection-card-grid" aria-label="Sieben Schutzmaßnahmen">
          {PROTECTION_MEASURES.map((measure, index) => (
            <motion.article
              key={measure.number}
              className={measure.wide ? "protection-card protection-card-wide" : "protection-card"}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0, delay: 0 }
                  : { duration: 0.28, delay: index * 0.045, ease: "easeOut" }
              }
            >
              <div className="protection-card-mark" aria-hidden="true">
                <span className="protection-card-number">{measure.number}</span>
                <measure.Icon className="protection-card-icon" color="var(--accent)" strokeWidth={2.4} />
              </div>
              <div className="protection-card-copy">
                <h2>{measure.title}</h2>
                {measure.description && <p>{measure.description}</p>}
              </div>
            </motion.article>
          ))}
        </section>
      </main>

      <footer className="kiosk-action-zone protection-poster-action-zone kiosk-content">
        <motion.button
          type="button"
          onClick={onRestart}
          className="kiosk-action protection-poster-restart-action"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Nochmal spielen
        </motion.button>
      </footer>
    </div>
  );
}
