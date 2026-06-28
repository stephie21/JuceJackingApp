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
    <div className="kiosk-screen kiosk-pad flex flex-col max-w-6xl mx-auto [@media_(orientation:portrait)]:max-w-4xl [@media_(orientation:portrait)]:justify-center">
      {/* Progress bar */}
      <div className="flex items-center gap-4 mb-[clamp(1.5rem,4vh,2.5rem)]">
        <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(245,230,66,0.12)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--accent)" }}
            initial={{ width: `${(questionIndex / total) * 100}%` }}
            animate={{ width: `${((questionIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.9rem, 1.5vw, 0.95rem)", color: "var(--muted-foreground)", fontWeight: 600 }}>
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
          className="mb-[clamp(1.5rem,4vh,2.5rem)] text-foreground"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(2rem, min(5vw, 5vh), 3.2rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "0.01em",
          }}
        >
          {question.text}
        </h2>

        {/* Answer options */}
        <div className="quiz-options grid gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vh,2rem)]">
          {question.options.map((opt, i) => {
            const isSelected = selected === opt.key;
            const isRight = opt.key === question.correct;
            let borderColor = "rgba(245,230,66,0.2)";
            let bg = "var(--card)";
            let textColor = "var(--foreground)";

            if (answered) {
              if (isRight) {
                borderColor = "var(--success)";
                bg = "rgba(74,222,128,0.1)";
                textColor = "var(--success)";
              } else if (isSelected && !isRight) {
                borderColor = "var(--danger)";
                bg = "rgba(255,71,87,0.1)";
                textColor = "var(--danger)";
              } else {
                borderColor = "rgba(245,230,66,0.08)";
                textColor = "color-mix(in srgb, var(--muted-foreground) 58%, var(--background))";
              }
            } else if (isSelected) {
              borderColor = "var(--accent)";
              bg = "rgba(245,230,66,0.08)";
            }

            return (
              <motion.button
                key={opt.key}
                whileHover={!answered ? { scale: 1.02, borderColor: "var(--accent)" } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                onClick={() => !answered && onSelect(opt.key)}
                disabled={answered}
                className="flex min-h-[clamp(5rem,8vh,6.5rem)] items-center gap-[clamp(1rem,2vw,1.25rem)] rounded-2xl border-2 text-left transition-all"
                style={{
                  background: bg,
                  borderColor,
                  padding: "clamp(1rem, 2.2vw, 1.4rem) clamp(1.1rem, 3vw, 1.8rem)",
                  cursor: answered ? "default" : "pointer",
                }}
              >
                <span
                  className="shrink-0 flex items-center justify-center rounded-xl w-[clamp(3rem,6vw,3.5rem)] h-[clamp(3rem,6vw,3.5rem)]"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                    fontWeight: 900,
                    background: answered && isRight ? "rgba(74,222,128,0.2)" : answered && isSelected ? "rgba(255,71,87,0.2)" : "rgba(245,230,66,0.1)",
                    color: answered && isRight ? "var(--success)" : answered && isSelected && !isRight ? "var(--danger)" : "var(--accent)",
                    border: `1px solid ${answered && isRight ? "rgba(74,222,128,0.3)" : "rgba(245,230,66,0.2)"}`,
                  }}
                >
                  {KEY_LABELS[i]}
                </span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(1rem, 2.1vw, 1.15rem)", fontWeight: 500, color: textColor, lineHeight: 1.4 }}>
                  {opt.label}
                </span>
                {answered && isRight && (
                  <CheckCircle size={22} color="var(--success)" className="ml-auto shrink-0" />
                )}
                {answered && isSelected && !isRight && (
                  <XCircle size={22} color="var(--danger)" className="ml-auto shrink-0" />
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
              className="rounded-2xl p-[clamp(1rem,2.5vw,1.5rem)] mb-[clamp(1rem,2vh,1.5rem)] flex items-start gap-4"
              style={{
                background: isCorrect ? "rgba(74,222,128,0.08)" : "rgba(255,71,87,0.08)",
                border: `1px solid ${isCorrect ? "rgba(74,222,128,0.25)" : "rgba(255,71,87,0.25)"}`,
              }}
            >
              <div className="shrink-0 mt-0.5">
                {isCorrect ? (
                  <CheckCircle size={24} color="var(--success)" />
                ) : (
                  <XCircle size={24} color="var(--danger)" />
                )}
              </div>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.95rem, 1.8vw, 1rem)", fontWeight: 700, color: isCorrect ? "var(--success)" : "var(--danger)", marginBottom: "0.4rem" }}>
                  {isCorrect ? "Richtig!" : "Leider falsch."}
                </p>
                <p className="flex items-start gap-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.9rem, 1.7vw, 0.98rem)", color: "color-mix(in srgb, var(--foreground) 78%, var(--muted-foreground))", lineHeight: 1.5 }}>
                  <Lightbulb size={16} color="var(--accent)" className="shrink-0 mt-0.5" />
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
              className="kiosk-action self-stretch sm:self-end px-[clamp(2rem,4vw,2.5rem)] py-[clamp(0.9rem,2vh,1rem)] rounded-xl"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "clamp(1.25rem, 2.5vw, 1.4rem)",
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
