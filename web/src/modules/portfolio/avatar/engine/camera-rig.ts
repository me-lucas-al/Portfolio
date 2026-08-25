import * as THREE from "three"
import { computeObjectBounds } from "./create-scene"

export type CameraFramingName = "mini" | "overlay-bust"

interface FramingPreset {
  fov: number
  verticalCoverage: number
  lookAtYFactor: number
  positionYFactor: number
}

/**
 * Tight head crop. Reuses the exact formula and tuning values the prior
 * (Fase 2) static camera placement used for the idle mini avatar: a 28deg
 * fov, the object's radius filling 62% of the vertical frustum, camera
 * raised slightly above the object's center, looking slightly down at the
 * face.
 */
export const MINI_HEAD_PRESET: FramingPreset = {
  fov: 28,
  verticalCoverage: 0.62,
  lookAtYFactor: 0.08,
  positionYFactor: 0.12,
}

/**
 * Looser crop for the assistant-overlay header slot: pulled back and framed
 * closer to dead-center, for a bit more headroom above the face than the
 * mini crop. facecap.glb has no torso/shoulder geometry, so "bust" here
 * mostly means "less tight" rather than an actual wider composition -
 * explicitly provisional, worth revisiting once a richer asset with
 * shoulders exists.
 */
export const OVERLAY_BUST_PRESET: FramingPreset = {
  fov: 32,
  verticalCoverage: 0.48,
  lookAtYFactor: 0.02,
  positionYFactor: 0.02,
}

interface FramingTarget {
  fov: number
  position: THREE.Vector3
  lookAt: THREE.Vector3
}

export interface CameraRig {
  setFraming: (name: CameraFramingName) => void
  update: (deltaSeconds: number, aspect: number) => void
}

// Matches `viewport-rig.ts`'s DAMPING_RATE so the camera framing and the
// on-screen sub-rectangle it renders into settle at roughly the same pace.
const DAMPING_RATE = 6

function computeFramingTarget(object: THREE.Object3D, preset: FramingPreset): FramingTarget {
  const { center, size, radius } = computeObjectBounds(object)
  const fovRadians = (preset.fov * Math.PI) / 180
  const distance = radius / preset.verticalCoverage / Math.tan(fovRadians / 2)

  return {
    fov: preset.fov,
    position: new THREE.Vector3(center.x, center.y + size.y * preset.positionYFactor, center.z + distance),
    lookAt: new THREE.Vector3(center.x, center.y + size.y * preset.lookAtYFactor, center.z),
  }
}

/**
 * Owns the camera's fov/position/lookAt, continuously damping toward
 * whichever named framing is active - the same exponential-damping pattern
 * as `layers/look-at-layer.ts` and `viewport-rig.ts`. Since it's a
 * continuous chase (no "transition start time" state), switching framings
 * mid-tween (rapid open/close) just re-targets the chase from wherever the
 * camera currently is.
 *
 * `object` may be `null` if the model failed to load - both framings then
 * collapse to the camera's current (default, not very meaningful) pose as a
 * no-op fallback rather than throwing.
 *
 * `initialFraming` seeds the starting pose directly at that preset (no
 * tween from a default) - used when this rig replaces a previous one (e.g.
 * after a context-restore model reload) so recovery doesn't visibly tween
 * from "mini" through to whatever framing was actually active.
 */
export function createCameraRig(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D | null,
  reducedMotion: boolean,
  initialFraming: CameraFramingName = "mini"
): CameraRig {
  const fallback: FramingTarget = {
    fov: camera.fov,
    position: camera.position.clone(),
    lookAt: new THREE.Vector3(0, 0, 0),
  }

  const targets: Record<CameraFramingName, FramingTarget> = object
    ? {
        mini: computeFramingTarget(object, MINI_HEAD_PRESET),
        "overlay-bust": computeFramingTarget(object, OVERLAY_BUST_PRESET),
      }
    : { mini: fallback, "overlay-bust": fallback }

  if (object) {
    const { radius } = computeObjectBounds(object)
    const miniDistance = targets.mini.position.distanceTo(targets.mini.lookAt)
    const overlayDistance = targets["overlay-bust"].position.distanceTo(targets["overlay-bust"].lookAt)
    camera.near = Math.max(Math.min(miniDistance, overlayDistance) / 100, 0.01)
    camera.far = Math.max(miniDistance, overlayDistance) * 4 + radius * 4
  }

  let activeName: CameraFramingName = initialFraming
  const currentPosition = targets[initialFraming].position.clone()
  const currentLookAt = targets[initialFraming].lookAt.clone()
  let currentFov = targets[initialFraming].fov

  camera.position.copy(currentPosition)
  camera.fov = currentFov
  camera.lookAt(currentLookAt)
  camera.updateProjectionMatrix()

  function setFraming(name: CameraFramingName): void {
    activeName = name

    if (reducedMotion) {
      const target = targets[name]
      currentPosition.copy(target.position)
      currentLookAt.copy(target.lookAt)
      currentFov = target.fov
    }
  }

  function update(deltaSeconds: number, aspect: number): void {
    const target = targets[activeName]
    const damping = 1 - Math.exp(-DAMPING_RATE * deltaSeconds)

    currentPosition.lerp(target.position, damping)
    currentLookAt.lerp(target.lookAt, damping)
    currentFov += (target.fov - currentFov) * damping

    camera.position.copy(currentPosition)
    camera.fov = currentFov
    if (aspect > 0) camera.aspect = aspect
    camera.lookAt(currentLookAt)
    camera.updateProjectionMatrix()
  }

  return { setFraming, update }
}
