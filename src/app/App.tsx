import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AttractScreen } from "./components/AttractScreen";
import { QuizQuestion, type Question } from "./components/QuizQuestion";
import { VideoPlaceholder } from "./components/VideoPlaceholder";
import { SummaryScreen } from "./components/SummaryScreen";
import { ProtectionPosterScreen } from "./components/ProtectionPosterScreen";
import { TransitionScreen } from "./components/TransitionScreen";

{/* MARKER-MAKE-KIT-INVOKED */}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Was ist Juice Jacking?",
    options: [
      { key: "A", label: "Eine besonders schnelle Ladetechnik für Smartphones" },
      { key: "B", label: "Ein Angriff über USB, bei dem Laden und Datenübertragung missbraucht werden" },
      { key: "C", label: "Eine App, die den Akku überwacht" },
      { key: "D", label: "Ein Problem, das nur bei WLAN-Verbindungen entsteht" },
    ],
    correct: "B",
    feedback: {
      correct: {
        why: "USB überträgt Strom und Daten. Ein unbekannter USB-Anschluss kann diese Datenverbindung missbrauchen.",
        mnemonic: "Flugmodus schützt nicht vor USB-Datenverbindung.",
      },
      incorrect: {
        why: "Juice Jacking nutzt die Datenfunktion von USB, nicht WLAN oder eine Lade-App. Auch beim Laden kann eine Datenverbindung entstehen.",
        mnemonic: "Flugmodus schützt nicht vor USB-Datenverbindung.",
      },
    },
  },
  {
    id: 2,
    text: "Wo passiert Juice Jacking?",
    options: [
      { key: "A", label: "An öffentlichen USB-Ladestationen, zum Beispiel am Flughafen oder Bahnhof" },
      { key: "B", label: "Nur zu Hause am eigenen Netzteil" },
      { key: "C", label: "Ausschließlich beim kabellosen Laden" },
      { key: "D", label: "Nur wenn das Smartphone im Flugmodus ist" },
    ],
    correct: "A",
    feedback: {
      correct: {
        why: "Das Risiko besteht vor allem an unbekannten USB-Ladepunkten, etwa an Flughäfen oder Bahnhöfen. Von außen ist die Vertrauenswürdigkeit nicht erkennbar.",
        mnemonic: "Eigenes Netzteil an Steckdose ist am sichersten.",
      },
      incorrect: {
        why: "Kritisch sind vor allem fremde USB-Ladebuchsen im öffentlichen Raum. Man sieht ihnen nicht sicher an, ob sie vertrauenswürdig sind.",
        mnemonic: "Eigenes Netzteil an Steckdose ist am sichersten.",
      },
    },
  },
  {
    id: 3,
    text: "Welche Risiken gehen von Juice Jacking aus?",
    options: [
      { key: "A", label: "Nur ein langsamerer Ladevorgang" },
      { key: "B", label: "Datendiebstahl und das Einschleusen von Malware" },
      { key: "C", label: "Ein dauerhaft beschädigter Akku" },
      { key: "D", label: "Nur eine höhere Mobilfunkrechnung" },
    ],
    correct: "B",
    feedback: {
      correct: {
        why: "Ein manipulierter USB-Anschluss kann Daten auslesen oder Malware übertragen. Ein kaputter Akku ist dafür nicht das typische Risiko.",
        mnemonic: "Schütze Daten, nicht nur den Akku.",
      },
      incorrect: {
        why: "Juice Jacking betrifft vor allem Daten und mögliche Schadsoftware. Ein dauerhaft beschädigter Akku ist nicht typisch.",
        mnemonic: "Schütze Daten, nicht nur den Akku.",
      },
    },
  },
  {
    id: 4,
    text: "Wie schützt du dich am besten?",
    options: [
      { key: "A", label: "Eigenes Netzteil an einer Steckdose oder einen USB Data Blocker nutzen" },
      { key: "B", label: "Das Smartphone beim Laden in der Hand behalten" },
      { key: "C", label: "Nur ein fremdes Ladekabel verwenden, wenn es kurz ist" },
      { key: "D", label: "Öffentliche USB-Ladestationen nur nachts verwenden" },
    ],
    correct: "A",
    feedback: {
      correct: {
        why: "Ein eigenes Netzteil vermeidet unbekannte USB-Datenverbindungen. Wenn nur USB verfügbar ist, hilft ein USB Data Blocker.",
        mnemonic: "Nutze vertrauenswürdige Ladequellen.",
      },
      incorrect: {
        why: "Die Länge des Kabels oder die Uhrzeit schützt nicht vor Datenverbindungen. Sicherer sind Netzteil, Steckdose oder Data Blocker.",
        mnemonic: "Nutze vertrauenswürdige Ladequellen.",
      },
    },
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
    feedback: {
      correct: {
        why: "Ein USB Data Blocker blockiert die Datenleitungen. So wird nur Strom übertragen.",
        mnemonic: "Nützlich an öffentlichen Ladepunkten.",
      },
      incorrect: {
        why: "Ein Data Blocker ist keine App und kein Schnelllade-Trick. Er trennt die Datenleitungen und lässt Strom durch.",
        mnemonic: "Nützlich an öffentlichen Ladepunkten.",
      },
    },
  },
];

