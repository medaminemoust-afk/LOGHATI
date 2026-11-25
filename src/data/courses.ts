import type { Course, Lesson, Word } from "../types";

type Row = [term: string, translation: string, roman?: string];

function lesson(code: string, id: string, title: string, focus: string, rows: Row[]): Lesson {
  return {
    id: `${code}.${id}`,
    title,
    focus,
    words: rows.map((row, index) => ({
      id: `${code}.${id}.${index}`,
      term: row[0],
      translation: row[1],
      ...(row[2] ? { roman: row[2] } : {}),
    })),
  };
}

const french: Course = {
  code: "fr",
  name: "French",
  native: "Français",
  flag: "🇫🇷",
  tagline: "Small words, warm cafés, and a language that sounds like a song.",
  units: [
    {
      id: "fr.u1",
      title: "First words",
      blurb: "Greetings, politeness and introducing yourself.",
      lessons: [
        lesson("fr", "u1l1", "Bonjour !", "Greetings", [
          ["bonjour", "hello"],
          ["bonsoir", "good evening"],
          ["salut", "hi"],
          ["au revoir", "goodbye"],
          ["merci", "thank you"],
          ["oui", "yes"],
        ]),
        lesson("fr", "u1l2", "Politesse", "Being polite", [
          ["s'il vous plaît", "please"],
          ["pardon", "sorry"],
          ["excusez-moi", "excuse me"],
          ["de rien", "you're welcome"],
          ["bonne nuit", "good night"],
          ["non", "no"],
        ]),
        lesson("fr", "u1l3", "Je m'appelle", "Introductions", [
          ["je m'appelle...", "my name is..."],
          ["comment tu t'appelles ?", "what's your name?"],
          ["enchanté", "nice to meet you"],
          ["je suis", "I am"],
          ["et toi ?", "and you?"],
          ["moi c'est...", "I'm..."],
        ]),
      ],
    },
    {
      id: "fr.u2",
      title: "Everyday French",
      blurb: "Cafés, numbers and getting around town.",
      lessons: [
        lesson("fr", "u2l1", "Au café", "Ordering food", [
          ["un café", "a coffee"],
          ["l'eau", "water"],
          ["le pain", "bread"],
          ["l'addition", "the bill"],
          ["un croissant", "a croissant"],
          ["du thé", "tea"],
        ]),
        lesson("fr", "u2l2", "Les nombres", "Numbers 1 to 6", [
          ["un", "one"],
          ["deux", "two"],
          ["trois", "three"],
          ["quatre", "four"],
          ["cinq", "five"],
          ["six", "six"],
        ]),
        lesson("fr", "u2l3", "En ville", "Around town", [
          ["la gare", "the train station"],
          ["le marché", "the market"],
          ["la rue", "the street"],
          ["la boulangerie", "the bakery"],
          ["à droite", "to the right"],
          ["à gauche", "to the left"],
        ]),
      ],
    },
  ],
};

const spanish: Course = {
  code: "es",
  name: "Spanish",
  native: "Español",
  flag: "🇪🇸",
  tagline: "Sunny vowels, friendly people, and words you can use today.",
  units: [
    {
      id: "es.u1",
      title: "Primeros pasos",
      blurb: "Greetings, politeness and first introductions.",
      lessons: [
        lesson("es", "u1l1", "¡Hola!", "Greetings", [
          ["hola", "hello"],
          ["buenos días", "good morning"],
          ["buenas noches", "good night"],
          ["adiós", "goodbye"],
          ["gracias", "thank you"],
          ["sí", "yes"],
        ]),
        lesson("es", "u1l2", "Por favor", "Being polite", [
          ["por favor", "please"],
          ["perdón", "sorry"],
          ["lo siento", "I'm sorry"],
          ["de nada", "you're welcome"],
          ["disculpe", "excuse me"],
          ["hasta luego", "see you later"],
        ]),
        lesson("es", "u1l3", "Me llamo", "Introductions", [
          ["me llamo...", "my name is..."],
          ["¿cómo te llamas?", "what's your name?"],
          ["mucho gusto", "nice to meet you"],
          ["soy", "I am"],
          ["¿y tú?", "and you?"],
          ["encantado", "delighted"],
        ]),
      ],
    },
    {
      id: "es.u2",
      title: "El día a día",
      blurb: "Cafés, numbers and finding your way.",
      lessons: [
        lesson("es", "u2l1", "En el café", "Ordering food", [
          ["un café", "a coffee"],
          ["el agua", "water"],
          ["el pan", "bread"],
          ["la cuenta", "the bill"],
          ["una cerveza", "a beer"],
          ["el vino", "wine"],
        ]),
        lesson("es", "u2l2", "Los números", "Numbers 1 to 6", [
          ["uno", "one"],
          ["dos", "two"],
          ["tres", "three"],
          ["cuatro", "four"],
          ["cinco", "five"],
          ["seis", "six"],
        ]),
        lesson("es", "u2l3", "En la ciudad", "Around town", [
          ["la estación", "the station"],
          ["el mercado", "the market"],
          ["la calle", "the street"],
          ["la playa", "the beach"],
          ["a la derecha", "to the right"],
          ["a la izquierda", "to the left"],
        ]),
      ],
    },
  ],
};

