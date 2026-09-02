
import type { Tone } from "../tone/tone"

interface AvatarSignalState {
  overlayOpen: boolean
  mouthOpen: number
  tone: Tone
  thinking: boolean
}

type Listener = () => void

let snapshot: AvatarSignalState = {
  overlayOpen: false,
  mouthOpen: 0,
  tone: "neutral",
  thinking: false,
}

const listeners = new Set<Listener>()

function notifyAvatarSignalListeners(): void {
  listeners.forEach((listener) => listener())
}

function updateAvatarSignalState(patch: Partial<AvatarSignalState>): void {
  snapshot = { ...snapshot, ...patch }
  notifyAvatarSignalListeners()
}

export function subscribeAvatarSignal(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getAvatarSignalSnapshot(): Readonly<AvatarSignalState> {
  return snapshot
}

export function setOverlayState(open: boolean): void {
  if (snapshot.overlayOpen === open) return
  updateAvatarSignalState({ overlayOpen: open })
}

export function setMouthOpen(value: number): void {
  if (snapshot.mouthOpen === value) return
  updateAvatarSignalState({ mouthOpen: value })
}

export function setTone(value: Tone): void {
  if (snapshot.tone === value) return
  updateAvatarSignalState({ tone: value })
}

export function setThinking(value: boolean): void {
  if (snapshot.thinking === value) return
  updateAvatarSignalState({ thinking: value })
}
