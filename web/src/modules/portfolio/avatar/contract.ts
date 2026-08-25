/**
 * Public contract for the avatar module.
 *
 * This is the ONLY file other modules (e.g. the assistant widget) are
 * allowed to import from `modules/portfolio/avatar`. It must never import
 * from `./engine/*` or from `three` - keeping it dependency-free lets any
 * consumer reference these types/functions without pulling three.js into
 * their bundle. `./state/avatar-signal-bus` is a fine import here (it's
 * three-less too) - it just must never be reached directly by a consumer
 * outside this module; go through `setAvatarOverlayState` below instead.
 *
 * Keep this small. Later phases (audio/lip-sync, expressions, emotion/tone)
 * extend this contract - do not pre-build fields for them here.
 *
 * Fase 6 adds `useSpeechPlayer`: it lives under `./audio/*` (not `./engine/*`)
 * precisely because it's three-less too - the DOM `<audio>` element's
 * lifecycle has nothing to do with three.js, only the `mouthOpen` value it
 * derives (written into the same signal bus above) is read by the engine's
 * render loop. Re-exporting it here, instead of letting the assistant
 * module import `./audio/use-speech-player` directly, keeps the "only
 * `contract.ts`" import rule intact either way.
 */

import { setOverlayState } from "./state/avatar-signal-bus"

export { useSpeechPlayer } from "./audio/use-speech-player"
export type { UseSpeechPlayerResult } from "./audio/use-speech-player"

/** High-level state the avatar can be in. Extended by later phases. */
export type AvatarState = "idle" | "loading" | "error" | "unsupported"

/** Minimal handle a consumer could use to react to state changes. */
export interface AvatarStatus {
  state: AvatarState
}

/** A viewport-relative rect in CSS pixels, shaped like `DOMRectReadOnly` (x/y/width/height only). */
export interface AvatarRect {
  x: number
  y: number
  width: number
  height: number
}

/** Named on-screen framings the avatar can morph between (Fase 4). */
export type AvatarFramingName = "mini" | "overlay-bust"

/**
 * Tells the avatar engine whether the assistant overlay is open and, if so,
 * where its avatar-bust header slot currently sits on screen (viewport-
 * relative CSS pixels, e.g. straight from `element.getBoundingClientRect()`).
 * Together with `useSpeechPlayer` above, this is one of the two surfaces
 * `modules/portfolio/assistant/*` is allowed to call into this module.
 *
 * The avatar's own mini/overlay framing decision (see
 * `use-avatar-framing.ts`) polls this on its own cadence - calling this does
 * not synchronously trigger anything, and is safe to call as often as the
 * caller likes (e.g. every `ResizeObserver` tick).
 *
 * Pass `open: false` (or a null rect) to hand control back to the idle mini
 * avatar's corner framing.
 */
export function setAvatarOverlayState(open: boolean, anchorRect: DOMRectReadOnly | null): void {
  setOverlayState(
    open,
    anchorRect
      ? { x: anchorRect.x, y: anchorRect.y, width: anchorRect.width, height: anchorRect.height }
      : null
  )
}
