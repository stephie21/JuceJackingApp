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
    text: "Welche Lademöglichkeit ist unterwegs am sichersten?",
    options: [
      { key: "A", label: "Ein öffentliches USB-Kabel benutzen" },
      { key: "B", label: "Das Smartphone direkt an einen unbekannten USB-Port anschließen" },
      { key: "C", label: "Die eigene Powerbank oder das eigene Netzteil verwenden" },
      { key: "D", label: "Ein fremdes USB-Kabel benutzen, wenn es neu aussieht" },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Eigene Ladegeräte und Powerbanks stellen keine Verbindung zu einer unbekannten USB-Datenquelle her. Dadurch wird das Smartphone geladen, ohne einem fremden USB-Anschluss zu vertrauen.",
        mnemonic: "Nutze unterwegs möglichst dein eigenes Ladezubehör.",
      },
      incorrect: {
        why: "Unbekannte USB-Ports oder fremde Kabel können neben Strom auch eine Datenverbindung herstellen. Sicherer sind die eigene Powerbank oder das eigene Netzteil.",
        mnemonic: "Nutze unterwegs möglichst dein eigenes Ladezubehör.",
      },
    },
  },
  {
    id: 7,
    text: "Warum ist eine Powerbank eine sichere Alternative?",
    options: [
      { key: "A", label: "Sie lädt jedes Smartphone schneller" },
      { key: "B", label: "Sie verschlüsselt automatisch alle Daten" },
      { key: "C", label: "Sie versorgt das Smartphone mit Strom, ohne eine fremde USB-Datenverbindung zu nutzen" },
      { key: "D", label: "Sie entfernt Schadsoftware vom Smartphone" },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Eine eigene Powerbank liefert Strom, ohne dass das Smartphone mit einem unbekannten USB-Host verbunden wird. Dadurch entsteht keine fremde USB-Datenverbindung.",
        mnemonic: "Eine eigene Powerbank ist unterwegs eine sichere Stromquelle.",
      },
      incorrect: {
        why: "Eine Powerbank schützt nicht durch Verschlüsselung oder Virenerkennung. Der Vorteil besteht darin, dass keine Verbindung zu einem unbekannten USB-Anschluss notwendig ist.",
        mnemonic: "Eine eigene Powerbank ist unterwegs eine sichere Stromquelle.",
      },
    },
  },
  {
    id: 8,
    text: "Wie kannst du eine mögliche USB-Datenverbindung beenden?",
    options: [
      { key: "A", label: "Den Flugmodus aktivieren" },
      { key: "B", label: "Das Smartphone sperren" },
      { key: "C", label: "Die unbekannte USB-Verbindung trennen und eigenes Ladezubehör verwenden" },
      { key: "D", label: "Nur WLAN ausschalten" },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Durch das Trennen der USB-Verbindung werden sowohl die Strom- als auch die mögliche Datenverbindung beendet. Anschließend kann eine vertrauenswürdige Ladequelle verwendet werden.",
        mnemonic: "Unbekannte USB-Verbindung trennen und sicher weiterladen.",
      },
      incorrect: {
        why: "Flugmodus, Displaysperre und ausgeschaltetes WLAN beenden keine bestehende USB-Datenverbindung. Dafür muss die unbekannte USB-Verbindung physisch getrennt werden.",
        mnemonic: "Unbekannte USB-Verbindung trennen und sicher weiterladen.",
      },
    },
  },
  {
    id: 9,
    text: "Welche Aussage beschreibt gutes Sicherheitsverhalten beim Laden am besten?",
    options: [
      { key: "A", label: "Öffentliche Orte grundsätzlich vermeiden" },
      { key: "B", label: "Nur Kabel von freundlich wirkenden Personen verwenden" },
      { key: "C", label: "Möglichst eigenes Ladezubehör oder eine eigene Powerbank verwenden" },
      { key: "D", label: "Das Smartphone beim Laden immer ausschalten" },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Eigenes Ladezubehör reduziert die Abhängigkeit von unbekannten USB-Ports und fremden Kabeln. Entscheidend ist die vertrauenswürdige Ladequelle, nicht der Ort oder die Person.",
        mnemonic: "Vertraue beim Laden deinem eigenen Zubehör.",
      },
      incorrect: {
        why: "Das Risiko hängt nicht grundsätzlich vom öffentlichen Ort oder vom Auftreten einer Person ab. Entscheidend ist, ob die verwendete USB-Verbindung vertrauenswürdig ist.",
        mnemonic: "Vertraue beim Laden deinem eigenen Zubehör.",
      },
    },
  },
  {
    id: 10,
    text: "Welche Aussage über sicheres Laden trifft zu?",
    options: [
      { key: "A", label: "Jeder öffentliche USB-Anschluss ist manipuliert" },
      { key: "B", label: "Ein USB Data Blocker schützt vor dem Diebstahl des Smartphones" },
      { key: "C", label: "Unbekannte USB-Verbindungen sollten möglichst vermieden und sichere Alternativen genutzt werden" },
      { key: "D", label: "Der Flugmodus verhindert jede USB-Datenübertragung" },
    ],
    correct: "C",
    feedback: {
      correct: {
        why: "Nicht jeder öffentliche USB-Anschluss ist manipuliert. Unbekannte USB-Verbindungen können jedoch ein vermeidbares Risiko darstellen, weshalb vertrauenswürdige Alternativen sinnvoll sind.",
        mnemonic: "Unbekannte USB-Verbindungen vermeiden, ohne unnötig Angst zu erzeugen.",
      },
      incorrect: {
        why: "Öffentliche USB-Anschlüsse sind nicht automatisch manipuliert. Ein Data Blocker blockiert Datenleitungen, und der Flugmodus beendet keine USB-Datenverbindung.",
        mnemonic: "Unbekannte USB-Verbindungen vermeiden, ohne unnötig Angst zu erzeugen.",
      },
    },
  },
];

