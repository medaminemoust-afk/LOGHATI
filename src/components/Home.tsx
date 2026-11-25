import { useState } from "react";
import { courseWordCount, courses } from "../data/courses";
import type { Course, LangCode, Lesson, Progress } from "../types";
import { Icon } from "./icons";

interface Props {
  course: Course;
  progress: Progress;
  dailyXp: number;
  nextLesson: Lesson;
  onStartLesson: (lesson: Lesson) => void;
  onPickLang: (code: LangCode) => void;
}

function greeting(hour: number) {
  if (hour < 5) return "Still awake?";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home({
  course,
  progress,
  dailyXp,
  nextLesson,
  onStartLesson,
  onPickLang,
}: Props) {
  const [picker, setPicker] = useState(false);
  const goal = progress.dailyGoal;
  const pct = Math.min(1, dailyXp / Math.max(goal, 1));
  const doneLessons = course.units
    .flatMap((unit) => unit.lessons)
    .filter((lesson) => progress.lessons[lesson.id]?.done).length;
  const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <>
      <header className="topbar">
        <div className="brand">
          Lingua<span className="brand-dot" />
        </div>
        <button type="button" className="lang-pill" onClick={() => setPicker(true)}>
          <span className="flag">{course.flag}</span>
          <span>{course.native}</span>
          <Icon name="chevron" size={15} />
        </button>
      </header>

      <section className="hero card">
        <div className="hero-copy">
          <p className="eyebrow">{greeting(new Date().getHours())}</p>
          <h1 className="hero-title">
            A little {course.name}, <em>every day.</em>
          </h1>
          <p className="hero-sub">{course.tagline}</p>
          <div className="hero-stats">
            <span className="stat-chip">
              <Icon name="flame" size={15} /> {progress.streak} day streak
            </span>
            <span className="stat-chip">
              <Icon name="spark" size={15} /> {progress.xp} XP
            </span>
          </div>
        </div>
        <div className="ring-wrap">
          <div
            className="ring"
            style={{
              background: `conic-gradient(var(--accent) ${pct * 360}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          >
            <div className="ring-inner">
              <strong>{Math.min(dailyXp, goal)}</strong>
              <span>of {goal} XP</span>
            </div>
          </div>
          <p className="ring-caption">Daily goal</p>
        </div>
      </section>

      <button type="button" className="continue card" onClick={() => onStartLesson(nextLesson)}>
        <div className="continue-copy">
          <p className="eyebrow">Up next</p>
          <h2>{nextLesson.title}</h2>
          <p className="muted">
            {nextLesson.focus} · {nextLesson.words.length} words
          </p>
        </div>
        <span className="play">
          <Icon name="play" size={20} filled />
        </span>
      </button>

      <section className="path">
        <div className="section-head">
          <h2 className="section-title">Your path</h2>
          <span className="muted small">
            {doneLessons}/{totalLessons} lessons
          </span>
        </div>
        {course.units.map((unit, unitIndex) => (
          <div className="unit" key={unit.id}>
            <div className="unit-head">
              <span className="unit-badge">Unit {unitIndex + 1}</span>
              <div>
                <h3>{unit.title}</h3>
                <p className="muted small">{unit.blurb}</p>
              </div>
            </div>
            <div className="lesson-list">
              {unit.lessons.map((lesson, lessonIndex) => {
                const entry = progress.lessons[lesson.id];
                const before = course.units
                  .slice(0, unitIndex)
                  .reduce((sum, item) => sum + item.lessons.length, 0);
                return (
                  <button
                    type="button"
                    key={lesson.id}
                    className={`lesson-row${entry?.done ? " is-done" : ""}`}
                    onClick={() => onStartLesson(lesson)}
                  >
                    <span className="lesson-index">
                      {entry?.done ? <Icon name="check" size={17} /> : before + lessonIndex + 1}
                    </span>
                    <span className="lesson-body">
                      <span className="lesson-title">{lesson.title}</span>
                      <span className="lesson-focus">{lesson.focus}</span>
                    </span>
                    <span className="lesson-meta">
                      {entry?.done ? `${Math.round(entry.best * 100)}%` : `${lesson.words.length} words`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {picker && (
        <div className="sheet-backdrop" onClick={() => setPicker(false)}>
          <div className="sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-head">
              <h2>Choose a language</h2>
              <button type="button" className="icon-btn" onClick={() => setPicker(false)}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <p className="muted small">Progress is saved separately for each course.</p>
            {courses.map((item) => (
              <button
                type="button"
                key={item.code}
                className={`lang-option${item.code === course.code ? " active" : ""}`}
                onClick={() => {
                  onPickLang(item.code);
                  setPicker(false);
                }}
              >
                <span className="flag big">{item.flag}</span>
                <span className="lang-option-copy">
                  <strong>{item.native}</strong>
                  <em>
                    {item.name} · {courseWordCount(item)} words
                  </em>
                </span>
                {item.code === course.code && <Icon name="check" size={17} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
