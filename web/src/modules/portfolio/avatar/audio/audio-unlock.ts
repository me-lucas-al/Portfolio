
type UnlockCallback = () => void

const callbacks = new Set<UnlockCallback>()
let listenersAttached = false
let firedThisLoad = false

function triggerAudioUnlockOnUserGesture(): void {
  if (firedThisLoad) return
  firedThisLoad = true
  window.removeEventListener("pointerdown", triggerAudioUnlockOnUserGesture)
  window.removeEventListener("keydown", triggerAudioUnlockOnUserGesture)
  callbacks.forEach((callback) => callback())
  callbacks.clear()
}

export function onAudioUnlockGesture(callback: UnlockCallback): void {
  if (firedThisLoad) return
  callbacks.add(callback)

  if (listenersAttached) return
  listenersAttached = true
  window.addEventListener("pointerdown", triggerAudioUnlockOnUserGesture, { once: true })
  window.addEventListener("keydown", triggerAudioUnlockOnUserGesture, { once: true })
}

export function hasAudioUnlockGestureFired(): boolean {
  return firedThisLoad
}
