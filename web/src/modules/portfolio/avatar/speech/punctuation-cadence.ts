
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

export function punctuationHold(char: string, precedingText: string): number {
  if (char === "…") return ELLIPSIS_HOLD_MS
  if (char === "." && precedingText.endsWith("..")) return ELLIPSIS_HOLD_MS

  return HOLD_MS[char] ?? 0
}
