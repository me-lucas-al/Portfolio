
type UnlockCallback = () => void

const callbacks = new Set<UnlockCallback>()
let listenersAttached = false
let firedThisLoad = false

function handleGesture(): void {
  if (firedThisLoad) return
  firedThisLoad = true
  window.removeEventListener("pointerdown", handleGesture)
  window.removeEventListener("keydown", handleGesture)
  callbacks.forEach((callback) => callback())
  callbacks.clear()
}

export function onAudioUnlockGesture(callback: UnlockCallback): void {
  if (firedThisLoad) return
  callbacks.add(callback)

  if (listenersAttached) return
  listenersAttached = true
  window.addEventListener("pointerdown", handleGesture, { once: true })
  window.addEventListener("keydown", handleGesture, { once: true })
}

export function hasAudioUnlockGestureFired(): boolean {
  return firedThisLoad
}
