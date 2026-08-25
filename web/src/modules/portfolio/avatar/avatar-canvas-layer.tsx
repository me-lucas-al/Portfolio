"use client"

import { useEffect, useState, type RefObject } from "react"
import { createPortal } from "react-dom"

interface AvatarCanvasLayerProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

/**
 * The ONE canvas element that ever exists for the avatar (Fase 4): portaled
 * directly onto `document.body` so it sits above every page section
 * regardless of where `<AvatarStage />` itself is mounted in the tree,
 * full-viewport and `pointer-events-none` so it never intercepts
 * clicks/scroll, and transparent so page content shows through everywhere
 * the 3D scene doesn't scissor-draw a pixel.
 *
 * Mounted once by `AvatarStage` and never conditionally unmounted while the
 * page lives - React portals don't remount on parent re-renders, so the
 * underlying WebGL context (and everything `engine/avatar-engine.ts` builds
 * on top of it) survives every framing change; only the scissored
 * sub-rectangle it draws into moves. Whether the engine actually boots
 * against this canvas is still gated by `use-avatar-engine.ts`'s `enabled`
 * flag - this component just guarantees the DOM node exists.
 *
 * `document.body` is only ever touched inside an effect, so this renders
 * `null` during SSR and on the very first client render (matching), then
 * portals in - no hydration mismatch.
 */
export function AvatarCanvasLayer({ canvasRef }: AvatarCanvasLayerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <canvas ref={canvasRef} className="fixed inset-0 z-30 pointer-events-none" aria-hidden="true" />,
    document.body
  )
}
