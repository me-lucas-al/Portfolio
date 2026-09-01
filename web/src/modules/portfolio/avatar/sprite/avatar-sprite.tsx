"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
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
 * `avatar-stage.tsx` (the assistant's click-to-open trigger), once as
 * `variant="bust"` inside the assistant dialogue bar's stage
 * (`modules/portfolio/assistant/assistant-stage.tsx`).
 */
export function AvatarSprite({ variant, className }: AvatarSpriteProps) {
  const signal = useSyncExternalStore(subscribeAvatarSignal, getAvatarSignalSnapshot, getServerSnapshot)
  // Local, not on the shared signal bus - a hover only ever affects the one
  // sprite instance the cursor is actually over, never the bust mounted
  // elsewhere. Only wired for "mini" (see the JSX below): the corner avatar
  // is the assistant's click target now (`avatar-stage.tsx`), so it doubles
  // as a hover affordance; the bust has no such interaction to hint at.
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    void preloadAllSpriteFrames()

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) return

    startBlinkTimer()
    return () => stopBlinkTimer()
  }, [])

  if (variant === "mini" && signal.overlayOpen) return null

  // Hover forces "positive" regardless of `tone` - a deliberate, purely
  // cosmetic override with no effect on the signal bus, so it can never
  // fight the real tone the assistant is mid-response with.
  const expression = variant === "mini" && hovered ? "positive" : toneToExpression(signal.tone)
  const mouthState: MouthState = signal.mouthOpen > OPEN_THRESHOLD ? "open" : "closed"
  // Blink frames only exist for "neutral" - see `sprite-frames.ts`.
  const blinking = signal.blinking && expression === "neutral"
  const frameUrl = getFrameUrl(expression, mouthState, blinking)

  return (
    // eslint-disable-next-line @next/next/no-img-element -- frequent src swaps on a fixed-size element; next/image's optimizer adds nothing here.
    <img
      src={frameUrl}
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
      onMouseEnter={variant === "mini" ? () => setHovered(true) : undefined}
      onMouseLeave={variant === "mini" ? () => setHovered(false) : undefined}
    />
  )
}
