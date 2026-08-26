import { playBlip } from "../audio/blip-player"
import { skipTyping, startTyping, stopTyping } from "./typing-engine"
import { writeTypingSurfaces } from "./typing-surface-registry"

/**
 * Module-scope store for "which message is currently typing, and its full
 * text" - read by both `use-typing-speech.ts` (so `assistant-widget.tsx` can
 * pass `isTyping` down to the right message bubble) and `speech-balloon.tsx`
 * directly (a sibling component tree mounted by `avatar-stage.tsx`, with no
 * React ancestor in common with the assistant panel - a module-scope store
 * is what lets both read the same "is typing" flag without prop drilling).
 *
 * This is a small, React-friendly (`useSyncExternalStore`-subscribable)
 * store OVER `typing-engine.ts`, not a replacement for it - the engine still
 * owns the actual per-character reveal/mouth/blip timing via direct DOM
 * writes; this store only tracks the coarse "typing started/stopped" fact
 * that the two render surfaces need to decide what to show.
 */
interface TypingSpeechState {
  messageId: number | null
  fullText: string
  isTyping: boolean
}

let snapshot: TypingSpeechState = { messageId: null, fullText: "", isTyping: false }
const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

// Always replaces `snapshot` with a new object reference instead of mutating
// in place - `useSyncExternalStore` (see `use-typing-speech.ts` and
// `speech-balloon.tsx`) bails out of re-rendering when `getSnapshot()`
// returns something `Object.is`-equal to last time, so an in-place mutation
// of a shared object would never actually notify subscribers.
function setState(patch: Partial<TypingSpeechState>): void {
  snapshot = { ...snapshot, ...patch }
  emit()
}

export function subscribeTypingSpeech(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getTypingSpeechSnapshot(): Readonly<TypingSpeechState> {
  return snapshot
}

/** Starts the typing engine for `text`, superseding whatever was typing before. */
export function startTypingSpeech(messageId: number, text: string): void {
  // Under `prefers-reduced-motion`, skip the char-by-char reveal entirely -
  // no blips, no mouth movement, text appears whole immediately.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    stopTyping()
    writeTypingSurfaces(text)
    setState({ messageId, fullText: text, isTyping: false })
    return
  }

  setState({ messageId, fullText: text, isTyping: true })
  startTyping(text, {
    onBlip: playBlip,
    onDone: () => setState({ isTyping: false }),
  })
}

/** Aborts typing immediately - used when a new message is sent, or the panel closes. */
export function stopTypingSpeech(): void {
  stopTyping()
  setState({ messageId: null, fullText: "", isTyping: false })
}

/** Reveals the rest of the current message instantly (click-to-skip, or `prefers-reduced-motion`). */
export function skipTypingSpeech(): void {
  skipTyping()
}
