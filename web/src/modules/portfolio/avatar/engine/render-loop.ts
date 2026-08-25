const MAX_DELTA_SECONDS = 1 / 20

export interface RenderLoopHandle {
  start: () => void
  dispose: () => void
  /** Renders a single frame on demand. Only meaningful in reduced-motion mode (no continuous rAF). */
  requestRender: () => void
}

/**
 * rAF driver. Pauses on `document.hidden` and resumes by discarding the
 * accumulated delta (clamped to MAX_DELTA_SECONDS) so a tab backgrounded for
 * minutes doesn't make idle layers jump on the first frame back.
 *
 * Under `prefers-reduced-motion`, there is no continuous rAF at all - idle
 * layers (blink/breath/look-at) are expected to no-op or render once and
 * hold; `requestRender()` lets an external event (e.g. a pointer move) ask
 * for a single extra frame.
 */
export function createRenderLoop(
  onFrame: (deltaSeconds: number) => void,
  reducedMotion: boolean
): RenderLoopHandle {
  let rafId: number | null = null
  let lastTimeMs: number | null = null
  let started = false
  let hidden = false

  const cancelScheduled = () => {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  const runFrame = (timeMs: number) => {
    rafId = null
    const lastMs = lastTimeMs ?? timeMs
    const deltaSeconds = Math.min((timeMs - lastMs) / 1000, MAX_DELTA_SECONDS)
    lastTimeMs = timeMs

    onFrame(deltaSeconds)

    if (started && !hidden) {
      rafId = window.requestAnimationFrame(runFrame)
    }
  }

  const scheduleContinuous = () => {
    if (reducedMotion || hidden || !started || rafId !== null) return
    lastTimeMs = null
    rafId = window.requestAnimationFrame(runFrame)
  }

  const handleVisibilityChange = () => {
    hidden = document.hidden
    if (hidden) {
      cancelScheduled()
    } else {
      lastTimeMs = null
      scheduleContinuous()
    }
  }

  const start = () => {
    if (started) return
    started = true
    hidden = document.hidden

    document.addEventListener("visibilitychange", handleVisibilityChange)

    if (reducedMotion) {
      onFrame(0)
    } else if (!hidden) {
      scheduleContinuous()
    }
  }

  const requestRender = () => {
    if (started && reducedMotion) onFrame(0)
  }

  const dispose = () => {
    started = false
    document.removeEventListener("visibilitychange", handleVisibilityChange)
    cancelScheduled()
  }

  return { start, dispose, requestRender }
}
