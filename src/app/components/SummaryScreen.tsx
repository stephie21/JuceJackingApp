import { motion } from "motion/react";
import { Zap, ShieldCheck, Wifi, Battery } from "lucide-react";

interface SummaryScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const PROTECTION_TIPS = [
  { icon: <ShieldCheck size={28} color="#f5e642" />, label: "Schutz #1", text: "Eigenes Netzteil + normale Steckdose nutzen" },
  { icon: <Zap size={28} color="#f5e642" />, label: "Schutz #2", text: 'USB Data Blocker verwenden (~5–15 €)' },
  { icon: <Battery size={28} color="#f5e642" />, label: "Schutz #3", text: "Wireless Charging oder Powerbank nutzen" },
];

export function SummaryScreen({ score, total, onRestart }: SummaryScreenProps) {
  const pct = Math.round((score / total) * 100);
  const passed = score >= 4;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-16 py-12 max-w-5xl mx-auto">
      {/* Score circle */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="flex flex-col items-center justify-center rounded-full mb-10"
        style={{
          width: 180,
          height: 180,
          background: passed ? "rgba(74,222,128,0.1)" : "rgba(255,71,87,0.1)",
          border: `3px solid ${passed ? "#4ade80" : "#ff4757"}`,
        }}
      >
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "4rem", fontWeight: 900, color: passed ? "#4ade80" : "#ff4757", lineHeight: 1 }}>
          {score}/{total}
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#8888a0", fontWeight: 500 }}>
          {pct}% richtig
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-10"
      >
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 900,
            color: "#f0f0f5",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          {passed ? "✅ Gut gemacht!" : "⚡ Noch mal üben!"}
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "#8888a0" }}>
          Juice Jacking · Datendiebstahl & Malware über öffentliche USB-Stationen
        </p>
      </motion.div>

      {/* Protection tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full grid grid-cols-3 gap-4 mb-10"
      >
        {PROTECTION_TIPS.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "#111218", border: "1px solid rgba(245,230,66,0.15)" }}
          >
            <div className="flex items-center gap-3">
              {tip.icon}
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#f5e642", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {tip.label}
              </span>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#c0c0d0", lineHeight: 1.5 }}>
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
        className="flex items-center gap-3 mb-10 px-6 py-3 rounded-xl"
        style={{ background: "rgba(245,230,66,0.07)", border: "1px solid rgba(245,230,66,0.2)" }}
      >
        <Wifi size={18} color="#f5e642" />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#c0c0d0" }}>
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
          className="px-12 py-4 rounded-xl"
          style={{
            background: "#f5e642",
            color: "#08090d",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1.5rem",
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
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#555566" }}>
          Kurs: Usable Security · Barbara Böhm & Stephanie Motz
        </p>
      </motion.div>
    </div>
  );
}
