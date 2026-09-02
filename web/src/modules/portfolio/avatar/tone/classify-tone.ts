import type { Locale } from "@/i18n"
import type { Tone } from "./tone"

const KNOWN_APOLOGETIC_STRINGS: Record<Locale, string[]> = {
  pt: [
    "Não foi possível responder agora. Tente novamente em instantes.",
    "Muitas mensagens em pouco tempo. Aguarde um instante e tente de novo.",
    "Limite máximo atingido, tente novamente amanhã.",
    "O modelo de IA está sobrecarregado neste momento. Tente novamente em alguns segundos.",
    "A resposta demorou mais do que o esperado. Tente novamente.",
    "Não consegui encontrar uma resposta fundamentada para essa pergunta agora. Tente reformular ou pergunte sobre a trajetória ou os projetos do Lucas.",
  ],
  en: [
    "Couldn't get a response right now. Please try again shortly.",
    "Too many messages in a short time. Please wait a moment and try again.",
    "Daily limit reached, please try again tomorrow.",
    "The AI model is overloaded right now. Please try again in a few seconds.",
    "The response took longer than expected. Please try again.",
    "I couldn't find a well-grounded answer for that right now. Try rephrasing, or ask about Lucas's background or projects.",
  ],
}

const APOLOGETIC_MARKERS: Record<Locale, string[]> = {
  pt: ["não consegui", "desculpe", "não sei"],
  en: ["sorry", "couldn't", "don't know"],
}

const SURPRISED_STARTERS: Record<Locale, string[]> = {
  pt: ["na verdade", "curiosamente"],
  en: ["actually", "interestingly"],
}

const POSITIVE_MARKERS: Record<Locale, string[]> = {
  pt: ["sim", "com certeza", "ótimo", "ótima", "excelente", "perfeito", "adorei"],
  en: ["yes", "sure", "great", "awesome", "excellent", "perfect"],
}

const SUPERLATIVE_MARKERS: Record<Locale, string[]> = {
  pt: ["incrível", "fantástico", "sensacional", "maravilhoso"],
  en: ["amazing", "fantastic", "incredible", "wonderful"],
}

const NEGATIVE_MARKERS: Record<Locale, string[]> = {
  pt: ["não", "infelizmente", "problema", "erro", "difícil", "nunca"],
  en: ["not", "unfortunately", "problem", "error", "difficult", "never"],
}

const TECHNICAL_MARKERS: Record<Locale, string[]> = {
  pt: ["api", "prisma", "porque", "banco de dados", "typescript", "next.js", "react", "arquitetura"],
  en: ["api", "prisma", "because", "database", "typescript", "next.js", "react", "architecture"],
}

const ENTHUSIASTIC_MAX_LENGTH = 200
const EXPLANATORY_MIN_LENGTH = 350
const EXPLANATORY_MIN_SENTENCES = 3
const EXPLANATORY_MIN_TECHNICAL_MARKERS = 2

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function containsPhrase(text: string, phrase: string): boolean {
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(phrase)}(?![\\p{L}\\p{N}])`, "iu")
  return pattern.test(text)
}

function containsAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => containsPhrase(text, phrase))
}

function startsWithAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => {
    const pattern = new RegExp(`^\\s*${escapeRegExp(phrase)}(?![\\p{L}\\p{N}])`, "iu")
    return pattern.test(text)
  })
}

function matchesKnownApologeticString(text: string, locale: Locale): boolean {
  const normalized = text.trim().toLowerCase()
  return KNOWN_APOLOGETIC_STRINGS[locale].some((known) => {
    const knownNormalized = known.toLowerCase()
    return (
      normalized === knownNormalized ||
      normalized.includes(knownNormalized) ||
      knownNormalized.includes(normalized)
    )
  })
}

function countSentences(text: string): number {
  return text
    .split(/[.!?]+(?:\s+|$)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean).length
}

function countTechnicalMarkers(text: string, locale: Locale): number {
  return TECHNICAL_MARKERS[locale].filter((marker) => containsPhrase(text, marker)).length
}

export function classifyTone(text: string, locale: Locale): Tone {
  const normalized = text.trim()
  if (!normalized) return "neutral"

  if (containsAny(normalized, APOLOGETIC_MARKERS[locale]) || matchesKnownApologeticString(normalized, locale)) {
    return "apologetic"
  }

  if (startsWithAny(normalized, SURPRISED_STARTERS[locale]) || normalized.includes("?")) {
    return "surprised"
  }

  const hasExclamation = normalized.includes("!")
  const hasPositiveMarker = containsAny(normalized, POSITIVE_MARKERS[locale])
  const hasSuperlativeMarker = containsAny(normalized, SUPERLATIVE_MARKERS[locale])
  const hasNegativeMarker = containsAny(normalized, NEGATIVE_MARKERS[locale])

  if (hasExclamation && normalized.length < ENTHUSIASTIC_MAX_LENGTH && (hasPositiveMarker || hasSuperlativeMarker)) {
    return "enthusiastic"
  }

  if (hasPositiveMarker || (hasExclamation && !hasNegativeMarker)) {
    return "positive"
  }

  const technicalMarkerCount = countTechnicalMarkers(normalized, locale)
  if (
    normalized.length > EXPLANATORY_MIN_LENGTH ||
    technicalMarkerCount >= EXPLANATORY_MIN_TECHNICAL_MARKERS ||
    countSentences(normalized) >= EXPLANATORY_MIN_SENTENCES
  ) {
    return "explanatory"
  }

  return "neutral"
}
