"use client"

import { useEffect, type RefObject } from "react"
import { getOverlayState } from "./state/avatar-signal-bus"
import type { AvatarFramingName, AvatarRect } from "./contract"

// Cheap enough (a `getBoundingClientRect()` call plus a couple of field
// reads/writes) to run this often without it mattering, and short enough
// that a chat-panel open/close feels immediate - the rig itself does the
// actual per-frame animation inside the engine's render loop, not this hook.
const POLL_INTERVAL_MS = 120

/**
 * Decides which named framing the avatar engine should chase: "mini" at the
 * corner anchor div's current position, or "overlay-bust" at the assistant
 * overlay's header-slot rect written into `state/avatar-signal-bus.ts` by
 * `assistant/assistant-widget.tsx` (via `contract.ts`'s
 * `setAvatarOverlayState`) - and calls `setFraming` with the result.
 *
 * There is no pub/sub wiring the bus to this hook (see the bus's own doc
 * comment): it just re-checks on mount, on window resize, and on a short
 * interval.
 */
export function useAvatarFraming(
  miniAnchorRef: RefObject<HTMLDivElement | null>,
  setFraming: (name: AvatarFramingName, rect: AvatarRect) => void
) {
  useEffect(() => {
    const recompute = () => {
      const { overlayOpen, overlayAnchorRect } = getOverlayState()

      if (overlayOpen && overlayAnchorRect) {
        setFraming("overlay-bust", overlayAnchorRect)
        return
      }

      const miniEl = miniAnchorRef.current
      if (!miniEl) return

      const rect = miniEl.getBoundingClientRect()
      setFraming("mini", { x: rect.x, y: rect.y, width: rect.width, height: rect.height })
    }

    recompute()
    window.addEventListener("resize", recompute)
    const intervalId = window.setInterval(recompute, POLL_INTERVAL_MS)

    return () => {
      window.removeEventListener("resize", recompute)
      window.clearInterval(intervalId)
    }
  }, [miniAnchorRef, setFraming])
}
