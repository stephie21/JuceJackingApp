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
    text: "Was ist Juice Jacking?",
    options: [
      { key: "A", label: "Eine neue schnelle Ladetechnik für Smartphones" },
      { key: "B", label: "Ein Angriff über öffentliche USB-Ladestationen zum Stehlen von Daten" },
      { key: "C", label: "Ein Virus, der sich über WLAN verbreitet" },
      { key: "D", label: "Eine App, die den Akku schneller lädt" },
    ],
    correct: "B",
    explanation: "Juice Jacking nutzt den USB-Standard aus – derselbe Anschluss überträgt sowohl Strom als auch Daten.",
  },
  {
    id: 2,
    text: "Wo passiert Juice Jacking typischerweise?",
    options: [
      { key: "A", label: "Zuhause am eigenen Ladekabel" },
      { key: "B", label: "Beim Laden über den Laptop eines Freundes" },
      { key: "C", label: "An öffentlichen USB-Ladestationen z. B. am Flughafen" },
      { key: "D", label: "Beim kabellosen Laden (Wireless Charging)" },
    ],
    correct: "C",
    explanation: "Öffentliche Stationen an Flughäfen, Bahnhöfen und Hotels sind klassische Angriffsorte.",
  },
  {
    id: 3,
    text: "Wie schützt du dich am besten vor Juice Jacking?",
    options: [
      { key: "A", label: "Handy beim Laden ausschalten" },
      { key: "B", label: "Nur maximal 1 Minute laden" },
      { key: "C", label: "Flugmodus aktivieren beim Laden" },
      { key: "D", label: "Eigenes Netzteil + Steckdose oder einen USB Data Blocker nutzen" },
    ],
    correct: "D",
    explanation: 'Ein USB Data Blocker ("USB Kondom") lässt nur Strom durch und blockiert alle Datenleitungen.',
  },
  {
    id: 4,
    text: "Was kann ein Angreifer durch Juice Jacking tun?",
    options: [
      { key: "A", label: "Nur den Akku schneller entladen" },
      { key: "B", label: "Nur Fotos stehlen" },
      { key: "C", label: "Gar nichts – Juice Jacking ist nur ein Mythos" },
      { key: "D", label: "Daten stehlen UND Malware auf dem Gerät installieren" },
    ],
    correct: "D",
    explanation: "Moderne Angriffe können im Hintergrund Kontakte, Fotos, Passwörter auslesen und Schadsoftware installieren.",
  },
  {
    id: 5,
    text: "Was ist ein USB Data Blocker?",
    options: [
      { key: "A", label: "Eine App, die USB-Verbindungen blockiert" },
      { key: "B", label: "Ein kleines Gerät, das nur Strom durchlässt, aber keine Daten" },
      { key: "C", label: "Eine spezielle Sicherheitseinstellung im iPhone" },
      { key: "D", label: "Ein sicheres USB-Kabel von Apple" },
    ],
    correct: "B",
    explanation: "Data Blocker kosten ca. 5–15 € und sind der einfachste physische Schutz beim Laden an fremden Stationen.",
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
  // videoIndex tracks which video to show (matches the question that was just answered)
  const [videoIndex, setVideoIndex] = useState(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToAttract = useCallback(() => {
    setScreen("attract");
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setVideoIndex(0);
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
    setScreen("quiz");
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setVideoIndex(0);
  };

  const handleSelect = (key: string) => {
    setSelected(key);
    if (key === QUESTIONS[questionIndex].correct) {
      setScore((s) => s + 1);
    }
  };

  // After answering: show video before next question (or summary on last)
  const handleNext = () => {
    const isLast = questionIndex + 1 >= QUESTIONS.length;
    setVideoIndex(questionIndex);
    if (isLast) {
      // Show video then go to summary
      setScreen("video");
    } else {
      setScreen("video");
    }
  };

  const handleVideoComplete = () => {
    const isLast = questionIndex + 1 >= QUESTIONS.length;
    if (isLast) {
      setScreen("summary");
    } else {
      setQuestionIndex((i) => i + 1);
      setSelected(null);
      setScreen("quiz");
    }
  };

  return (
    <div
      className="w-full h-full bg-background text-foreground overflow-hidden"
      style={{ minHeight: "100vh", position: "relative" }}
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
              className="absolute top-6 left-8 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#555566", fontWeight: 600 }}
            >
              <span style={{ color: "#f5e642" }}>⚡</span>
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
            key={`video-${videoIndex}`}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Corner label */}
            <div
              className="absolute top-6 left-8 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#555566", fontWeight: 600 }}
            >
              <span style={{ color: "#f5e642" }}>⚡</span>
              JUICE JACKING
            </div>
            <VideoPlaceholder videoIndex={videoIndex} onComplete={handleVideoComplete} />
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
  const videoQuestion = QUESTIONS[1];
  const wrongExampleAnswer = exampleQuestion.options.find((option) => option.key !== exampleQuestion.correct)?.key ?? null;

  return (
    <main className="storyboard-root">
      <StoryboardPage title="Screen 1: Attract Loop / Startscreen">
        <AttractScreen onStart={() => undefined} />
      </StoryboardPage>

      <StoryboardPage title="Screen 2: Quiz-Startscreen">
        <QuizStartScreen />
      </StoryboardPage>

      <StoryboardPage title="Screen 3: Beispiel-Frage">
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

      <StoryboardPage title="Screen 4: Feedback richtige Antwort">
        <QuizStoryboardFrame>
          <QuizQuestion
            question={exampleQuestion}
            questionIndex={0}
            total={QUESTIONS.length}
            selected={exampleQuestion.correct}
            onSelect={() => undefined}
            onNext={() => undefined}
          />
        </QuizStoryboardFrame>
      </StoryboardPage>

      <StoryboardPage title="Screen 5: Feedback falsche Antwort">
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

      <StoryboardPage title="Screen 6: Video-Platzhalter">
        <QuizStoryboardFrame>
          <VideoPlaceholder videoIndex={videoQuestion.id - 1} onComplete={() => undefined} staticMode />
        </QuizStoryboardFrame>
      </StoryboardPage>

      <StoryboardPage title="Screen 7: Score-/Summary-Screen">
        <SummaryScreen score={4} total={QUESTIONS.length} onRestart={() => undefined} />
      </StoryboardPage>

      <StoryboardPage title="Screen 8: Architektur-/Flow-Overview">
        <FlowOverviewScreen />
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

function QuizStartScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center px-16 py-12 relative overflow-hidden">
      <div className="storyboard-grid-backdrop" />
      <div className="relative z-10 grid grid-cols-[1.15fr_0.85fr] gap-12 items-center max-w-6xl w-full">
        <div>
          <p className="text-accent uppercase tracking-[0.3em] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 700 }}>
            Usable Security Quiz
          </p>
          <h1 className="uppercase leading-none mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(4rem, 8vw, 7.5rem)", fontWeight: 900, letterSpacing: "-0.01em" }}>
            Bereit für
            <br />
            <span className="text-accent">5 Fragen?</span>
          </h1>
          <p className="text-muted-foreground max-w-xl" style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.25rem", lineHeight: 1.5 }}>
            Jede Antwort zeigt direktes Feedback, danach folgt ein kurzer Video-Platzhalter zum passenden Juice-Jacking-Szenario.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            { label: "1", title: "Antwort wählen", text: "Vier Optionen, eine sichere Entscheidung." },
            { label: "2", title: "Feedback lesen", text: "Richtig oder falsch mit kurzer Erklärung." },
            { label: "3", title: "Video ansehen", text: "10 Sekunden Kontext vor der nächsten Frage." },
          ].map((step) => (
            <div key={step.label} className="storyboard-step-card">
              <span>{step.label}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlowOverviewScreen() {
  const flowItems = [
    "Attract Loop",
    "Start Quiz",
    "Question",
    "Feedback",
    "Video",
    "Next Question",
    "Summary",
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center px-20 py-16 relative overflow-hidden">
      <div className="storyboard-grid-backdrop" />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <p className="text-accent uppercase tracking-[0.3em] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 700 }}>
          State Flow
        </p>
        <h1 className="uppercase leading-none mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(3.5rem, 7vw, 6.5rem)", fontWeight: 900 }}>
          Quiz Architektur
        </h1>

        <div className="storyboard-flow-grid">
          {flowItems.map((item, index) => (
            <div key={item} className="storyboard-flow-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{item}</h2>
              {index < flowItems.length - 1 && <div className="storyboard-flow-arrow">→</div>}
            </div>
          ))}
        </div>

        <div className="storyboard-flow-note">
          <strong>Implementation:</strong> `screen` steuert attract, quiz, video und summary. Storyboard-Modus rendert dieselben Kernkomponenten statisch über `/storyboard` oder `?mode=storyboard`.
        </div>
      </div>
    </div>
  );
}
