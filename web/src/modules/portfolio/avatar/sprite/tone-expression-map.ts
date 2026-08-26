import type { Tone } from "../tone/tone"

export type Expression = "neutral" | "positive" | "apologetic" | "surprised"

/**
 * Reduces the six-value `Tone` taxonomy (`../tone/tone.ts`) down to the four
 * visual expressions this module has sprite frames for. `classify-tone.ts`
 * itself never changes - only this mapping decides what the sprite shows.
 */
const TONE_TO_EXPRESSION: Record<Tone, Expression> = {
  neutral: "neutral",
  explanatory: "neutral",
  positive: "positive",
  enthusiastic: "positive",
  apologetic: "apologetic",
  surprised: "surprised",
}

export function toneToExpression(tone: Tone): Expression {
  return TONE_TO_EXPRESSION[tone]
}
