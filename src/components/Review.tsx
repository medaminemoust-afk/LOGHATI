import { courseWords } from "../data/courses";
import { speak } from "../lib/speech";
import type { Course, Progress, Word } from "../types";
import { Icon } from "./icons";

interface Props {
  course: Course;
  progress: Progress;
  onStart: (words: Word[]) => void;
}

export default function Review({ course, progress, onStart }: Props) {
  const words = courseWords(course);
  const stat = (id: string) => progress.words[id] ?? { correct: 0, wrong: 0 };

  const learned = words.filter((word) => {
    const entry = stat(word.id);
    return entry.correct + entry.wrong > 0;
  });
  const weak = learned
    .filter((word) => stat(word.id).wrong > 0)
    .sort((a, b) => stat(b.id).wrong - stat(a.id).wrong);
  const mastered = learned.filter((word) => {
    const entry = stat(word.id);
    return entry.wrong === 0 && entry.correct >= 2;
  }).length;
  const pool = weak.length > 0 ? weak.slice(0, 8) : learned.length > 0 ? learned.slice(0, 8) : words.slice(0, 6);

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Review</p>
          <h1 className="page-title">Words you&rsquo;ve met</h1>
        </div>
        <span className="stat-chip">
          <Icon name="target" size={15} /> {mastered} mastered
        </span>
      </header>

      <section className="panel card review-cta">
        <div>
          <h2>Practice weak spots</h2>
          <p className="muted small">
            {weak.length > 0
              ? `${weak.length} word${weak.length > 1 ? "s" : ""} could use another pass.`
              : learned.length > 0
                ? "Everything looks solid — keep it warm."
                : "Finish a lesson and your words land here."}
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => onStart(pool)}
          disabled={pool.length === 0}
        >
          <Icon name="play" size={15} filled /> Review {pool.length}
        </button>
      </section>

      <section className="word-bank">
        <h2 className="section-title">Word bank</h2>
        {course.units.map((unit) =>
          unit.lessons.map((lesson) => (
            <div className="bank-lesson card" key={lesson.id}>
              <div className="bank-head">
                <h3>{lesson.title}</h3>
                <span className="muted small">{lesson.focus}</span>
              </div>
              <ul>
                {lesson.words.map((word) => {
                  const entry = stat(word.id);
                  const seen = entry.correct + entry.wrong > 0;
                  const status = !seen ? "new" : entry.wrong > 0 ? "weak" : "solid";
                  return (
                    <li key={word.id}>
                      <button type="button" className="bank-row" onClick={() => speak(word.term, course.code)}>
                        <span className={`dot ${status}`} />
                        <span className="word-term">
                          {word.term}
                          {word.roman && <em>{word.roman}</em>}
                        </span>
                        <span className="word-translation">{word.translation}</span>
                        <Icon name="speaker" size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )),
        )}
      </section>
    </>
  );
}