const SCENARIO_2_QUESTIONS: Question[] = [
  {
    id: 6,
    text: "Warum war die Powerbank im Video die sicherere Alternative?",
options: [
      { key: "A", label: "Sie lädt Smartphones schneller." },
      { key: "B", label: "Sie funktioniert auch ohne Steckdose." },
      { key: "C", label: "Sie liefert Strom, ohne eine Verbindung zu einer öffentlichen USB-Datenquelle herzustellen." },
      { key: "D", label: "Sie verschlüsselt automatisch alle Daten." },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Eine Powerbank versorgt das Smartphone lediglich mit Strom. Anders als bei unbekannten USB-Ladestationen besteht dabei keine Verbindung zu einer fremden Datenquelle, über die Daten übertragen werden könnten.",
        mnemonic: "Die eigene Powerbank ist unterwegs eine sichere Alternative.",
      },
      incorrect: {
        why: "Eine Powerbank versorgt das Smartphone lediglich mit Strom. Anders als bei unbekannten USB-Ladestationen besteht dabei keine Verbindung zu einer fremden Datenquelle, über die Daten übertragen werden könnten.",
        mnemonic: "Die eigene Powerbank ist unterwegs eine sichere Alternative.",
      },
    },
  },
  {
    id: 7,
    text: "Was symbolisiert der rote Datenstrom zwischen Smartphone und Hacker?",
options: [
      { key: "A", label: "Das Smartphone lädt besonders schnell." },
      { key: "B", label: "Persönliche Daten werden vom Smartphone übertragen." },
      { key: "C", label: "Der Akku wird beschädigt." },
      { key: "D", label: "Das Smartphone installiert automatisch Updates." },
    ],
    correct: "B",
    feedback: {
      correct: {
        why: "Der rote Datenstrom ist eine Visualisierung für den möglichen Datendiebstahl. Er zeigt, dass über eine manipulierte USB-Verbindung nicht nur Strom, sondern auch Daten übertragen werden können.",
        mnemonic: "USB überträgt nicht nur Strom, sondern kann auch Daten übertragen.",
      },
      incorrect: {
        why: "Der rote Datenstrom ist eine Visualisierung für den möglichen Datendiebstahl. Er zeigt, dass über eine manipulierte USB-Verbindung nicht nur Strom, sondern auch Daten übertragen werden können.",
        mnemonic: "USB überträgt nicht nur Strom, sondern kann auch Daten übertragen.",
      },
    },
  },
  {
    id: 8,
    text: "Welche Handlung beendet im Video den möglichen Datenfluss?",
options: [
      { key: "A", label: "Emma aktiviert den Flugmodus." },
      { key: "B", label: "Emma sperrt ihr Smartphone." },
      { key: "C", label: "Emma trennt das Smartphone vom fremden USB-Kabel und verwendet stattdessen eine Powerbank." },
      { key: "D", label: "Der Zug fährt in den Bahnhof ein." },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Sobald Emma das fremde USB-Kabel entfernt und stattdessen die Powerbank nutzt, wird die mögliche Datenverbindung unterbrochen.",
        mnemonic: "Trenne unbekannte USB-Verbindungen und verwende sichere Alternativen.",
      },
      incorrect: {
        why: "Sobald Emma das fremde USB-Kabel entfernt und stattdessen die Powerbank nutzt, wird die mögliche Datenverbindung unterbrochen.",
        mnemonic: "Trenne unbekannte USB-Verbindungen und verwende sichere Alternativen.",
      },
    },
  },
  {
    id: 9,
    text: "Was ist die wichtigste Botschaft des Videos?",
options: [
      { key: "A", label: "Fremden Menschen sollte man grundsätzlich nicht vertrauen." },
      { key: "B", label: "Öffentliche Bahnhöfe sind unsicher." },
      { key: "C", label: "Beim Laden sollte man unbekannte USB-Kabel vermeiden und stattdessen sichere Alternativen wie eine Powerbank oder das eigene Ladegerät nutzen." },
      { key: "D", label: "Smartphones sollten nur ausgeschaltet geladen werden." },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Das Video richtet sich nicht gegen fremde Menschen oder öffentliche Orte. Die wichtigste Botschaft lautet: Verwende möglichst dein eigenes Ladezubehör oder eine Powerbank, um das Risiko von Juice Jacking zu reduzieren.",
        mnemonic: "Vertraue deinem eigenen Ladezubehör.",
      },
      incorrect: {
        why: "Das Video richtet sich nicht gegen fremde Menschen oder öffentliche Orte. Die wichtigste Botschaft lautet: Verwende möglichst dein eigenes Ladezubehör oder eine Powerbank, um das Risiko von Juice Jacking zu reduzieren.",
        mnemonic: "Vertraue deinem eigenen Ladezubehör.",
      },
    },
  },
  {
    id: 10,
    text: "Welche der folgenden Situationen wäre nach dem Video die sicherste?",
options: [
      { key: "A", label: "Ein fremdes USB-C-Kabel an einer öffentlichen Ladestation benutzen." },
      { key: "B", label: "Das Smartphone an einer öffentlichen USB-Buchse laden." },
      { key: "C", label: "Die eigene Powerbank oder das eigene Netzteil verwenden." },
      { key: "D", label: "Ein USB-Kabel benutzen, das freundlich angeboten wird." },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Die sicherste Lösung ist die Nutzung der eigenen Powerbank oder eines eigenen Ladegeräts an einer normalen Steckdose. So besteht keine Verbindung zu einer unbekannten USB-Datenquelle.",
        mnemonic: "Eigenes Ladezubehör ist immer die sicherste Wahl.",
      },
      incorrect: {
        why: "Die sicherste Lösung ist die Nutzung der eigenen Powerbank oder eines eigenen Ladegeräts an einer normalen Steckdose. So besteht keine Verbindung zu einer unbekannten USB-Datenquelle.",
        mnemonic: "Eigenes Ladezubehör ist immer die sicherste Wahl.",
      },
    },
  },
];

