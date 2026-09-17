interface AssistantBridgeState {
  phaseContext: string | null
  openRequested: boolean
  assistantOpen: boolean
}

type Listener = () => void

let snapshot: AssistantBridgeState = { phaseContext: null, openRequested: false, assistantOpen: false }

const listeners = new Set<Listener>()

function notifyAssistantBridgeListeners(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeAssistantBridge(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getAssistantBridgeSnapshot(): Readonly<AssistantBridgeState> {
  return snapshot
}

export function requestAssistantOpenWithPhaseContext(phaseContext: string): void {
  snapshot = { ...snapshot, phaseContext, openRequested: true }
  notifyAssistantBridgeListeners()
}

export function acknowledgeAssistantOpenRequest(): void {
  if (!snapshot.openRequested) return

  snapshot = { ...snapshot, openRequested: false }
  notifyAssistantBridgeListeners()
}

export function setAssistantOpenState(open: boolean): void {
  if (snapshot.assistantOpen === open) return

  snapshot = { ...snapshot, assistantOpen: open, phaseContext: open ? snapshot.phaseContext : null }
  notifyAssistantBridgeListeners()
}
