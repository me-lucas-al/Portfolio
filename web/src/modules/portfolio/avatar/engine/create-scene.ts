import * as THREE from "three"

export interface SceneHandle {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
}

/**
 * One light, one static camera. facecap.glb is a bare head mesh with no
 * shoulders/torso geometry, so "head-and-shoulders" framing here just means a
 * tight portrait crop on the face - there's nothing below the neck to frame.
 *
 * The camera's fov/position/lookAt/aspect set here are placeholders -
 * `camera-rig.ts` takes over driving all of them every frame once the model
 * has loaded (see `avatar-engine.ts`).
 */
export function createScene(aspect: number): SceneHandle {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(28, aspect, 0.01, 100)

  const light = new THREE.HemisphereLight(0xffffff, 0x2b2b2b, 3)
  scene.add(light)

  return { scene, camera }
}

export interface ObjectBounds {
  center: THREE.Vector3
  size: THREE.Vector3
  radius: number
}

/**
 * Computes an object's world-space bounding box center/size, plus a scalar
 * "radius" (half of its largest dimension) used by `camera-rig.ts` to derive
 * a camera distance for a given field of view - based on the object's actual
 * geometry rather than hard-coded numbers, since facecap.glb's node
 * transforms (nested scale/rotation groups) make guessing world-space
 * coordinates unreliable.
 */
export function computeObjectBounds(object: THREE.Object3D): ObjectBounds {
  object.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1

  return { center, size, radius }
}