type Scenario = 1 | 2;

type Screen = "attract" | "quiz" | "video" | "summary" | "transition" | "finalResult" | "protectionPoster";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

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
  const shouldReduceMotion = useReducedMotion();
  const [screen, setScreen] = useState<Screen>("attract");
  const [scenario, setScenario] = useState<Scenario>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeQuestions = scenario === 1 ? QUESTIONS : SCENARIO_2_QUESTIONS;

  const clearIdleTimer = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  const resetToAttract = useCallback(() => {
    clearIdleTimer();
    setScreen("attract");
    setScenario(1);
    setQuestionIndex(0);
    setVideoIndex(0);
    setSelected(null);
    setScore(0);
    setCancelDialogOpen(false);
  }, [clearIdleTimer]);

  const resetIdleTimer = useCallback(() => {
    clearIdleTimer();
    idleTimer.current = setTimeout(resetToAttract, IDLE_TIMEOUT_MS);
  }, [clearIdleTimer, resetToAttract]);

  useEffect(() => {
    if (screen === "attract") {
      clearIdleTimer();
      return;
    }

    resetIdleTimer();
    const events = ["click", "keydown", "pointerdown", "pointermove", "touchstart", "wheel"];
    events.forEach((eventName) => window.addEventListener(eventName, resetIdleTimer, { passive: true }));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, resetIdleTimer));
      clearIdleTimer();
    };
  }, [clearIdleTimer, resetIdleTimer, screen]);

  const handleStart = () => {
    setScenario(1);
    setQuestionIndex(0);
    setVideoIndex(0);
    setSelected(null);
    setScore(0);
    setCancelDialogOpen(false);
    setScreen("video");
  };

  const handleSelect = (key: string) => {
    setSelected(key);
    if (key === activeQuestions[questionIndex].correct) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const handleStartPart2 = () => {
    setScenario(2);
    setQuestionIndex(0);
    setVideoIndex(5);
    setSelected(null);
    setCancelDialogOpen(false);
    setScreen("transition");
  };

  const handleStartPart2Video = () => {
    setScenario(2);
    setQuestionIndex(0);
    setVideoIndex(5);
    setSelected(null);
    setCancelDialogOpen(false);
    setScreen("video");
  };

  const handleNext = () => {
    const nextQuestionIndex = questionIndex + 1;
    if (nextQuestionIndex >= activeQuestions.length) {
      setScreen(scenario === 1 ? "summary" : "finalResult");
      return;
    }

    setQuestionIndex(nextQuestionIndex);
    setSelected(null);
    if (scenario === 2) {
      setScreen("quiz");
      return;
    }

    if (questionIndex === 0) {
      setScreen("quiz");
      return;
    }

    setVideoIndex(nextQuestionIndex);
    setScreen("video");
  };

  const handleVideoComplete = () => {
    setSelected(null);
    if (scenario === 2) {
      setQuestionIndex(0);
      setScreen("quiz");
      return;
    }

    if (videoIndex === 0) {
      setVideoIndex(1);
      setScreen("video");
      return;
    }

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
            key={`quiz-${scenario}-${questionIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="kiosk-brand-mark">
              <span style={{ color: "var(--accent)" }}>⚡</span>
              JUICE JACKING
            </div>
            <CancelRunButton onClick={() => setCancelDialogOpen(true)} />
            <QuizQuestion
              question={activeQuestions[questionIndex]}
              questionIndex={questionIndex}
              total={activeQuestions.length}
              selected={selected}
              onSelect={handleSelect}
              onNext={handleNext}
            />
          </motion.div>
        )}

        {screen === "video" && (
          <motion.div
            key={`video-${scenario}-${videoIndex}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="kiosk-brand-mark">
              <span style={{ color: "var(--accent)" }}>⚡</span>
              JUICE JACKING
            </div>
            <CancelRunButton onClick={() => setCancelDialogOpen(true)} />
            <VideoPlaceholder
              videoIndex={videoIndex}
              onComplete={handleVideoComplete}
              paused={cancelDialogOpen}
              skippable={scenario !== 1 || videoIndex !== 0}
              videoTotalLabel={scenario === 2 ? "Szenario 2 · Video 1" : undefined}
            />
          </motion.div>
        )}

        {screen === "summary" && (
          <motion.div
            key="summary"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SummaryScreen
              score={score}
              total={QUESTIONS.length}
              onContinueToPart2={handleStartPart2}
            />
          </motion.div>
        )}

        {screen === "transition" && (
          <motion.div
            key="transition"
            className="absolute inset-0"
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
          >
            <div className="kiosk-brand-mark">
              <span style={{ color: "var(--accent)" }}>⚡</span>
              JUICE JACKING
            </div>
            <TransitionScreen onStartVideo={handleStartPart2Video} />
          </motion.div>
        )}

        {screen === "finalResult" && (
          <motion.div
            key="final-result"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SummaryScreen
              score={score}
              total={QUESTIONS.length + SCENARIO_2_QUESTIONS.length}
              finalMode
              onContinueToProtectionTips={() => setScreen("protectionPoster")}
            />
          </motion.div>
        )}

        {screen === "protectionPoster" && (
          <motion.div
            key="protection-poster"
            className="absolute inset-0"
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
          >
            <ProtectionPosterScreen onRestart={resetToAttract} />
          </motion.div>
        )}
      </AnimatePresence>
      <CancelConfirmationDialog
        open={cancelDialogOpen}
        onContinue={() => setCancelDialogOpen(false)}
        onConfirm={resetToAttract}
      />
    </div>
  );
}

