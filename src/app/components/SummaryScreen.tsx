import { motion } from "motion/react";
import { Zap, ShieldCheck, Wifi, Battery } from "lucide-react";

interface SummaryScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const PROTECTION_TIPS = [
  { icon: <ShieldCheck size={28} color="var(--accent)" />, label: "Schutz #1", text: "Eigenes Netzteil + normale Steckdose nutzen" },
  { icon: <Zap size={28} color="var(--accent)" />, label: "Schutz #2", text: 'USB Data Blocker verwenden (~5–15 €)' },
  { icon: <Battery size={28} color="var(--accent)" />, label: "Schutz #3", text: "Wireless Charging oder Powerbank nutzen" },
];

export function SummaryScreen({ score, total, onRestart }: SummaryScreenProps) {
  const pct = Math.round((score / total) * 100);
  const passed = score >= 4;

  return (
    <div className="kiosk-screen kiosk-pad flex flex-col items-center justify-center max-w-6xl mx-auto [@media_(orientation:portrait)]:max-w-4xl">
      {/* Score circle */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="flex flex-col items-center justify-center rounded-full mb-[clamp(1.5rem,4vh,2.5rem)]"
        style={{
          width: "clamp(8.75rem, 17vw, 11.25rem)",
          height: "clamp(8.75rem, 17vw, 11.25rem)",
          background: passed ? "rgba(74,222,128,0.1)" : "rgba(255,71,87,0.1)",
          border: `3px solid ${passed ? "var(--success)" : "var(--danger)"}`,
        }}
      >
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3.1rem, 7vw, 4rem)", fontWeight: 900, color: passed ? "var(--success)" : "var(--danger)", lineHeight: 1 }}>
          {score}/{total}
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.78rem, 1.4vw, 0.85rem)", color: "var(--muted-foreground)", fontWeight: 500 }}>
          {pct}% richtig
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-[clamp(1.5rem,4vh,2.5rem)]"
      >
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(2.4rem, min(7vw, 6vh), 4.5rem)",
            fontWeight: 900,
            color: "var(--foreground)",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          {passed ? "✅ Gut gemacht!" : "⚡ Noch mal üben!"}
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.95rem, 2vw, 1.05rem)", color: "var(--muted-foreground)" }}>
          Juice Jacking · Datendiebstahl & Malware über öffentliche USB-Stationen
        </p>
      </motion.div>

      {/* Protection tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="summary-tips-grid w-full grid gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1.5rem,4vh,2.5rem)]"
      >
        {PROTECTION_TIPS.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="rounded-2xl p-[clamp(1rem,2vw,1.25rem)] flex flex-col gap-3 [@media_(orientation:portrait)]:flex-row [@media_(orientation:portrait)]:items-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3">
              {tip.icon}
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(0.95rem,1.8vw,1rem)", fontWeight: 800, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {tip.label}
              </span>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.9rem,1.7vw,0.98rem)", color: "color-mix(in srgb, var(--foreground) 78%, var(--muted-foreground))", lineHeight: 1.5 }}>
              {tip.text}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Location note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex max-w-full items-center gap-3 mb-[clamp(1.5rem,4vh,2.5rem)] px-[clamp(1rem,3vw,1.5rem)] py-3 rounded-xl text-center"
        style={{ background: "rgba(245,230,66,0.07)", border: "1px solid rgba(245,230,66,0.2)" }}
      >
        <Wifi size={18} color="var(--accent)" className="shrink-0" />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.84rem,1.6vw,0.92rem)", color: "color-mix(in srgb, var(--foreground) 78%, var(--muted-foreground))" }}>
          Typische Angriffsorte: Flughafen · Bahnhof · Hotel · Einkaufszentrum
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.button
          onClick={onRestart}
          className="kiosk-action px-[clamp(2.5rem,6vw,3rem)] py-[clamp(0.95rem,2vh,1rem)] rounded-xl"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(1.3rem,3vw,1.5rem)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: "pointer",
            border: "none",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Nochmal spielen ↺
        </motion.button>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.78rem,1.4vw,0.85rem)", color: "color-mix(in srgb, var(--muted-foreground) 58%, var(--background))" }}>
          Kurs: Usable Security · Barbara Böhm & Stephanie Motz
        </p>
      </motion.div>
    </div>
  );
}