type Scenario = 1 | 2;

type Screen = "attract" | "quiz" | "video" | "summary" | "transition" | "finalResult" | "protectionPoster";

type ProtectionPosterEntry = "part1" | "final";

type AnswerState = Record<Scenario, Record<number, string>>;

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

const createEmptyAnswers = (): AnswerState => ({ 1: {}, 2: {} });

function getScenarioScore(questions: Question[], answers: Record<number, string>) {
  return questions.reduce((total, question) => total + (answers[question.id] === question.correct ? 1 : 0), 0);
}

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
  const [answers, setAnswers] = useState<AnswerState>(createEmptyAnswers);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [protectionPosterEntry, setProtectionPosterEntry] = useState<ProtectionPosterEntry>("final");
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeQuestions = scenario === 1 ? QUESTIONS : SCENARIO_2_QUESTIONS;
  const activeQuestion = activeQuestions[questionIndex];
  const selected = answers[scenario][activeQuestion.id] ?? null;
  const partOneScore = getScenarioScore(QUESTIONS, answers[1]);
  const totalScore = partOneScore + getScenarioScore(SCENARIO_2_QUESTIONS, answers[2]);

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
    setAnswers(createEmptyAnswers());
    setCancelDialogOpen(false);
    setProtectionPosterEntry("final");
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
    setAnswers(createEmptyAnswers());
    setCancelDialogOpen(false);
    setScreen("video");
  };

  const handleSelect = (key: string) => {
    setAnswers((currentAnswers) => {
      if (currentAnswers[scenario][activeQuestion.id]) return currentAnswers;

      return {
        ...currentAnswers,
        [scenario]: {
          ...currentAnswers[scenario],
          [activeQuestion.id]: key,
        },
      };
    });
  };

  const handleStartPart2 = () => {
    setScenario(2);
    setQuestionIndex(0);
    setVideoIndex(5);
    setCancelDialogOpen(false);
    setScreen("transition");
  };

  const handleOpenPartOneProtectionTips = () => {
    setProtectionPosterEntry("part1");
    setScreen("protectionPoster");
  };

  const handleOpenFinalProtectionTips = () => {
    setProtectionPosterEntry("final");
    setScreen("protectionPoster");
  };

  const handleStartPart2Video = () => {
    setScenario(2);
    setQuestionIndex(0);
    setVideoIndex(5);
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

  const handleBack = () => {
    if (questionIndex === 0) return;

    setQuestionIndex((currentIndex) => currentIndex - 1);
    setScreen("quiz");
  };

  const handleVideoComplete = () => {
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
            <QuizQuestion
              question={activeQuestion}
              questionIndex={questionIndex}
              total={activeQuestions.length}
              selected={selected}
              onSelect={handleSelect}
              onNext={handleNext}
              onBack={handleBack}
              canGoBack={questionIndex > 0}
              cancelAction={<CancelRunButton onClick={() => setCancelDialogOpen(true)} />}
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
              score={partOneScore}
              total={QUESTIONS.length}
              onContinueToPart2={handleStartPart2}
              onContinueToProtectionTips={handleOpenPartOneProtectionTips}
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
              score={totalScore}
              total={QUESTIONS.length + SCENARIO_2_QUESTIONS.length}
              finalMode
              onContinueToProtectionTips={handleOpenFinalProtectionTips}
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
            <ProtectionPosterScreen
              onRestart={resetToAttract}
              actionLabel={protectionPosterEntry === "part1" ? "Weiter zu Teil 2" : undefined}
              onAction={protectionPosterEntry === "part1" ? handleStartPart2 : undefined}
            />
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
  floating?: boolean;
}

function CancelRunButton({ onClick, floating = false }: CancelRunButtonProps) {
  return (
    <motion.button
      type="button"
      className={floating ? "kiosk-cancel-button kiosk-cancel-button-floating" : "kiosk-cancel-button"}
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
          onContinueToProtectionTips={() => undefined}
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