interface CancelRunButtonProps {
  onClick: () => void;
}

function CancelRunButton({ onClick }: CancelRunButtonProps) {
  return (
    <motion.button
      type="button"
      className="kiosk-cancel-button"
      onClick={onClick}
      whileHover={{ scale: 1.03, borderColor: "var(--accent)" }}
      whileTap={{ scale: 0.97 }}
    >
      Abbrechen
    </motion.button>
  );
}

interface CancelConfirmationDialogProps {
  open: boolean;
  onContinue: () => void;
  onConfirm: () => void;
}

function CancelConfirmationDialog({ open, onContinue, onConfirm }: CancelConfirmationDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cancel-dialog-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="cancel-dialog-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-dialog-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22 }}
          >
            <h2 id="cancel-dialog-title">Möchtest du den Durchlauf wirklich abbrechen?</h2>
            <div className="cancel-dialog-actions">
              <motion.button
                type="button"
                className="cancel-dialog-button cancel-dialog-button--continue"
                onClick={onContinue}
                whileHover={{ scale: 1.03, borderColor: "var(--accent)" }}
                whileTap={{ scale: 0.97 }}
              >
                Nein, fortsetzen
              </motion.button>
              <motion.button
                type="button"
                className="cancel-dialog-button cancel-dialog-button--confirm"
                onClick={onConfirm}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Ja, abbrechen
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StoryboardMode() {
  const exampleQuestion = QUESTIONS[0];
  const scenario2Question = SCENARIO_2_QUESTIONS[0];
  const wrongExampleAnswer = exampleQuestion.options.find((option) => option.key !== exampleQuestion.correct)?.key ?? null;
  const scenario2WrongAnswer = scenario2Question.options.find((option) => option.key !== scenario2Question.correct)?.key ?? null;

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

      <StoryboardPage title="Screen 5: Teil 1 abgeschlossen">
        <SummaryScreen
          score={4}
          total={QUESTIONS.length}
          onContinueToPart2={() => undefined}
        />
      </StoryboardPage>

      <StoryboardPage title="Screen 6: Übergang Teil 2">
        <QuizStoryboardFrame>
          <TransitionScreen onStartVideo={() => undefined} />
        </QuizStoryboardFrame>
      </StoryboardPage>

      <StoryboardPage title="Screen 7: Szenario 2 Quiz + Feedback">
        <QuizStoryboardFrame>
          <QuizQuestion
            question={scenario2Question}
            questionIndex={0}
            total={SCENARIO_2_QUESTIONS.length}
            selected={scenario2WrongAnswer}
            onSelect={() => undefined}
            onNext={() => undefined}
          />
        </QuizStoryboardFrame>
      </StoryboardPage>

      <StoryboardPage title="Screen 8: Finales Ergebnis">
        <SummaryScreen
          score={8}
          total={QUESTIONS.length + SCENARIO_2_QUESTIONS.length}
          finalMode
          onContinueToProtectionTips={() => undefined}
        />
      </StoryboardPage>

      <StoryboardPage title="Screen 9: Schutzposter">
        <ProtectionPosterScreen onRestart={() => undefined} />
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
    <div className="quiz-storyboard-frame">
      <div className="kiosk-brand-mark storyboard-brand-mark">
        <span style={{ color: "var(--accent)" }}>⚡</span>
        JUICE JACKING
      </div>
      {children}
    </div>
  );
}
