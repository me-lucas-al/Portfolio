import * as THREE from "three"

export interface SceneHandle {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
}

/**
 * One light, one static camera. facecap.glb is a bare head mesh with no
 * shoulders/torso geometry, so "head-and-shoulders" framing here just means a
 * tight portrait crop on the face - there's nothing below the neck to frame.
 */
export function createScene(aspect: number): SceneHandle {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(28, aspect, 0.01, 100)

  const light = new THREE.HemisphereLight(0xffffff, 0x2b2b2b, 3)
  scene.add(light)

  return { scene, camera }
}

/**
 * Positions the static camera to frame `object` as a portrait crop, based on
 * its actual bounding box rather than hard-coded numbers - facecap.glb's
 * node transforms (nested scale/rotation groups) make guessing world-space
 * coordinates unreliable.
 */
export function frameCameraOnObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  verticalCoverage = 0.62
): void {
  object.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1
  const fovRadians = (camera.fov * Math.PI) / 180
  const distance = radius / verticalCoverage / Math.tan(fovRadians / 2)

  const lookAtY = center.y + size.y * 0.08

  camera.position.set(center.x, center.y + size.y * 0.12, center.z + distance)
  camera.near = Math.max(distance / 100, 0.01)
  camera.far = distance * 4 + radius * 4
  camera.updateProjectionMatrix()
  camera.lookAt(center.x, lookAtY, center.z)
}
