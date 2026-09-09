import type { NarrationBeat } from "./narration-script"

export type NarrationStatus = "idle" | "playing" | "awaiting-advance" | "paused-for-question" | "finished"

interface NarrationState {
  status: NarrationStatus
  script: NarrationBeat[]
  beatIndex: number
}

type Listener = () => void

let snapshot: NarrationState = { status: "idle", script: [], beatIndex: 0 }

const listeners = new Set<Listener>()

function notifyNarrationListeners(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeNarration(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getNarrationSnapshot(): Readonly<NarrationState> {
  return snapshot
}

export function setNarrationState(patch: Partial<NarrationState>): void {
  snapshot = { ...snapshot, ...patch }
  notifyNarrationListeners()
}
