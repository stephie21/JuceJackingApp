import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";

export interface Question {
  id: number;
  text: string;
  options: { key: string; label: string }[];
  correct: string;
  explanation: string;
}

interface QuizQuestionProps {
  question: Question;
  questionIndex: number;
  total: number;
  selected: string | null;
  onSelect: (key: string) => void;
  onNext: () => void;
}

const KEY_LABELS = ["A", "B", "C", "D"];

export function QuizQuestion({ question, questionIndex, total, selected, onSelect, onNext }: QuizQuestionProps) {
  const answered = selected !== null;
  const isCorrect = selected === question.correct;

  return (
    <div className="w-full h-full flex flex-col px-16 py-12 max-w-5xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(245,230,66,0.12)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#f5e642" }}
            initial={{ width: `${(questionIndex / total) * 100}%` }}
            animate={{ width: `${((questionIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#8888a0", fontWeight: 600 }}>
          {questionIndex + 1} / {total}
        </span>
      </div>

      {/* Question */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 flex flex-col"
      >
        <h2
          className="mb-10 text-foreground"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "0.01em",
          }}
        >
          {question.text}
        </h2>

        {/* Answer options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {question.options.map((opt, i) => {
            const isSelected = selected === opt.key;
            const isRight = opt.key === question.correct;
            let borderColor = "rgba(245,230,66,0.2)";
            let bg = "rgba(17,18,24,1)";
            let textColor = "#f0f0f5";

            if (answered) {
              if (isRight) {
                borderColor = "#4ade80";
                bg = "rgba(74,222,128,0.1)";
                textColor = "#4ade80";
              } else if (isSelected && !isRight) {
                borderColor = "#ff4757";
                bg = "rgba(255,71,87,0.1)";
                textColor = "#ff4757";
              } else {
                borderColor = "rgba(245,230,66,0.08)";
                textColor = "#555566";
              }
            } else if (isSelected) {
              borderColor = "#f5e642";
              bg = "rgba(245,230,66,0.08)";
            }

            return (
              <motion.button
                key={opt.key}
                whileHover={!answered ? { scale: 1.02, borderColor: "#f5e642" } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                onClick={() => !answered && onSelect(opt.key)}
                disabled={answered}
                className="flex items-center gap-5 rounded-2xl border-2 text-left transition-all"
                style={{
                  background: bg,
                  borderColor,
                  padding: "1.4rem 1.8rem",
                  cursor: answered ? "default" : "pointer",
                }}
              >
                <span
                  className="shrink-0 flex items-center justify-center rounded-xl w-12 h-12"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    background: answered && isRight ? "rgba(74,222,128,0.2)" : answered && isSelected ? "rgba(255,71,87,0.2)" : "rgba(245,230,66,0.1)",
                    color: answered && isRight ? "#4ade80" : answered && isSelected && !isRight ? "#ff4757" : "#f5e642",
                    border: `1px solid ${answered && isRight ? "rgba(74,222,128,0.3)" : "rgba(245,230,66,0.2)"}`,
                  }}
                >
                  {KEY_LABELS[i]}
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.1rem", fontWeight: 500, color: textColor, lineHeight: 1.4 }}>
                  {opt.label}
                </span>
                {answered && isRight && (
                  <CheckCircle size={22} color="#4ade80" className="ml-auto shrink-0" />
                )}
                {answered && isSelected && !isRight && (
                  <XCircle size={22} color="#ff4757" className="ml-auto shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback & explanation */}
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl p-6 mb-6 flex items-start gap-4"
              style={{
                background: isCorrect ? "rgba(74,222,128,0.08)" : "rgba(255,71,87,0.08)",
                border: `1px solid ${isCorrect ? "rgba(74,222,128,0.25)" : "rgba(255,71,87,0.25)"}`,
              }}
            >
              <div className="shrink-0 mt-0.5">
                {isCorrect ? (
                  <CheckCircle size={24} color="#4ade80" />
                ) : (
                  <XCircle size={24} color="#ff4757" />
                )}
              </div>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 700, color: isCorrect ? "#4ade80" : "#ff4757", marginBottom: "0.4rem" }}>
                  {isCorrect ? "Richtig!" : "Leider falsch."}
                </p>
                <p className="flex items-start gap-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#c0c0d0", lineHeight: 1.5 }}>
                  <Lightbulb size={16} color="#f5e642" className="shrink-0 mt-0.5" />
                  {question.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button */}
        <AnimatePresence>
          {answered && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              onClick={onNext}
              className="self-end px-10 py-4 rounded-xl"
              style={{
                background: "#f5e642",
                color: "#08090d",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: "none",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {questionIndex + 1 < total ? "Weiter →" : "Ergebnis anzeigen →"}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
