import { useCallback, useEffect, useMemo, useState } from "react";
import Home from "./components/Home";
import LessonScreen from "./components/LessonScreen";
import Nav, { type Tab } from "./components/Nav";
import Profile from "./components/Profile";
import Review from "./components/Review";
import { courses } from "./data/courses";
import { buildSession, sessionXp, type Question } from "./lib/session";
import { useStoredState } from "./lib/storage";
import type { LangCode, Lesson, Progress, SessionResult, Word } from "./types";

const INITIAL_PROGRESS: Progress = {
  lang: "fr",
  xp: 0,
  streak: 0,
  lastDay: "",
  dailyDay: "",
  dailyXp: 0,
  dailyGoal: 30,
  lessons: {},
  words: {},
};

interface ActiveSession {
  title: string;
  kicker: string;
  lessonId?: string;
  questions: Question[];
}

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function App() {
  const [progress, setProgress] = useStoredState<Progress>("lingua.progress.v1", INITIAL_PROGRESS);
  const [tab, setTab] = useState<Tab>("learn");
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const course = useMemo(
    () => courses.find((item) => item.code === progress.lang) ?? courses[0],
    [progress.lang],
  );
  const today = dayKey(new Date());
  const dailyXp = progress.dailyDay === today ? progress.dailyXp : 0;

  const nextLesson = useMemo(() => {
    const all = course.units.flatMap((unit) => unit.lessons);
    return all.find((lesson) => !progress.lessons[lesson.id]?.done) ?? all[all.length - 1];
  }, [course, progress.lessons]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const startLesson = useCallback(
    (lesson: Lesson) => {
      setSession({
        title: lesson.title,
        kicker: `Unit lesson · ${lesson.focus}`,
        lessonId: lesson.id,
        questions: buildSession(course, lesson.words, course.code),
      });
    },
    [course],
  );

  const startReview = useCallback(
    (words: Word[]) => {
      setSession({
        title: "Quick review",
        kicker: `${words.length} saved words`,
        questions: buildSession(course, words, course.code),
      });
    },
    [course],
  );

  const completeSession = useCallback(
    (result: SessionResult) => {
      const earned = sessionXp(result.correct, result.total);
      const lessonId = session?.lessonId;

      setProgress((prev) => {
        const day = dayKey(new Date());
        const yesterday = dayKey(new Date(Date.now() - 86_400_000));
        const streak =
          prev.lastDay === day ? prev.streak : prev.lastDay === yesterday ? prev.streak + 1 : 1;

        const lessons = { ...prev.lessons };
        if (lessonId) {
          const current = lessons[lessonId];
          lessons[lessonId] = {
            done: true,
            best: Math.max(current?.best ?? 0, result.total ? result.correct / result.total : 0),
            tries: (current?.tries ?? 0) + 1,
          };
        }

        const words = { ...prev.words };
        for (const item of result.results) {
          const current = words[item.wordId] ?? { correct: 0, wrong: 0 };
          words[item.wordId] = {
            correct: current.correct + (item.correct ? 1 : 0),
            wrong: current.wrong + (item.correct ? 0 : 1),
          };
        }

        return {
          ...prev,
          xp: prev.xp + earned,
          streak,
          lastDay: day,
          dailyDay: day,
          dailyXp: (prev.dailyDay === day ? prev.dailyXp : 0) + earned,
          lessons,
          words,
        };
      });

      setToast(`+${earned} XP · ${result.correct}/${result.total} correct`);
    },
    [session, setProgress],
  );

  const pickLang = useCallback(
    (code: LangCode) => {
      setProgress((prev) => ({ ...prev, lang: code }));
      setTab("learn");
    },
    [setProgress],
  );

  const setGoal = useCallback(
    (goal: number) => setProgress((prev) => ({ ...prev, dailyGoal: goal })),
    [setProgress],
  );

  const resetProgress = useCallback(() => {
    setProgress({ ...INITIAL_PROGRESS, lang: progress.lang });
    setToast("Progress cleared. Fresh start.");
  }, [progress.lang, setProgress]);

  if (session) {
    return (
      <LessonScreen
        title={session.title}
        kicker={session.kicker}
        questions={session.questions}
        onComplete={completeSession}
        onExit={() => setSession(null)}
      />
    );
  }

  return (
    <div className="app">
      <div className="shell">
        {tab === "learn" && (
          <Home
            course={course}
            progress={progress}
            dailyXp={dailyXp}
            nextLesson={nextLesson}
            onStartLesson={startLesson}
            onPickLang={pickLang}
          />
        )}
        {tab === "review" && <Review course={course} progress={progress} onStart={startReview} />}
        {tab === "profile" && (
          <Profile
            course={course}
            progress={progress}
            onPickLang={pickLang}
            onGoal={setGoal}
            onReset={resetProgress}
          />
        )}
      </div>
      <Nav tab={tab} onChange={setTab} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
