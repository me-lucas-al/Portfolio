import * as THREE from "three"

export interface CreateRendererOptions {
  onContextLost?: () => void
  onContextRestored?: () => void
}

export interface RendererHandle {
  renderer: THREE.WebGLRenderer
  dispose: () => void
}

/**
 * Builds the WebGLRenderer backing the one full-viewport avatar canvas
 * (Fase 4): transparent background so it blends with the page, DPR clamped
 * to keep it cheap even at full-viewport size, and context-loss wiring so a
 * driver crash doesn't take the tab down.
 *
 * This module only flags the loss/restore transition via the two
 * callbacks - `avatar-engine.ts` decides what to actually do about it: on
 * `webglcontextlost` it stops rendering (the browser discards all GPU
 * resources), and on `webglcontextrestored` it re-loads the model and
 * rebuilds everything derived from it, rather than merely resuming with
 * whatever textures happen to still be bound.
 */
export function createRenderer(
  canvas: HTMLCanvasElement,
  options: CreateRendererOptions = {}
): RendererHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  })

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
  const maxDpr = isCoarsePointer ? 1.5 : 2
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))
  renderer.setClearColor(0x000000, 0)
  renderer.setClearAlpha(0)

  const handleContextLost = (event: Event) => {
    event.preventDefault()
    options.onContextLost?.()
  }

  const handleContextRestored = () => {
    options.onContextRestored?.()
  }

  canvas.addEventListener("webglcontextlost", handleContextLost, false)
  canvas.addEventListener("webglcontextrestored", handleContextRestored, false)

  const dispose = () => {
    canvas.removeEventListener("webglcontextlost", handleContextLost)
    canvas.removeEventListener("webglcontextrestored", handleContextRestored)
    renderer.dispose()
  }

  return { renderer, dispose }
}