const japanese: Course = {
  code: "ja",
  name: "Japanese",
  native: "日本語",
  flag: "🇯🇵",
  tagline: "Quiet politeness, tiny words, and a script you'll start to recognise.",
  units: [
    {
      id: "ja.u1",
      title: "はじめまして",
      blurb: "Greetings, politeness and first introductions.",
      lessons: [
        lesson("ja", "u1l1", "Greetings", "Greetings", [
          ["こんにちは", "hello", "konnichiwa"],
          ["おはよう", "good morning", "ohayō"],
          ["こんばんは", "good evening", "konbanwa"],
          ["さようなら", "goodbye", "sayōnara"],
          ["ありがとう", "thank you", "arigatō"],
          ["はい", "yes", "hai"],
        ]),
        lesson("ja", "u1l2", "Politeness", "Being polite", [
          ["すみません", "excuse me", "sumimasen"],
          ["ごめんなさい", "sorry", "gomen nasai"],
          ["お願いします", "please", "onegai shimasu"],
          ["どういたしまして", "you're welcome", "dō itashimashite"],
          ["おやすみなさい", "good night", "oyasuminasai"],
          ["いいえ", "no", "iie"],
        ]),
        lesson("ja", "u1l3", "Introductions", "Introducing yourself", [
          ["はじめまして", "nice to meet you", "hajimemashite"],
          ["お名前は？", "what's your name?", "onamae wa?"],
          ["学生", "student", "gakusei"],
          ["日本人", "Japanese person", "nihonjin"],
          ["私は…です", "I am...", "watashi wa ... desu"],
          ["よろしく", "pleased to meet you", "yoroshiku"],
        ]),
      ],
    },
    {
      id: "ja.u2",
      title: "Everyday Japanese",
      blurb: "Cafés, numbers and words you'll see on the street.",
      lessons: [
        lesson("ja", "u2l1", "Café", "Ordering food", [
          ["コーヒー", "coffee", "kōhī"],
          ["水", "water", "mizu"],
          ["パン", "bread", "pan"],
          ["お会計", "the bill", "okaikei"],
          ["お茶", "tea", "ocha"],
          ["ケーキ", "cake", "kēki"],
        ]),
        lesson("ja", "u2l2", "Numbers", "Numbers 1 to 6", [
          ["一", "one", "ichi"],
          ["二", "two", "ni"],
          ["三", "three", "san"],
          ["四", "four", "yon"],
          ["五", "five", "go"],
          ["六", "six", "roku"],
        ]),
        lesson("ja", "u2l3", "In town", "Around town", [
          ["駅", "station", "eki"],
          ["市場", "market", "ichiba"],
          ["道", "street", "michi"],
          ["右", "right", "migi"],
          ["左", "left", "hidari"],
          ["家", "house", "ie"],
        ]),
      ],
    },
  ],
};

export const courses: Course[] = [french, spanish, japanese];

export function courseLessons(course: Course): Lesson[] {
  return course.units.flatMap((unit) => unit.lessons);
}

export function courseWords(course: Course): Word[] {
  return courseLessons(course).flatMap((lesson) => lesson.words);
}

export function courseWordCount(course: Course): number {
  return courseWords(course).length;
}
