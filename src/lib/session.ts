import type { Course, LangCode, Word } from "../types";

export type QuestionKind = "meaning" | "reverse" | "listen" | "write";

export interface Question {
  id: string;
  kind: QuestionKind;
  instruction: string;
  prompt: string;
  sub?: string;
  hint?: string;
  speak?: string;
  options: string[];
  answer: string;
  word: Word;
  lang: LangCode;
}

const LANG_LABEL: Record<LangCode, string> = {
  fr: "French",
  es: "Spanish",
  ja: "Japanese",
};

const KINDS: QuestionKind[] = ["meaning", "listen", "reverse", "write"];

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿¡?!.,;:'"’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function distractors(pool: Word[], word: Word, field: "term" | "translation"): string[] {
  const seen = new Set<string>([word[field]]);
  const picked: string[] = [];
  for (const candidate of shuffle(pool)) {
    const value = candidate[field];
    if (candidate.id === word.id || seen.has(value)) continue;
    seen.add(value);
    picked.push(value);
    if (picked.length === 3) break;
  }
  return picked;
}

export function buildSession(course: Course, words: Word[], lang: LangCode): Question[] {
  const pool = course.units.flatMap((unit) => unit.lessons.flatMap((lesson) => lesson.words));
  return shuffle(words)
    .slice(0, 10)
    .map((word, index) => {
      const kind = KINDS[index % KINDS.length];
      const field: "term" | "translation" = kind === "reverse" ? "term" : "translation";
      const answer = word[field];
      const options =
        kind === "write" ? [] : shuffle([answer, ...distractors(pool, word, field)]);

      const base: Question = {
        id: `${word.id}.${kind}`,
        kind,
        instruction: "",
        prompt: "",
        options,
        answer,
        word,
        lang,
      };

      switch (kind) {
        case "meaning":
          return {
            ...base,
            instruction: "What does this mean?",
            prompt: word.term,
            sub: word.roman,
            speak: word.term,
          };
        case "listen":
          return {
            ...base,
            instruction: "Tap what you hear",
            prompt: "Listen",
            speak: word.term,
          };
        case "reverse":
          return {
            ...base,
            instruction: "How do you say this?",
            prompt: word.translation,
          };
        case "write":
        default:
          return {
            ...base,
            instruction: `Type it in ${LANG_LABEL[lang]}`,
            prompt: word.translation,
            hint: word.roman ? "Romaji is fine" : undefined,
            speak: word.term,
          };
      }
    });
}

export function checkAnswer(question: Question, input: string): boolean {
  if (question.kind !== "write") return input === question.answer;
  const accepted = normalize(question.word.term);
  const roman = question.word.roman ? normalize(question.word.roman) : "";
  const typed = normalize(input);
  return typed.length > 0 && (typed === accepted || typed === roman);
}

export function sessionXp(correct: number, total: number): number {
  const perfect = total > 0 && correct === total;
  return correct * 8 + (perfect ? 15 : 0);
}
