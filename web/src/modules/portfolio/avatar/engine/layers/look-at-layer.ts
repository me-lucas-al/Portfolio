export interface LookAtWeights {
  eyeLookInLeft: number
  eyeLookOutLeft: number
  eyeLookUpLeft: number
  eyeLookDownLeft: number
  eyeLookInRight: number
  eyeLookOutRight: number
  eyeLookUpRight: number
  eyeLookDownRight: number
}

export interface LookAtLayerOptions {
  coarsePointer: boolean
}

export interface LookAtLayer {
  update: (deltaSeconds: number) => LookAtWeights
  /** Lets a future caller (e.g. the engine facade) override the look target directly. */
  setTarget: (x: number, y: number) => void
  dispose: () => void
}

const SMOOTH_FACTOR = 8
const DRIFT_SMOOTH_FACTOR = 2
const MAX_EYE_WEIGHT = 0.6

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Tracks pointer position via a module-owned `pointermove` listener that
 * writes straight into a mutable object - NEVER React state, since this runs
 * every frame at 60fps+. Damps toward the target with exponential smoothing
 * (`1 - exp(-k * dt)`), which stays consistent across the 30-120Hz range
 * devices actually render at, unlike a fixed per-frame lerp factor.
 *
 * On coarse pointers (touch) or once the pointer leaves the window, drifts
 * back toward center slowly instead of snapping.
 */
export function createLookAtLayer(options: LookAtLayerOptions): LookAtLayer {
  const { coarsePointer } = options

  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  let pointerActive = false

  const handlePointerMove = (event: PointerEvent) => {
    if (coarsePointer) return
    const nx = (event.clientX / window.innerWidth) * 2 - 1
    const ny = (event.clientY / window.innerHeight) * 2 - 1
    target.x = clamp(nx, -1, 1)
    target.y = clamp(ny, -1, 1)
    pointerActive = true
  }

  const handlePointerLeaveOrBlur = () => {
    pointerActive = false
  }

  const handleVisibilityChange = () => {
    if (document.hidden) handlePointerLeaveOrBlur()
  }

  if (typeof window !== "undefined") {
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeaveOrBlur, { passive: true })
    window.addEventListener("blur", handlePointerLeaveOrBlur)
    document.addEventListener("visibilitychange", handleVisibilityChange)
  }

  function update(deltaSeconds: number): LookAtWeights {
    const shouldDrift = coarsePointer || !pointerActive
    const goalX = shouldDrift ? 0 : target.x
    const goalY = shouldDrift ? 0 : target.y
    const smoothFactor = shouldDrift ? DRIFT_SMOOTH_FACTOR : SMOOTH_FACTOR
    const damping = 1 - Math.exp(-smoothFactor * deltaSeconds)

    current.x += (goalX - current.x) * damping
    current.y += (goalY - current.y) * damping

    const rightWeight = Math.max(0, current.x) * MAX_EYE_WEIGHT
    const leftWeight = Math.max(0, -current.x) * MAX_EYE_WEIGHT
    const downWeight = Math.max(0, current.y) * MAX_EYE_WEIGHT
    const upWeight = Math.max(0, -current.y) * MAX_EYE_WEIGHT

    return {
      eyeLookInLeft: rightWeight,
      eyeLookOutLeft: leftWeight,
      eyeLookUpLeft: upWeight,
      eyeLookDownLeft: downWeight,
      eyeLookInRight: leftWeight,
      eyeLookOutRight: rightWeight,
      eyeLookUpRight: upWeight,
      eyeLookDownRight: downWeight,
    }
  }

  function setTarget(x: number, y: number): void {
    target.x = clamp(x, -1, 1)
    target.y = clamp(y, -1, 1)
    pointerActive = true
  }

  function dispose(): void {
    if (typeof window === "undefined") return
    window.removeEventListener("pointermove", handlePointerMove)
    window.removeEventListener("pointerleave", handlePointerLeaveOrBlur)
    window.removeEventListener("blur", handlePointerLeaveOrBlur)
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  }

  return { update, setTarget, dispose }
}
