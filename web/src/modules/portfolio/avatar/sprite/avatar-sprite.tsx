"use client"

import { useEffect, useSyncExternalStore } from "react"
import { getAvatarSignalSnapshot, subscribeAvatarSignal } from "../state/avatar-signal-bus"
import { getFrameUrl, preloadAllSpriteFrames, type MouthState } from "./sprite-frames"
import { toneToExpression } from "./tone-expression-map"
import { startBlinkTimer, stopBlinkTimer } from "./blink-timer"

export type AvatarSpriteVariant = "mini" | "bust"

interface AvatarSpriteProps {
  variant: AvatarSpriteVariant
  className?: string
}

// Above this, `mouthOpen` (written by either the typing tick or real audio
// amplitude - see `../mouth/mouth-source.ts`) reads as "open" for sprite
// purposes; below it, "closed". Matches the deadzone/threshold values the
// upstream writers already use for their own damping.
const OPEN_THRESHOLD = 0.15

function getServerSnapshot() {
  return getAvatarSignalSnapshot()
}

/**
 * Pure `<img>` swap - no canvas, no `three`. Reads `tone`/`mouthOpen`/
 * `blinking` off the shared signal bus via `useSyncExternalStore` (the same
 * "module-scope mutable store" pattern `use-speech-player.ts` already uses
 * for `speech-player.ts`). Mounted twice, independently, with no
 * coordination beyond the shared bus: once as `variant="mini"` in
 * `avatar-stage.tsx`, once as `variant="bust"` in the assistant overlay's
 * header slot.
 */
export function AvatarSprite({ variant, className }: AvatarSpriteProps) {
  const signal = useSyncExternalStore(subscribeAvatarSignal, getAvatarSignalSnapshot, getServerSnapshot)

  useEffect(() => {
    void preloadAllSpriteFrames()

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) return

    startBlinkTimer()
    return () => stopBlinkTimer()
  }, [])

  if (variant === "mini" && signal.overlayOpen) return null

  const expression = toneToExpression(signal.tone)
  const mouthState: MouthState = signal.mouthOpen > OPEN_THRESHOLD ? "open" : "closed"
  // Blink frames only exist for "neutral" - see `sprite-frames.ts`.
  const blinking = signal.blinking && expression === "neutral"
  const frameUrl = getFrameUrl(expression, mouthState, blinking)

  return (
    // eslint-disable-next-line @next/next/no-img-element -- frequent src swaps on a fixed-size element; next/image's optimizer adds nothing here.
    <img src={frameUrl} alt="" aria-hidden="true" className={className} draggable={false} />
  )
}
