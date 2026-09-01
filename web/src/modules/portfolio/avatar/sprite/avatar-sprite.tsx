"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { getAvatarSignalSnapshot, subscribeAvatarSignal } from "../state/avatar-signal-bus"
import { getFrameUrl, preloadAllSpriteFrames, type MouthState } from "./sprite-frames"
import { toneToExpression } from "./tone-expression-map"

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
 * Pure `<img>` swap - no canvas, no `three`. Reads `tone`/`mouthOpen`
 * off the shared signal bus via `useSyncExternalStore` (the same
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
  // Gates the first paint on every frame being fully downloaded and decoded
  // in the background first - without this, the very first time any
  // `AvatarSprite` mounts after a page load, its `<img src>` races the same
  // still-in-flight network request `preloadAllSpriteFrames` just kicked
  // off, and the browser shows its broken/low-quality placeholder for the
  // image until that request finishes. Resolves once, ever (module-scope
  // promise), so every later mount/expression swap paints instantly from
  // the browser's own cache with no re-check.
  const [spritesReady, setSpritesReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void preloadAllSpriteFrames().then(() => {
      if (!cancelled) setSpritesReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (variant === "mini" && signal.overlayOpen) return null
  if (!spritesReady) return <div aria-hidden="true" className={className} />

  // Hover forces "positive" regardless of `tone` - a deliberate, purely
  // cosmetic override with no effect on the signal bus, so it can never
  // fight the real tone the assistant is mid-response with.
  const expression = variant === "mini" && hovered ? "positive" : toneToExpression(signal.tone)
  const mouthState: MouthState = signal.mouthOpen > OPEN_THRESHOLD ? "open" : "closed"
  const frameUrl = getFrameUrl(expression, mouthState)

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
