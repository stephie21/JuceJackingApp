import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

export interface Question {
  id: number;
  text: string;
  options: { key: string; label: string }[];
  correct: string;
  feedback: {
    correct: {
      why: string;
      mnemonic: string;
    };
    incorrect: {
      why: string;
      mnemonic: string;
    };
  };
}

interface QuizQuestionProps {
  question: Question;
  questionIndex: number;
  total: number;
  selected: string | null;
  onSelect: (key: string) => void;
  onNext: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
  cancelAction?: ReactNode;
}

const KEY_LABELS = ["A", "B", "C", "D"];

export function QuizQuestion({
  question,
  questionIndex,
  total,
  selected,
  onSelect,
  onNext,
  onBack,
  canGoBack = false,
  cancelAction,
}: QuizQuestionProps) {
  const answered = selected !== null;
  const isCorrect = selected === question.correct;
  const activeFeedback = isCorrect ? question.feedback.correct : question.feedback.incorrect;

  return (
    <div className="kiosk-screen kiosk-pad kiosk-page-shell quiz-screen">
      <header className="kiosk-header quiz-header kiosk-content">
        <div className="quiz-progress-cluster">
          <div className="quiz-progress-track">
            <motion.div
              className="quiz-progress-fill"
              initial={{ width: `${(questionIndex / total) * 100}%` }}
              animate={{ width: `${((questionIndex + 1) / total) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className="quiz-progress-count">
            {questionIndex + 1} / {total}
          </span>
        </div>
        {cancelAction && <div className="quiz-cancel-slot">{cancelAction}</div>}
      </header>

      <motion.main
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="kiosk-main quiz-main kiosk-content"
      >
        <h2 className="quiz-question-title">{question.text}</h2>

        <div className="quiz-options">
          {question.options.map((opt, i) => {
            const isSelected = selected === opt.key;
            const isRight = opt.key === question.correct;
            let borderColor = "color-mix(in srgb, var(--accent) 20%, transparent)";
            let bg = "var(--card)";
            let textColor = "var(--foreground)";

            if (answered) {
              if (isRight) {
                borderColor = "var(--success)";
                bg = "color-mix(in srgb, var(--success) 10%, transparent)";
                textColor = "var(--success)";
              } else if (isSelected && !isRight) {
                borderColor = "var(--danger)";
                bg = "color-mix(in srgb, var(--danger) 10%, transparent)";
                textColor = "var(--danger)";
              } else {
                borderColor = "color-mix(in srgb, var(--accent) 8%, transparent)";
                textColor = "color-mix(in srgb, var(--muted-foreground) 58%, var(--background))";
              }
            } else if (isSelected) {
              borderColor = "var(--accent)";
              bg = "color-mix(in srgb, var(--accent) 8%, transparent)";
            }

            return (
              <motion.button
                key={opt.key}
                whileHover={!answered ? { scale: 1.02, borderColor: "var(--accent)" } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                onClick={() => !answered && onSelect(opt.key)}
                disabled={answered}
                className="quiz-answer-button"
                style={{
                  background: bg,
                  borderColor,
                  color: textColor,
                  cursor: answered ? "default" : "pointer",
                }}
              >
                <span
                  className="quiz-answer-key"
                  style={{
                    background: answered && isRight ? "color-mix(in srgb, var(--success) 20%, transparent)" : answered && isSelected ? "color-mix(in srgb, var(--danger) 20%, transparent)" : "color-mix(in srgb, var(--accent) 10%, transparent)",
                    color: answered && isRight ? "var(--success)" : answered && isSelected && !isRight ? "var(--danger)" : "var(--accent)",
                    borderColor: answered && isRight ? "color-mix(in srgb, var(--success) 30%, transparent)" : "color-mix(in srgb, var(--accent) 20%, transparent)",
                  }}
                >
                  {KEY_LABELS[i]}
                </span>
                <span className="quiz-answer-label">{opt.label}</span>
                {answered && isRight && <CheckCircle className="quiz-result-icon" color="var(--success)" />}
                {answered && isSelected && !isRight && <XCircle className="quiz-result-icon" color="var(--danger)" />}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="quiz-feedback-card"
              style={{
                background: isCorrect ? "color-mix(in srgb, var(--success) 8%, transparent)" : "color-mix(in srgb, var(--danger) 8%, transparent)",
                borderColor: isCorrect ? "color-mix(in srgb, var(--success) 25%, transparent)" : "color-mix(in srgb, var(--danger) 25%, transparent)",
              }}
            >
              <div className="quiz-feedback-icon">
                {isCorrect ? <CheckCircle color="var(--success)" /> : <XCircle color="var(--danger)" />}
              </div>
              <div className="quiz-feedback-body">
                <p className="quiz-feedback-result" style={{ color: isCorrect ? "var(--success)" : "var(--danger)" }}>
                  {isCorrect ? "✅ Richtig!" : "❌ Leider nicht richtig."}
                </p>
                <div className="quiz-feedback-copy">
                  <section className="quiz-feedback-section">
                    <h3>Warum?</h3>
                    <p>{activeFeedback.why}</p>
                  </section>
                  <section className="quiz-feedback-section">
                    <h3>Merke dir</h3>
                    <p>
                      <Lightbulb color="var(--accent)" />
                      {activeFeedback.mnemonic}
                    </p>
                  </section>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <footer className="kiosk-action-zone quiz-action-zone kiosk-content">
        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="quiz-action-row"
            >
              {canGoBack && onBack && (
                <motion.button
                  type="button"
                  onClick={onBack}
                  className="kiosk-action quiz-back-action"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ← Zurück
                </motion.button>
              )}
              <motion.button
                type="button"
                onClick={onNext}
                className="kiosk-action quiz-next-action"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {questionIndex + 1 < total ? "Weiter →" : "Ergebnis anzeigen →"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </div>
  );
}
