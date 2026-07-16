import { motion } from "motion/react";
import { Zap, ShieldCheck, Wifi, Battery } from "lucide-react";

interface SummaryScreenProps {
  score: number;
  total: number;
  finalMode?: boolean;
  onContinueToPart2?: () => void;
  onContinueToProtectionTips?: () => void;
}

const PROTECTION_TIPS = [
  { Icon: ShieldCheck, label: "Schutz #1", text: "Eigenes Netzteil + normale Steckdose nutzen" },
  { Icon: Zap, label: "Schutz #2", text: "USB Data Blocker verwenden (~5–15 €)" },
  { Icon: Battery, label: "Schutz #3", text: "Wireless Charging oder Powerbank nutzen" },
];

export function SummaryScreen({
  score,
  total,
  finalMode = false,
  onContinueToPart2,
  onContinueToProtectionTips,
}: SummaryScreenProps) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 80;
  const actionLabel = finalMode ? "Weiter zu den Schutzmaßnahmen" : "Weiter zu Teil 2";
  const actionHandler = finalMode ? onContinueToProtectionTips : onContinueToPart2;

  return (
    <div className="kiosk-screen kiosk-pad kiosk-page-shell summary-screen">
      <main className="kiosk-main summary-main kiosk-content">
        <section className="summary-hero-stack" aria-label={finalMode ? "Quiz abgeschlossen" : "Teil 1 abgeschlossen"}>
          <div className="summary-header">
            <span>{finalMode ? "Quiz abgeschlossen" : "Teil 1 abgeschlossen"}</span>
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="summary-score-circle"
            style={{
              background: passed ? "color-mix(in srgb, var(--success) 10%, transparent)" : "color-mix(in srgb, var(--danger) 10%, transparent)",
              borderColor: passed ? "var(--success)" : "var(--danger)",
            }}
          >
            <span className="summary-score-value" style={{ color: passed ? "var(--success)" : "var(--danger)" }}>
              {score}/{total}
            </span>
            <span className="summary-score-label">{pct}% richtig</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="summary-copy"
          >
            <h1>{passed ? "✅ Gut gemacht!" : "⚡ Noch mal üben!"}</h1>
            <p>
              {finalMode
                ? "Du hast beide Szenarien abgeschlossen und kennst sichere Alternativen für unterwegs."
                : "Du kennst jetzt die wichtigsten Schutzmaßnahmen an öffentlichen USB-Ladestationen."}
            </p>
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="summary-tips-grid"
        >
          {PROTECTION_TIPS.map((tip, i) => (
            <motion.div
              key={tip.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="summary-tip-card"
            >
              <div className="summary-tip-heading">
                <tip.Icon className="summary-tip-icon" color="var(--accent)" />
                <span>{tip.label}</span>
              </div>
              <p>{tip.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="summary-location-note"
        >
          <Wifi className="summary-location-icon" color="var(--accent)" />
          <span>Orte mit fremden Ladepunkten: Flughafen · Bahnhof · Hotel · Einkaufszentrum</span>
        </motion.div>
      </main>

      <footer className="kiosk-action-zone summary-action-zone kiosk-content">
        <motion.button
          type="button"
          onClick={() => actionHandler?.()}
          className="kiosk-action summary-protection-action summary-single-action"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {actionLabel}
        </motion.button>
        <p>Kurs: Usable Security · Barbara Böhm & Stephanie Motz</p>
      </footer>
    </div>
  );
}
