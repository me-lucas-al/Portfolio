"use client"

import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import type { AvatarFramingName, AvatarRect, AvatarState } from "./contract"

interface EngineHandle {
  dispose: () => void
  setLookTarget: (x: number, y: number) => void
  setFraming: (name: AvatarFramingName, rect: AvatarRect) => void
}

const IDLE_CALLBACK_TIMEOUT_MS = 2000
const IDLE_FALLBACK_DELAY_MS = 200

/**
 * Boots the three.js engine lazily: `three` is only ever reached through the
 * dynamic `import('./engine/avatar-engine')` below, gated behind
 * `requestIdleCallback` (with a `setTimeout` fallback for Safari, which
 * lacks it) so it never competes with the page's initial render/LCP work.
 *
 * `enabled` should be `true` only once the caller has confirmed WebGL
 * support AND the canvas element is mounted - this hook does not render
 * anything itself.
 *
 * Returns a stable `setFraming` that's a safe no-op until the engine has
 * actually booted (callers - see `use-avatar-framing.ts` - just keep polling
 * and it starts taking effect once ready).
 */
export function useAvatarEngine(canvasRef: RefObject<HTMLCanvasElement | null>, enabled: boolean) {
  const [state, setState] = useState<AvatarState>("loading")
  const engineRef = useRef<EngineHandle | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let idleHandle: number | null = null
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null

    const boot = async () => {
      const canvas = canvasRef.current
      if (!canvas || cancelled) return

      try {
        const { create } = await import("./engine/avatar-engine")
        if (cancelled) return

        const engine = await create(canvas, {
          onError: () => {
            if (!cancelled) setState("error")
          },
        })

        if (cancelled) {
          engine.dispose()
          return
        }

        engineRef.current = engine
        setState("idle")
      } catch {
        if (!cancelled) setState("error")
      }
    }

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(() => void boot(), {
        timeout: IDLE_CALLBACK_TIMEOUT_MS,
      })
    } else {
      timeoutHandle = setTimeout(() => void boot(), IDLE_FALLBACK_DELAY_MS)
    }

    return () => {
      cancelled = true
      if (idleHandle !== null) window.cancelIdleCallback?.(idleHandle)
      if (timeoutHandle !== null) clearTimeout(timeoutHandle)
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [canvasRef, enabled])

  const setFraming = useCallback((name: AvatarFramingName, rect: AvatarRect) => {
    engineRef.current?.setFraming(name, rect)
  }, [])

  return { state, setFraming }
}
