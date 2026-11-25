import { useEffect, useMemo, useRef, useState } from "react";
import { checkAnswer, sessionXp, type Question } from "../lib/session";
import { speak } from "../lib/speech";
import type { SessionResult, WordResult } from "../types";
import { Icon } from "./icons";

interface Props {
  title: string;
  kicker: string;
  questions: Question[];
  onComplete: (result: SessionResult) => void;
  onExit: () => void;
}

export default function LessonScreen({ title, kicker, questions, onComplete, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [judged, setJudged] = useState<boolean | null>(null);
  const [results, setResults] = useState<WordResult[]>([]);
  const [finished, setFinished] = useState(false);
  const reported = useRef(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const correctCount = results.filter((item) => item.correct).length;
  const progress = finished ? 100 : Math.round((index / questions.length) * 100);

  useEffect(() => {
    if (!finished && question?.kind === "listen") speak(question.word.term, question.lang);
  }, [index, question, finished]);

  useEffect(() => {
    if (!finished || reported.current) return;
    reported.current = true;
    onComplete({ results, correct: correctCount, total: results.length });
  }, [finished, onComplete, results, correctCount]);

  const sessionWords = useMemo(() => {
    const seen = new Map<string, Question>();
    for (const item of questions) {
      if (!seen.has(item.word.id)) seen.set(item.word.id, item);
    }
    return [...seen.values()];
  }, [questions]);

  function handleCheck() {
    if (!question || judged !== null) return;
    const ok = checkAnswer(question, value);
    setJudged(ok);
    setResults((prev) => [...prev, { wordId: question.word.id, correct: ok }]);
    if (!ok) speak(question.word.term, question.lang);
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setValue("");
    setJudged(null);
  }

  function replay() {
    if (!question) return;
    speak(question.word.term, question.lang);
  }

  function optionClass(option: string) {
    if (judged === null) return value === option ? "option selected" : "option";
    if (option === question?.answer) return "option correct";
    if (option === value) return "option wrong";
    return "option dim";
  }

  return (
    <div className="lesson-screen">
      <div className="lesson-top">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Leave lesson">
          <Icon name="x" size={18} />
        </button>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="lesson-count">
          {Math.min(index + 1, questions.length)}/{questions.length}
        </span>
      </div>

      {finished ? (
        <main className="lesson-main">
          <div className="summary-card card">
            <p className="eyebrow">{title}</p>
            <h2 className="summary-title">
              {correctCount === results.length ? "Perfect round." : "Nice work."}
            </h2>
            <div className="summary-stats">
              <div>
                <strong>+{sessionXp(correctCount, results.length)}</strong>
                <span>XP earned</span>
              </div>
              <div>
                <strong>
                  {results.length ? Math.round((correctCount / results.length) * 100) : 0}%
                </strong>
                <span>accuracy</span>
              </div>
              <div>
                <strong>{sessionWords.length}</strong>
                <span>words seen</span>
              </div>
            </div>
            <h3 className="summary-sub">Say them out loud</h3>
            <ul className="word-list">
              {sessionWords.map((item) => (
                <li key={item.word.id}>
                  <button type="button" className="word-row" onClick={() => speak(item.word.term, item.lang)}>
                    <span className="word-term">
                      {item.word.term}
                      {item.word.roman && <em>{item.word.roman}</em>}
                    </span>
                    <span className="word-translation">{item.word.translation}</span>
                    <Icon name="speaker" size={17} />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="btn-primary wide" onClick={onExit}>
              Back to path
            </button>
          </div>
        </main>
      ) : (
        question && (
          <main className="lesson-main">
            <p className="eyebrow">{kicker}</p>
            <h2 className="lesson-prompt">{question.instruction}</h2>

            <div className={`prompt-card${question.kind === "listen" ? " is-listen" : ""}`}>
              {question.kind === "listen" ? (
                <button type="button" className="speaker-btn" onClick={replay} aria-label="Play word">
                  <Icon name="speaker" size={30} />
                </button>
              ) : (
                <>
                  <strong>{question.prompt}</strong>
                  {question.sub && <span className="prompt-sub">{question.sub}</span>}
                  {question.speak && (
                    <button type="button" className="speaker-inline" onClick={replay} aria-label="Play word">
                      <Icon name="speaker" size={17} />
                    </button>
                  )}
                </>
              )}
            </div>

            {question.kind === "write" ? (
              <form
                className="write-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleCheck();
                }}
              >
                <input
                  className="write-input"
                  value={value}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  disabled={judged !== null}
                  placeholder="Type your answer…"
                  onChange={(event) => setValue(event.target.value)}
                />
                {question.hint && <span className="muted small">{question.hint}</span>}
                <button type="submit" className="btn-primary" disabled={!value.trim() || judged !== null}>
                  Check
                </button>
              </form>
            ) : (
              <div className="options">
                {question.options.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={optionClass(option)}
                    disabled={judged !== null}
                    onClick={() => setValue(option)}
                  >
                    <span>{option}</span>
                  </button>
                ))}
                {judged === null && (
                  <button
                    type="button"
                    className="btn-primary wide"
                    disabled={!value}
                    onClick={handleCheck}
                  >
                    Check
                  </button>
                )}
              </div>
            )}

            {judged !== null && (
              <div className={`feedback ${judged ? "ok" : "bad"}`}>
                <div className="feedback-head">
                  <span className="feedback-icon">
                    <Icon name={judged ? "check" : "x"} size={16} />
                  </span>
                  <strong>{judged ? "Exactly." : "Almost there."}</strong>
                </div>
                {!judged && (
                  <p className="feedback-answer">
                    {question.word.term} · {question.word.translation}
                  </p>
                )}
                <button type="button" className="btn-primary wide" onClick={handleNext}>
                  {isLast ? "Finish lesson" : "Continue"}
                </button>
              </div>
            )}
          </main>
        )
      )}
    </div>
  );
}
