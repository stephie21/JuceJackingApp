import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AttractScreen } from "./components/AttractScreen";
import { QuizQuestion, type Question } from "./components/QuizQuestion";
import { VideoPlaceholder } from "./components/VideoPlaceholder";
import { SummaryScreen } from "./components/SummaryScreen";

{/* MARKER-MAKE-KIT-INVOKED */}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Wo passiert Juice Jacking?",
    options: [
      { key: "A", label: "An öffentlichen USB-Ladestationen, zum Beispiel am Flughafen oder Bahnhof" },
      { key: "B", label: "Nur zu Hause am eigenen Netzteil" },
      { key: "C", label: "Ausschließlich beim kabellosen Laden" },
      { key: "D", label: "Nur wenn das Smartphone im Flugmodus ist" },
    ],
    correct: "A",
    explanation: "Juice Jacking ist vor allem an fremden, öffentlichen USB-Ladestationen ein Risiko, weil dort Strom und Datenübertragung über denselben Anschluss laufen.",
  },
  {
    id: 2,
    text: "Welche Risiken gehen von Juice Jacking aus?",
    options: [
      { key: "A", label: "Nur ein langsamerer Ladevorgang" },
      { key: "B", label: "Datendiebstahl und das Einschleusen von Malware" },
      { key: "C", label: "Ein dauerhaft beschädigter Akku" },
      { key: "D", label: "Nur eine höhere Mobilfunkrechnung" },
    ],
    correct: "B",
    explanation: "Manipulierte USB-Anschlüsse oder Ladekabel können Datenübertragung ausnutzen, um Informationen abzugreifen oder Schadsoftware zu installieren.",
  },
  {
    id: 3,
    text: "Wie schützt du dich am besten?",
    options: [
      { key: "A", label: "Eigenes Netzteil an einer Steckdose oder einen USB Data Blocker nutzen" },
      { key: "B", label: "Das Smartphone beim Laden in der Hand behalten" },
      { key: "C", label: "Nur ein fremdes Ladekabel verwenden, wenn es kurz ist" },
      { key: "D", label: "Öffentliche USB-Ladestationen nur nachts verwenden" },
    ],
    correct: "A",
    explanation: "Am sichersten ist ein eigenes Netzteil an einer Steckdose. Ein USB Data Blocker blockiert zusätzlich die Datenübertragung.",
  },
  {
    id: 4,
    text: "Was ist Juice Jacking?",
    options: [
      { key: "A", label: "Eine besonders schnelle Ladetechnik für Smartphones" },
      { key: "B", label: "Ein Angriff über USB, bei dem Laden und Datenübertragung missbraucht werden" },
      { key: "C", label: "Eine App, die den Akku überwacht" },
      { key: "D", label: "Ein Problem, das nur bei WLAN-Verbindungen entsteht" },
    ],
    correct: "B",
    explanation: "Bei Juice Jacking wird ausgenutzt, dass USB-Anschlüsse nicht nur Strom liefern, sondern auch Daten übertragen können.",
  },
  {
    id: 5,
    text: "Was ist ein USB Data Blocker?",
    options: [
      { key: "A", label: "Eine App, die USB-Verbindungen überwacht" },
      { key: "B", label: "Ein Adapter, der Strom durchlässt und Datenübertragung blockiert" },
      { key: "C", label: "Ein Ladekabel, das automatisch schneller lädt" },
      { key: "D", label: "Eine Einstellung, die öffentliche USB-Ladestationen erkennt" },
    ],
    correct: "B",
    explanation: "Ein USB Data Blocker sitzt zwischen Ladekabel und Anschluss. Er lässt Strom durch, trennt aber die Datenleitungen.",
  },
];

type Screen = "attract" | "quiz" | "video" | "summary";

const IDLE_TIMEOUT = 45_000;
function isStoryboardMode() {
  if (typeof window === "undefined") return false;
  const searchParams = new URLSearchParams(window.location.search);
  return window.location.pathname === "/storyboard" || searchParams.get("mode") === "storyboard";
}

export default function App() {
  if (isStoryboardMode()) {
    return <StoryboardMode />;
  }

  return <InteractiveQuizApp />;
}

