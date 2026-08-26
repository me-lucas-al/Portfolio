/**
 * Extra delay (ms) `typing-engine.ts` holds after revealing a given
 * character, on top of its own base per-character delay - the pause that
 * makes typewriter reveal read like speech instead of a metronome.
 */
const HOLD_MS: Record<string, number> = {
  ",": 180,
  ";": 180,
  ":": 180,
  ".": 320,
  "!": 320,
  "?": 320,
  "\n": 260,
}

const ELLIPSIS_HOLD_MS = 420

/** `precedingText` is the text already revealed BEFORE `char` (not including it). */
export function punctuationHold(char: string, precedingText: string): number {
  if (char === "…") return ELLIPSIS_HOLD_MS
  if (char === "." && precedingText.endsWith("..")) return ELLIPSIS_HOLD_MS

  return HOLD_MS[char] ?? 0
}
