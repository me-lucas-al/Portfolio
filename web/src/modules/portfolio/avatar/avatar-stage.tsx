"use client"

import { useEffect, useRef, useState } from "react"
import { detectWebglSupport } from "./detect-webgl"
import { useAvatarEngine } from "./use-avatar-engine"
import { useAvatarFraming } from "./use-avatar-framing"
import { AvatarCanvasLayer } from "./avatar-canvas-layer"
import { NoWebglFallback } from "./no-webgl-fallback"

/**
 * Mounts the avatar (Fase 4): the one full-viewport portaled canvas
 * (`AvatarCanvasLayer`), plus a small `pointer-events-none` placeholder div
 * in the page corner whose only job is to be measured
 * (`getBoundingClientRect()`) as the "mini" framing's on-screen target rect.
 * The actual avatar pixels are drawn by the portaled canvas into a
 * scissored sub-rectangle that happens to align with this div's screen
 * position - this div renders no visible content of its own, except the
 * `NoWebglFallback` static image when WebGL isn't supported.
 *
 * Renders a plain, three-less placeholder on first paint (avoids an
 * SSR/CSR hydration mismatch, since WebGL support can only be known on the
 * client), then swaps to the real thing once the capability check resolves
 * in an effect.
 *
 * This component itself never imports `three` - the engine is only reached
 * through the dynamic import inside `useAvatarEngine`.
 */
export function AvatarStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const miniAnchorRef = useRef<HTMLDivElement | null>(null)
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)

  useEffect(() => {
    setWebglSupported(detectWebglSupport())
  }, [])

  const { setFraming } = useAvatarEngine(canvasRef, webglSupported === true)
  useAvatarFraming(miniAnchorRef, setFraming)

  return (
    <>
      <AvatarCanvasLayer canvasRef={canvasRef} />
      <div
        ref={miniAnchorRef}
        className="fixed bottom-6 left-6 z-30 h-24 w-24 pointer-events-none sm:h-28 sm:w-28"
        aria-hidden="true"
      >
        {webglSupported === false && <NoWebglFallback />}
      </div>
    </>
  )
}
