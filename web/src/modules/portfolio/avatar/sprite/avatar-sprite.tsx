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

const OPEN_THRESHOLD = 0.15

function getServerSnapshot() {
  return getAvatarSignalSnapshot()
}

export function AvatarSprite({ variant, className }: AvatarSpriteProps) {
  const signal = useSyncExternalStore(subscribeAvatarSignal, getAvatarSignalSnapshot, getServerSnapshot)

  const [hovered, setHovered] = useState(false)

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

  const expression = variant === "mini" && hovered ? "positive" : toneToExpression(signal.tone)
  const mouthState: MouthState = signal.mouthOpen > OPEN_THRESHOLD ? "open" : "closed"
  const frameUrl = getFrameUrl(expression, mouthState)

  return (

    <img

      src={spritesReady ? frameUrl : undefined}
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
      style={{ willChange: "transform" }}
      onMouseEnter={variant === "mini" ? () => setHovered(true) : undefined}
      onMouseLeave={variant === "mini" ? () => setHovered(false) : undefined}
    />
  )
}