function InteractiveQuizApp() {
  const [screen, setScreen] = useState<Screen>("attract");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToAttract = useCallback(() => {
    setScreen("attract");
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(resetToAttract, IDLE_TIMEOUT);
  }, [resetToAttract]);

  useEffect(() => {
    if (screen === "attract") {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      return;
    }
    resetIdleTimer();
    const events = ["pointerdown", "keydown", "mousemove"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [screen, resetIdleTimer]);

  const handleStart = () => {
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setScreen("video");
  };

  const handleSelect = (key: string) => {
    setSelected(key);
    if (key === QUESTIONS[questionIndex].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const isLast = questionIndex + 1 >= QUESTIONS.length;
    if (isLast) {
      setScreen("summary");
    } else {
      setQuestionIndex((index) => index + 1);
      setSelected(null);
      setScreen("video");
    }
  };

  const handleVideoComplete = () => {
    setSelected(null);
    setScreen("quiz");
  };

  return (
    <div
      className="w-full h-full bg-background text-foreground overflow-hidden"
      style={{ minHeight: "100dvh", position: "relative" }}
    >
      <AnimatePresence mode="wait">
        {screen === "attract" && (
          <motion.div
            key="attract"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AttractScreen onStart={handleStart} />
          </motion.div>
        )}

        {screen === "quiz" && (
          <motion.div
            key={`quiz-${questionIndex}`}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute top-[clamp(1rem,3vh,1.5rem)] left-[clamp(1rem,3vw,2rem)] z-20 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.72rem,1.4vw,0.8rem)", color: "color-mix(in srgb, var(--muted-foreground) 58%, var(--background))", fontWeight: 600 }}
            >
              <span style={{ color: "var(--accent)" }}>⚡</span>
              JUICE JACKING
            </div>
            <QuizQuestion
              question={QUESTIONS[questionIndex]}
              questionIndex={questionIndex}
              total={QUESTIONS.length}
              selected={selected}
              onSelect={handleSelect}
              onNext={handleNext}
            />
          </motion.div>
        )}

        {screen === "video" && (
          <motion.div
            key={`video-${questionIndex}`}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Corner label */}
            <div
              className="absolute top-[clamp(1rem,3vh,1.5rem)] left-[clamp(1rem,3vw,2rem)] z-20 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.72rem,1.4vw,0.8rem)", color: "color-mix(in srgb, var(--muted-foreground) 58%, var(--background))", fontWeight: 600 }}
            >
              <span style={{ color: "var(--accent)" }}>⚡</span>
              JUICE JACKING
            </div>
            <VideoPlaceholder videoIndex={questionIndex} onComplete={handleVideoComplete} />
          </motion.div>
        )}

        {screen === "summary" && (
          <motion.div
            key="summary"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SummaryScreen score={score} total={QUESTIONS.length} onRestart={resetToAttract} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryboardMode() {
  const exampleQuestion = QUESTIONS[0];
  const wrongExampleAnswer = exampleQuestion.options.find((option) => option.key !== exampleQuestion.correct)?.key ?? null;

  return (
    <main className="storyboard-root">
      <StoryboardPage title="Screen 1: Startscreen">
        <AttractScreen onStart={() => undefined} />
      </StoryboardPage>

      <StoryboardPage title="Screen 2: Video-Screen">
        <QuizStoryboardFrame>
          <VideoPlaceholder videoIndex={0} onComplete={() => undefined} staticMode />
        </QuizStoryboardFrame>
      </StoryboardPage>

      <StoryboardPage title="Screen 3: Quiz-Screen">
        <QuizStoryboardFrame>
          <QuizQuestion
            question={exampleQuestion}
            questionIndex={0}
            total={QUESTIONS.length}
            selected={null}
            onSelect={() => undefined}
            onNext={() => undefined}
          />
        </QuizStoryboardFrame>
      </StoryboardPage>

      <StoryboardPage title="Screen 4: Feedback-Screen">
        <QuizStoryboardFrame>
          <QuizQuestion
            question={exampleQuestion}
            questionIndex={0}
            total={QUESTIONS.length}
            selected={wrongExampleAnswer}
            onSelect={() => undefined}
            onNext={() => undefined}
          />
        </QuizStoryboardFrame>
      </StoryboardPage>

      <StoryboardPage title="Screen 5: Summary-Screen">
        <SummaryScreen score={4} total={QUESTIONS.length} onRestart={() => undefined} />
      </StoryboardPage>
    </main>
  );
}

interface StoryboardPageProps {
  title: string;
  children: ReactNode;
}

function StoryboardPage({ title, children }: StoryboardPageProps) {
  return (
    <section className="storyboard-page" aria-label={title}>
      <div className="storyboard-screen-label">{title}</div>
      <div className="storyboard-stage">{children}</div>
    </section>
  );
}

interface QuizStoryboardFrameProps {
  children: ReactNode;
}

function QuizStoryboardFrame({ children }: QuizStoryboardFrameProps) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div
        className="absolute top-6 left-8 flex items-center gap-2"
        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "var(--muted-foreground)", fontWeight: 600 }}
      >
        <span style={{ color: "var(--accent)" }}>⚡</span>
        JUICE JACKING
      </div>
      {children}
    </div>
  );
}

