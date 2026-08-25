"use client"

import { useEffect, useRef, useState } from "react"
import { detectWebglSupport } from "./detect-webgl"
import { useAvatarEngine } from "./use-avatar-engine"
import { NoWebglFallback } from "./no-webgl-fallback"

/**
 * Idle mini avatar mounted in the corner of the page. Renders a plain,
 * three-less placeholder on first paint (avoids an SSR/CSR hydration
 * mismatch, since WebGL support can only be known on the client), then
 * swaps to either the canvas or `<NoWebglFallback />` once the capability
 * check resolves in an effect.
 *
 * This component itself never imports `three` - the engine is only reached
 * through the dynamic import inside `useAvatarEngine`.
 */
export function AvatarStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)

  useEffect(() => {
    setWebglSupported(detectWebglSupport())
  }, [])

  useAvatarEngine(canvasRef, webglSupported === true)

  return (
    <div
      className="fixed bottom-6 left-6 z-30 h-24 w-24 overflow-hidden rounded-full bg-neutral-950/60 shadow-lg ring-1 ring-white/10 backdrop-blur-sm sm:h-28 sm:w-28"
      aria-hidden="true"
    >
      {webglSupported === false ? (
        <NoWebglFallback />
      ) : (
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: webglSupported ? "block" : "none" }}
        />
      )}
    </div>
  )
}
