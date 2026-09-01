/**
 * Public contract for the avatar module.
 *
 * This is the ONLY file other modules (e.g. the assistant widget) are
 * allowed to import from `modules/portfolio/avatar`. `./state/avatar-signal-bus`
 * is a fine import from here - it just must never be reached directly by a
 * consumer outside this module; go through the setters below instead.
 *
 * The avatar is a 2D sprite (`<img>` swap, see `./sprite/avatar-sprite.tsx`) -
 * there is no camera/viewport to point, so this contract carries no rect/
 * framing types at all.
 */

import { setOverlayState, setTone, setThinking } from "./state/avatar-signal-bus"
import type { Tone } from "./tone/tone"

export { useSpeechPlayer } from "./audio/use-speech-player"
export type { UseSpeechPlayerResult } from "./audio/use-speech-player"
export { classifyTone } from "./tone/classify-tone"
export type { Tone } from "./tone/tone"
export { AvatarSprite } from "./sprite/avatar-sprite"
export type { AvatarSpriteVariant } from "./sprite/avatar-sprite"
export { AvatarStage } from "./avatar-stage"
export { TypedText } from "./speech/typed-text"
export { AnswerBalloon } from "./speech/answer-balloon"
export { useTypingSpeech } from "./speech/use-typing-speech"
export type { UseTypingSpeechResult } from "./speech/use-typing-speech"

/** High-level state the avatar can be in. */
export type AvatarState = "idle" | "loading" | "error" | "unsupported"

/** Minimal handle a consumer could use to react to state changes. */
export interface AvatarStatus {
  state: AvatarState
}

/**
 * Tells the avatar whether the assistant overlay panel is open. When open,
 * the busts renders in the panel header and the mini corner avatar hides;
 * when closed, the mini avatar shows again. This is one of the surfaces
 * `modules/portfolio/assistant/*` is allowed to call into this module.
 */
export function setAvatarOverlayState(open: boolean): void {
  setOverlayState(open)
}

// How long a non-neutral tone holds before this module reverts the
// expression back to "neutral" on its own. The assistant module never has
// to remember to clear a tone itself.
const TONE_HOLD_MS = 2500

let toneRevertTimeoutId: ReturnType<typeof setTimeout> | null = null

/**
 * Pushes a newly classified tone into the avatar and schedules it to revert
 * to "neutral" on its own after `TONE_HOLD_MS`. Calling this again before the
 * timeout fires (e.g. a fast follow-up message) just re-schedules it.
 */
export function setAvatarTone(tone: Tone): void {
  if (toneRevertTimeoutId !== null) {
    clearTimeout(toneRevertTimeoutId)
    toneRevertTimeoutId = null
  }

  setTone(tone)
  if (tone === "neutral") return

  toneRevertTimeoutId = setTimeout(() => {
    toneRevertTimeoutId = null
    setTone("neutral")
  }, TONE_HOLD_MS)
}

/**
 * Tells the avatar whether the assistant is currently waiting on a
 * response - drive this straight from `useAssistantChat`'s `loading` state.
 */
export function setAvatarThinking(thinking: boolean): void {
  setThinking(thinking)
}
