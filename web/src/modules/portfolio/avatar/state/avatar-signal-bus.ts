/**
 * Module-scope mutable store bridging the assistant module's React state
 * (is the chat overlay open, and where does its avatar-bust header slot sit
 * on screen right now) to the avatar side, which reads it from a plain
 * getter - the same "mutable value written by something outside React,
 * read back without going through React state" convention
 * `engine/layers/look-at-layer.ts` already uses for pointer position.
 *
 * Deliberately no pub/sub here: nothing subscribes to changes. The avatar
 * side (see `../use-avatar-framing.ts`) re-checks this on its own cadence
 * (mount, resize, a short interval) instead of being pushed to.
 *
 * Three-less, like `../contract.ts` which is the only place allowed to call
 * `setOverlayState` from outside this module.
 *
 * Fase 6 adds `mouthOpen` (0..1), the same "write from outside, poll once
 * per frame" convention: `audio/lip-sync-analyser.ts` writes it every tick
 * while speech audio is playing (and forces it back to `0` the instant
 * playback stops), and `engine/layers/viseme-layer.ts` reads it once per
 * render-loop frame - never re-shaping or re-damping it, that's already done
 * by the analyser.
 *
 * Fase 7 adds two more fields, same convention:
 * - `tone`: written by `contract.ts`'s `setAvatarTone` (itself called from
 *   `modules/portfolio/assistant/*` after classifying a response's text
 *   client-side, see `../tone/classify-tone.ts`), read once per frame by
 *   `engine/layers/emotion-layer.ts`.
 * - `thinking`: written by `contract.ts`'s `setAvatarThinking`, driven by
 *   `useAssistantChat`'s `loading` state; also read by
 *   `engine/layers/emotion-layer.ts`, which is the one place that decides
 *   how (and whether, given how recently it flipped true) to show it.
 */

import type { Tone } from "../tone/tone"

export interface AvatarOverlayRect {
  x: number
  y: number
  width: number
  height: number
}

interface AvatarSignalState {
  overlayOpen: boolean
  overlayAnchorRect: AvatarOverlayRect | null
  mouthOpen: number
  tone: Tone
  thinking: boolean
}

const state: AvatarSignalState = {
  overlayOpen: false,
  overlayAnchorRect: null,
  mouthOpen: 0,
  tone: "neutral",
  thinking: false,
}

/** Written by `contract.ts`'s `setAvatarOverlayState` on behalf of the assistant module. */
export function setOverlayState(open: boolean, anchorRect: AvatarOverlayRect | null): void {
  state.overlayOpen = open
  state.overlayAnchorRect = open ? anchorRect : null
}

/** Read by the avatar module's own framing hook. Never mutate the returned object. */
export function getOverlayState(): Readonly<AvatarSignalState> {
  return state
}

/** Written every tick by `audio/lip-sync-analyser.ts` while speech is playing, and once with `0` when it stops. */
export function setMouthOpen(value: number): void {
  state.mouthOpen = value
}

/** Read once per frame by `engine/layers/viseme-layer.ts`. */
export function getMouthOpen(): number {
  return state.mouthOpen
}

/** Written by `contract.ts`'s `setAvatarTone`, which also owns the "hold, then decay to neutral" timing. */
export function setTone(value: Tone): void {
  state.tone = value
}

/** Read once per frame by `engine/layers/emotion-layer.ts`. */
export function getTone(): Tone {
  return state.tone
}

/** Written by `contract.ts`'s `setAvatarThinking`, driven by `useAssistantChat`'s `loading` state. */
export function setThinking(value: boolean): void {
  state.thinking = value
}

/** Read once per frame by `engine/layers/emotion-layer.ts`. */
export function getThinking(): boolean {
  return state.thinking
}
