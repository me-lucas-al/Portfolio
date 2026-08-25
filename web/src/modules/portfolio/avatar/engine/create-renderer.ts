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
 * Builds the WebGLRenderer for the idle mini avatar: transparent background
 * so it blends with the page, DPR clamped to keep a ~112px corner canvas
 * cheap, and context-loss wiring so a driver crash doesn't take the tab down.
 *
 * Context-loss recovery is a stub for this phase: on `webglcontextlost` we
 * just flag the engine to stop rendering (the browser discards all GPU
 * resources); a later phase can rebuild geometries/materials on
 * `webglcontextrestored` instead of merely resuming.
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
