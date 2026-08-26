/**
 * Module-scope mutable store bridging state written from outside React (the
 * assistant module's overlay-open flag, the typing/blink/mouth timers) to
 * whatever reads it back - the same "write from outside, poll or subscribe
 * without going through React state" convention this module has always used.
 *
 * `overlayOpen` has no anchor rect anymore: the 2D sprite avatar has no
 * camera to point, so there is nothing to measure. `blinking` is new -
 * written by `../sprite/blink-timer.ts`, read by `../sprite/avatar-sprite.tsx`.
 *
 * `mouthOpen`, `tone`, and `thinking` keep their original semantics:
 * `mouthOpen` is written by `../mouth/mouth-source.ts` (typing tick or real
 * audio amplitude), `tone` by `../contract.ts`'s `setAvatarTone`, `thinking`
 * by `../contract.ts`'s `setAvatarThinking`.
 *
 * `getAvatarSignalSnapshot()` always returns the SAME object reference until
 * something actually changes, then swaps in a new one - `useSyncExternalStore`
 * bails out of re-rendering a subscriber when `getSnapshot()` returns a
 * value `Object.is`-equal to what it returned last time, so mutating one
 * shared object in place (same reference, new field value) would silently
 * never notify subscribers.
 */

import type { Tone } from "../tone/tone"

interface AvatarSignalState {
  overlayOpen: boolean
  mouthOpen: number
  blinking: boolean
  tone: Tone
  thinking: boolean
}

type Listener = () => void

let snapshot: AvatarSignalState = {
  overlayOpen: false,
  mouthOpen: 0,
  blinking: false,
  tone: "neutral",
  thinking: false,
}

const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function commit(patch: Partial<AvatarSignalState>): void {
  snapshot = { ...snapshot, ...patch }
  emit()
}

/** `avatar-sprite.tsx` subscribes via `useSyncExternalStore` - every setter below calls this after replacing the snapshot. */
export function subscribeAvatarSignal(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Read by `avatar-sprite.tsx` - never mutate the returned object. */
export function getAvatarSignalSnapshot(): Readonly<AvatarSignalState> {
  return snapshot
}

/** Written by `contract.ts`'s `setAvatarOverlayState` on behalf of the assistant module. */
export function setOverlayState(open: boolean): void {
  if (snapshot.overlayOpen === open) return
  commit({ overlayOpen: open })
}

/** Written every tick by `../mouth/mouth-source.ts`. */
export function setMouthOpen(value: number): void {
  if (snapshot.mouthOpen === value) return
  commit({ mouthOpen: value })
}

/** Written by `../sprite/blink-timer.ts`. */
export function setBlinking(value: boolean): void {
  if (snapshot.blinking === value) return
  commit({ blinking: value })
}

/** Written by `contract.ts`'s `setAvatarTone`, which also owns the "hold, then decay to neutral" timing. */
export function setTone(value: Tone): void {
  if (snapshot.tone === value) return
  commit({ tone: value })
}

/** Written by `contract.ts`'s `setAvatarThinking`, driven by `useAssistantChat`'s `loading` state. */
export function setThinking(value: boolean): void {
  if (snapshot.thinking === value) return
  commit({ thinking: value })
}
