import { playBlip } from "../audio/blip-player"
import { skipTyping, startTyping, stopTyping } from "./typing-engine"
import { writeTypingSurfaces } from "./typing-surface-registry"

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

export function startTypingSpeech(messageId: number, text: string): void {

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

export function stopTypingSpeech(): void {
  stopTyping()
  setState({ messageId: null, fullText: "", isTyping: false })
}

export function skipTypingSpeech(): void {
  skipTyping()
}
