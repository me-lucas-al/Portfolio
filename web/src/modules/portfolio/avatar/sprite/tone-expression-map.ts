import type { Tone } from "../tone/tone"

export type Expression = "neutral" | "positive" | "apologetic" | "surprised"

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
