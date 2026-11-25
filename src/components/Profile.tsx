import { useState } from "react";
import { courseLessons, courseWords, courses } from "../data/courses";
import type { Course, LangCode, Progress } from "../types";
import { Icon } from "./icons";

interface Props {
  course: Course;
  progress: Progress;
  onPickLang: (code: LangCode) => void;
  onGoal: (goal: number) => void;
  onReset: () => void;
}

const GOALS = [20, 30, 50];

export default function Profile({ course, progress, onPickLang, onGoal, onReset }: Props) {
  const [confirming, setConfirming] = useState(false);
  const lessons = courseLessons(course);
  const done = lessons.filter((lesson) => progress.lessons[lesson.id]?.done).length;
  const words = courseWords(course);
  const learned = words.filter((word) => {
    const entry = progress.words[word.id];
    return entry ? entry.correct + entry.wrong > 0 : false;
  }).length;

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">You</p>
          <h1 className="page-title">Your progress</h1>
        </div>
        <span className="stat-chip">
          <Icon name="flame" size={15} /> {progress.streak} days
        </span>
      </header>

      <section className="panel card profile-head">
        <div className="avatar">
          <Icon name="user" size={26} />
        </div>
        <div>
          <h2>{course.native} learner</h2>
          <p className="muted small">
            {done} of {lessons.length} lessons · {learned} words met
          </p>
        </div>
      </section>

      <section className="stat-grid">
        <div className="panel card stat-block">
          <strong>{progress.xp}</strong>
          <span>total XP</span>
        </div>
        <div className="panel card stat-block">
          <strong>{progress.streak}</strong>
          <span>day streak</span>
        </div>
        <div className="panel card stat-block">
          <strong>{done}</strong>
          <span>lessons done</span>
        </div>
        <div className="panel card stat-block">
          <strong>{learned}</strong>
          <span>words met</span>
        </div>
      </section>

      <section className="panel card">
        <h2>Daily goal</h2>
        <p className="muted small">A small goal you'll actually keep beats a big one you skip.</p>
        <div className="goal-chips">
          {GOALS.map((goal) => (
            <button
              type="button"
              key={goal}
              className={`chip${progress.dailyGoal === goal ? " active" : ""}`}
              onClick={() => onGoal(goal)}
            >
              {goal} XP
            </button>
          ))}
        </div>
      </section>

      <section className="panel card">
        <h2>Language</h2>
        <div className="lang-list">
          {courses.map((item) => (
            <button
              type="button"
              key={item.code}
              className={`lang-option${item.code === course.code ? " active" : ""}`}
              onClick={() => onPickLang(item.code)}
            >
              <span className="flag big">{item.flag}</span>
              <span className="lang-option-copy">
                <strong>{item.native}</strong>
                <em>{item.name}</em>
              </span>
              {item.code === course.code && <Icon name="check" size={17} />}
            </button>
          ))}
        </div>
      </section>

      <section className="panel card danger-zone">
        {confirming ? (
          <>
            <div>
              <h2>Reset everything?</h2>
              <p className="muted small">This clears XP, streaks and every saved word. It can't be undone.</p>
            </div>
            <div className="button-row">
              <button type="button" className="btn-ghost" onClick={() => setConfirming(false)}>
                Keep it
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  onReset();
                  setConfirming(false);
                }}
              >
                Reset
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2>Start fresh</h2>
              <p className="muted small">Clear your progress and begin again.</p>
            </div>
            <button type="button" className="btn-ghost" onClick={() => setConfirming(true)}>
              Reset progress
            </button>
          </>
        )}
      </section>
    </>
  );
}
