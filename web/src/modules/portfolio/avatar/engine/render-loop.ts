const MAX_DELTA_SECONDS = 1 / 20

export interface RenderLoopHandle {
  start: () => void
  dispose: () => void
  /** Renders a single frame on demand. Only meaningful in reduced-motion mode (no continuous rAF). */
  requestRender: () => void
  /**
   * Externally pause/resume the loop for a reason other than tab visibility
   * (Fase 10: `avatar-engine.ts` calls this when `visualViewport` reports the
   * mobile keyboard has very likely opened). Composes with the existing
   * `document.hidden` pause rather than replacing it - the loop only
   * actually runs when neither reason is active, and un-pausing this one
   * while the tab is still hidden correctly stays paused.
   */
  setPaused: (paused: boolean) => void
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
 *
 * `onBeforeHide` (Fase 6) runs synchronously on the visible->hidden
 * transition, before the loop actually stops scheduling frames - it exists
 * so a caller can force any driven-by-audio state (the viseme layer's
 * `mouthOpen`) back to its rest value, and this function then renders one
 * more frame immediately (bypassing rAF) so that reset is what's actually
 * left on screen for as long as the tab stays backgrounded, instead of
 * whatever the mouth happened to look like on the last frame before the tab
 * was hidden (e.g. mid-word, wide open).
 */
export function createRenderLoop(
  onFrame: (deltaSeconds: number) => void,
  reducedMotion: boolean,
  onBeforeHide?: () => void
): RenderLoopHandle {
  let rafId: number | null = null
  let lastTimeMs: number | null = null
  let started = false
  // `effectivePaused` is the OR of two independent pause reasons - the tab
  // being backgrounded (`documentHidden`, driven by `visibilitychange`) and,
  // since Fase 10, an externally-requested pause (`externallyPaused`, driven
  // by `setPaused` - `avatar-engine.ts` uses this for the mobile-keyboard
  // heuristic). Both reasons flow through the same `applyPaused` transition
  // logic below rather than each maintaining their own cancel/resume code, so
  // e.g. resuming from the keyboard-closed heuristic while the tab is still
  // hidden correctly stays paused.
  let documentHidden = false
  let externallyPaused = false
  let effectivePaused = false

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

    if (started && !effectivePaused) {
      rafId = window.requestAnimationFrame(runFrame)
    }
  }

  const scheduleContinuous = () => {
    if (reducedMotion || effectivePaused || !started || rafId !== null) return
    lastTimeMs = null
    rafId = window.requestAnimationFrame(runFrame)
  }

  const applyPaused = (nextPaused: boolean) => {
    if (nextPaused === effectivePaused) return
    effectivePaused = nextPaused

    if (effectivePaused) {
      onBeforeHide?.()
      // Force one last render synchronously (not via rAF, which is exactly
      // what's being cancelled below) so whatever `onBeforeHide` just reset
      // is what's actually on screen while paused (backgrounded tab or
      // keyboard-open heuristic alike).
      onFrame(0)
      cancelScheduled()
    } else {
      lastTimeMs = null
      scheduleContinuous()
    }
  }

  const handleVisibilityChange = () => {
    documentHidden = document.hidden
    applyPaused(documentHidden || externallyPaused)
  }

  const setPaused = (paused: boolean) => {
    externallyPaused = paused
    applyPaused(documentHidden || externallyPaused)
  }

  const start = () => {
    if (started) return
    started = true
    documentHidden = document.hidden
    effectivePaused = documentHidden || externallyPaused

    document.addEventListener("visibilitychange", handleVisibilityChange)

    if (reducedMotion) {
      onFrame(0)
    } else if (!effectivePaused) {
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

  return { start, dispose, requestRender, setPaused }
}
