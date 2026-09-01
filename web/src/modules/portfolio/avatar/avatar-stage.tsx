"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { Dictionary } from "@/i18n"
import { AvatarSprite } from "./sprite/avatar-sprite"
import { SpeechBalloon } from "./speech/speech-balloon"

interface AvatarStageProps {
  dict: Dictionary["assistant"]
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CTA_SEEN_KEY = "assistant_cta_seen"
const CTA_DELAY_MS = 1500

function hasSeenCta(): boolean {
  try {
    return window.localStorage.getItem(CTA_SEEN_KEY) !== null
  } catch {
    return false
  }
}

function markCtaSeen() {
  try {
    window.localStorage.setItem(CTA_SEEN_KEY, "1")
  } catch {
    // localStorage unavailable (private browsing, quota) - the bubble may reappear next visit
  }
}

/**
 * Mounts the avatar's mini (corner, idle) surface - now the assistant's only
 * entry point, exported through `../contract.ts` and rendered by
 * `modules/portfolio/assistant/assistant-widget.tsx` (the sole consumer of
 * `open`/`onOpenChange`, its own `useState`). Clicking the portrait itself
 * opens the dialogue bar; there is no separate "chat bubble" trigger button
 * anymore. A first-visit nudge bubble (former `assistant-mini-dock.tsx`
 * responsibility, moved here since it's part of the same corner surface)
 * points at it once, then never again (`localStorage`-gated).
 *
 * No canvas, no portal, no rect measuring - `AvatarSprite` reads everything
 * it needs off the shared signal bus; the "bust" variant is mounted
 * separately, inside the dialogue bar itself
 * (`modules/portfolio/assistant/assistant-stage.tsx`).
 */
export function AvatarStage({ dict, open, onOpenChange }: AvatarStageProps) {
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    if (hasSeenCta()) return
    const timeout = window.setTimeout(() => setShowCta(true), CTA_DELAY_MS)
    return () => window.clearTimeout(timeout)
  }, [])

  function dismissCta() {
    setShowCta(false)
    markCtaSeen()
  }

  function handleClick() {
    onOpenChange(!open)
    if (!open) dismissCta()
  }

  // The dialogue bar renders its own bust portrait - showing this corner
  // trigger underneath it would just be a dead click target.
  if (open) return null

  return (
    <>
      {showCta && (
        <div className="fixed bottom-32 left-6 z-30 flex max-w-[min(220px,calc(100vw-3rem))] items-center gap-2 rounded-2xl rounded-bl-sm border border-line bg-surface-2/95 px-4 py-2 text-sm text-fg-muted shadow-lg shadow-black/30 animate-in fade-in slide-in-from-bottom-2">
          <span>{dict.ctaBubble}</span>
          <button
            type="button"
            onClick={dismissCta}
            aria-label={dict.close}
            className="text-muted-2 transition-colors hover:text-fg-muted"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        aria-label={dict.trigger}
        aria-expanded={open}
        className="fixed bottom-6 left-6 z-30 rounded-full transition-transform hover:scale-105 active:scale-95"
      >
        <AvatarSprite
          variant="mini"
          className="h-24 w-24 rounded-full object-cover shadow-lg shadow-black/40 sm:h-28 sm:w-28"
        />
      </button>

      <SpeechBalloon skipLabel={dict.skipTyping} />
    </>
  )
}
