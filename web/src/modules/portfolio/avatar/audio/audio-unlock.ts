/**
 * Shared iOS/Safari audio-unlock gesture, extracted out of `speech-player.ts`
 * so `blip-player.ts` can register for the exact same `pointerdown`/`keydown`
 * gesture without duplicating the listener wiring (both need *some* real
 * user gesture to have happened before their respective `AudioContext`s can
 * produce sound - `speech-player.ts`'s callback additionally does a
 * throwaway `<audio>` element play/pause, which stays local to that file).
 *
 * Registering more than once is fine - each callback fires exactly once, on
 * whichever gesture happens first this page load.
 */
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

/** Registers `callback` to fire once, on the first `pointerdown`/`keydown` this page load. No-op if that gesture already happened. */
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
