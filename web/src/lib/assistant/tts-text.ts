// Hard ceiling on how much of an answer gets synthesized to speech. Chosen to
// keep synthesis wall-clock (and therefore /api/tts's maxDuration exposure)
// bounded: ~700 chars of PT text measured at ~38s wall-clock against
// gemini-2.5-flash-preview-tts, so 800 chars stays in the same ballpark.
export const MAX_TTS_CHARS = 800;

const SENTENCE_BOUNDARY_CHARS = [".", "!", "?", "\n"];

// Truncates at the last sentence boundary at or before the limit, so the
// spoken version never cuts off mid-word or mid-sentence. Falls back to a
// hard cut only when no boundary exists in range at all. The chat balloon
// still renders the full, untruncated answer - only the spoken version is
// shortened.
export function truncateForSpeech(text: string, maxChars: number = MAX_TTS_CHARS): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;

  const window = trimmed.slice(0, maxChars);
  let lastBoundary = -1;
  for (const boundaryChar of SENTENCE_BOUNDARY_CHARS) {
    const index = window.lastIndexOf(boundaryChar);
    if (index > lastBoundary) lastBoundary = index;
  }

  if (lastBoundary === -1) return window.trim();
  return window.slice(0, lastBoundary + 1).trim();
}
