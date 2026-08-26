"use client"

import { useEffect, useState } from "react"
import { MessageCircle, X } from "lucide-react"
import type { Dictionary } from "@/i18n"

interface AssistantMiniDockProps {
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

export function AssistantMiniDock({ dict, open, onOpenChange }: AssistantMiniDockProps) {
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

  function handleTriggerClick() {
    if (open) {
      onOpenChange(false)
      return
    }
    onOpenChange(true)
    dismissCta()
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {showCta && !open && (
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2/95 px-4 py-2 text-sm text-fg-muted shadow-lg shadow-black/30 animate-in fade-in slide-in-from-bottom-2">
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
        onClick={handleTriggerClick}
        aria-label={dict.trigger}
        aria-expanded={open}
        className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg shadow-accent-deep/50 transition-all hover:bg-accent-strong active:scale-95"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  )
}
