
export const MAX_TTS_CHARS = 800;

const SENTENCE_BOUNDARY_CHARS = [".", "!", "?", "\n"];

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
