export type LangCode = "fr" | "es" | "ja";

export interface Word {
  id: string;
  term: string;
  translation: string;
  roman?: string;
}

export interface Lesson {
  id: string;
  title: string;
  focus: string;
  words: Word[];
}

export interface Unit {
  id: string;
  title: string;
  blurb: string;
  lessons: Lesson[];
}

export interface Course {
  code: LangCode;
  name: string;
  native: string;
  flag: string;
  tagline: string;
  units: Unit[];
}

export interface LessonProgress {
  done: boolean;
  best: number;
  tries: number;
}

export interface WordStat {
  correct: number;
  wrong: number;
}

export interface Progress {
  lang: LangCode;
  xp: number;
  streak: number;
  lastDay: string;
  dailyDay: string;
  dailyXp: number;
  dailyGoal: number;
  lessons: Record<string, LessonProgress>;
  words: Record<string, WordStat>;
}

export interface WordResult {
  wordId: string;
  correct: boolean;
}

export interface SessionResult {
  results: WordResult[];
  correct: number;
  total: number;
}
