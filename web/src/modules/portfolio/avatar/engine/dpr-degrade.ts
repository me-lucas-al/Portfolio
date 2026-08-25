const FRAME_WINDOW = 60
const SLOW_FRAME_MS = 22
const DPR_STEP = 0.25
const DPR_FLOOR = 1
const DEGRADED_MIN_FRAME_INTERVAL_MS = 1000 / 30

export interface DprDegrade {
  /**
   * Call once per animation-frame tick, before deciding whether to actually
   * call `renderer.render(...)` this frame, passing the current
   * `performance.now()` timestamp. Always `true` until degradation has
   * kicked in at least once; from then on, gates rendering to ~30fps by
   * returning `false` until enough wall-clock time has passed since the
   * last frame that was actually rendered.
   */
  shouldRenderThisFrame: (nowMs: number) => boolean
  /**
   * Call immediately after an actual `renderer.render(...)` call, passing
   * the measured wall-clock render duration (ms) and the same `nowMs`
   * timestamp used for the preceding `shouldRenderThisFrame` check. Returns
   * the DPR that should be active - the caller is responsible for actually
   * calling `renderer.setPixelRatio(dpr)` when this differs from what's
   * currently applied; this module never touches the renderer itself, the
   * same way `viewport-rig.ts`/`camera-rig.ts` never touch the renderer or
   * camera outside the values they're explicitly asked to compute.
   */
  recordRenderTime: (renderMs: number, nowMs: number) => number
}

function median(sortedAscending: number[]): number {
  const mid = Math.floor(sortedAscending.length / 2)
  return sortedAscending.length % 2 === 0
    ? (sortedAscending[mid - 1] + sortedAscending[mid]) / 2
    : sortedAscending[mid]
}

/**
 * Adaptive degrade loop layered on top of `create-renderer.ts`'s static DPR
 * ceiling (`min(devicePixelRatio, 2)` desktop / `1.5` coarse-pointer, applied
 * once at creation via `renderer.setPixelRatio(...)` - see that file). This
 * module never picks the *ceiling*, only steps *down* from whatever DPR the
 * caller started it with.
 *
 * Collects render-time samples into non-overlapping batches of
 * `FRAME_WINDOW` (60) frames - not a continuously-resorted sliding window,
 * since sorting every single frame to get a running median would be wasted
 * work for a decision this coarse-grained anyway. Every 60 sampled frames,
 * the batch's median (p50) is checked against `SLOW_FRAME_MS` (22ms): if
 * over, the DPR steps down by 0.25 (never below `DPR_FLOOR` = 1.0) and
 * `degraded` flips permanently `true` - a one-way ratchet. This deliberately
 * never steps back up even once things get fast again (a session that
 * degraded once stays degraded for the rest of that session) - recovering
 * risks visible oscillation, which is worse than staying a bit blurrier.
 *
 * Once `degraded` is `true` (regardless of how many steps have actually
 * happened), `shouldRenderThisFrame` additionally caps the *render* rate to
 * ~30fps - a separate, coarser lever from the DPR step, layered on top of it
 * rather than instead of it. This only ever skips the `renderer.render(...)`
 * call itself; every other per-frame update (blink/breath/look-at/viseme/
 * emotion, the viewport/camera rigs) is expected to keep running every rAF
 * tick regardless - see `avatar-engine.ts`.
 *
 * Callers are expected to simply not invoke either method while
 * `reducedMotion` is active (no continuous rAF, so there's no "sustained
 * render load" to react to) or while the WebGL context is lost
 * (`contextLost`) - this module has no idea about either state, it just
 * never gets ticked during them.
 */
export function createDprDegrade(initialDpr: number): DprDegrade {
  let dpr = initialDpr
  let degraded = false
  let lastRenderAtMs: number | null = null
  let window: number[] = []

  function shouldRenderThisFrame(nowMs: number): boolean {
    if (!degraded) return true
    if (lastRenderAtMs === null) return true
    return nowMs - lastRenderAtMs >= DEGRADED_MIN_FRAME_INTERVAL_MS
  }

  function recordRenderTime(renderMs: number, nowMs: number): number {
    lastRenderAtMs = nowMs
    window.push(renderMs)

    if (window.length >= FRAME_WINDOW) {
      const p50 = median([...window].sort((a, b) => a - b))
      window = []

      if (p50 > SLOW_FRAME_MS && dpr > DPR_FLOOR) {
        dpr = Math.max(DPR_FLOOR, dpr - DPR_STEP)
        degraded = true
      }
    }

    return dpr
  }

  return { shouldRenderThisFrame, recordRenderTime }
}
