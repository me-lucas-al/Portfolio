export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface ViewportRig {
  setTargetRect: (rect: Rect) => void
  getCurrentRect: () => Rect
  update: (deltaSeconds: number) => void
}

// Same order of magnitude as `layers/look-at-layer.ts`'s active-tracking
// SMOOTH_FACTOR (8) - fast enough to feel responsive, slow enough to read as
// a deliberate morph rather than a snap.
const DAMPING_RATE = 6

/**
 * Chases a target CSS-pixel rect (viewport-relative, e.g. from
 * `getBoundingClientRect()`) with exponential damping - the same
 * `current += (target - current) * (1 - exp(-rate * dt))` pattern
 * `layers/look-at-layer.ts` already uses - rather than a fixed-duration
 * tween. There is no "transition start time" anywhere in this rig, so
 * re-targeting mid-chase (rapid open/close/open) just redirects the chase
 * from wherever `current` already is; nothing needs to be cancelled.
 *
 * Under `prefers-reduced-motion`, every `setTargetRect` call snaps `current`
 * straight to the target instead of damping toward it over time - the state
 * change still takes effect, it just isn't animated.
 */
export function createViewportRig(
  reducedMotion: boolean,
  initialRect: Rect = { x: 0, y: 0, width: 0, height: 0 }
): ViewportRig {
  const target: Rect = { ...initialRect }
  const current: Rect = { ...initialRect }
  let initialized = false

  function setTargetRect(rect: Rect): void {
    target.x = rect.x
    target.y = rect.y
    target.width = rect.width
    target.height = rect.height

    // The very first target (the initial mini-avatar placement on mount)
    // always snaps too, so the avatar doesn't visibly grow in from a
    // zero-size rect before anyone has told the rig where "mini" actually is.
    if (!initialized || reducedMotion) {
      current.x = rect.x
      current.y = rect.y
      current.width = rect.width
      current.height = rect.height
      initialized = true
    }
  }

  function update(deltaSeconds: number): void {
    const damping = 1 - Math.exp(-DAMPING_RATE * deltaSeconds)
    current.x += (target.x - current.x) * damping
    current.y += (target.y - current.y) * damping
    current.width += (target.width - current.width) * damping
    current.height += (target.height - current.height) * damping
  }

  function getCurrentRect(): Rect {
    return { ...current }
  }

  return { setTargetRect, getCurrentRect, update }
}

/**
 * Converts a CSS-pixel rect (viewport-relative, top-left origin, as from
 * `getBoundingClientRect()`) into the coordinates
 * `WebGLRenderer.setViewport`/`setScissor` expect: same units, Y flipped
 * (CSS `top` grows downward from the viewport's top-left corner; the GL
 * viewport/scissor origin is the bottom-left corner of the drawing buffer).
 *
 * Deliberately does NOT multiply by device pixel ratio. Despite the name,
 * three.js's `WebGLRenderer.setViewport`/`setScissor` take "logical pixel
 * unit" values (verified against `WebGLRenderer.js`'s own doc comments and
 * implementation in this repo's installed `three` version) and multiply by
 * `renderer.getPixelRatio()` themselves before touching the GL context -
 * the same logical-pixel units `renderer.setSize(width, height, false)`
 * already takes. Premultiplying here would double-apply the DPR scale on
 * any screen where `devicePixelRatio !== 1`.
 */
export function toRendererViewportRect(rect: Rect, viewportCssHeight: number): Rect {
  return {
    x: rect.x,
    y: viewportCssHeight - rect.y - rect.height,
    width: rect.width,
    height: rect.height,
  }
}
