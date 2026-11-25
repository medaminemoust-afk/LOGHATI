import type { LangCode } from "../types";

const VOICE_LANG: Record<LangCode, string> = {
  fr: "fr-FR",
  es: "es-ES",
  ja: "ja-JP",
};

export function speak(text: string, lang: LangCode) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = VOICE_LANG[lang];
  utterance.rate = lang === "ja" ? 0.82 : 0.9;
  const voice = synth.getVoices().find((item) => item.lang.toLowerCase().startsWith(lang));
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
}
