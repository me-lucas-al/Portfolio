
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

export type AvatarState = "idle" | "loading" | "error" | "unsupported"

export interface AvatarStatus {
  state: AvatarState
}

export function setAvatarOverlayState(open: boolean): void {
  setOverlayState(open)
}

const TONE_HOLD_MS = 2500

let toneRevertTimeoutId: ReturnType<typeof setTimeout> | null = null

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

export function setAvatarThinking(thinking: boolean): void {
  setThinking(thinking)
}
