import type { Object3D } from "three"

export interface BreathLayer {
  update: (deltaSeconds: number) => void
}

const FREQUENCY_HZ = 0.22
const AMPLITUDE_RADIANS = (0.35 * Math.PI) / 180

/**
 * Sine wave at 0.22 Hz, amplitude +/-0.35 deg. The spec asks for this on a
 * chest/torso bone if one exists - it doesn't in facecap.glb (no skeleton at
 * all, just a head/teeth/eye mesh hierarchy - see the module README), so this
 * applies a very subtle head bob to the "head" node instead, as instructed
 * for that fallback case.
 */
export function createBreathLayer(target: Object3D | null, reducedMotion: boolean): BreathLayer {
  const baseRotationX = target?.rotation.x ?? 0
  let elapsedSeconds = 0

  function update(deltaSeconds: number): void {
    if (!target || reducedMotion) return

    elapsedSeconds += deltaSeconds
    const phase = 2 * Math.PI * FREQUENCY_HZ * elapsedSeconds
    target.rotation.x = baseRotationX + Math.sin(phase) * AMPLITUDE_RADIANS
  }

  return { update }
}
