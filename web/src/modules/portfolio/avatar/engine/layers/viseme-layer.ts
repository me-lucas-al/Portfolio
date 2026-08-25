import { getMouthOpen } from "../../state/avatar-signal-bus"

export interface VisemeWeights {
  jawOpen: number
  mouthFunnel: number
}

export interface VisemeLayer {
  update: (deltaSeconds: number) => VisemeWeights
}

// A little funnel rounds the mouth shape out instead of leaving lip-sync as
// a pure hinge-jaw drop - kept low so it reads as a secondary shape, never
// competing with jawOpen for "how open is the mouth".
const MOUTH_FUNNEL_FACTOR = 0.2

/**
 * Idle-mixer layer, same shape as `blink-layer.ts`/`breath-layer.ts`/
 * `look-at-layer.ts`: reads `state/avatar-signal-bus.ts`'s `mouthOpen`
 * (0..1) once per frame and maps it onto blendshape weights.
 *
 * Deliberately does NOT re-damp or re-shape the value - `mouthOpen` already
 * went through the attack/release envelope in `audio/lip-sync-analyser.ts`
 * before landing in the bus. This layer is a pure, stateless read + linear
 * map, so it always reflects whatever the bus currently holds (including
 * `0` once speech stops), following the module's "write all managed weights
 * every tick, including zeros" mixer convention (see `avatar-engine.ts` /
 * the module README) - a lip-sync layer that only writes non-zero values
 * would leave the mouth stuck open once nothing else claims ownership of it.
 */
export function createVisemeLayer(): VisemeLayer {
  function update(_deltaSeconds: number): VisemeWeights {
    const mouthOpen = getMouthOpen()

    return {
      jawOpen: mouthOpen,
      mouthFunnel: mouthOpen * MOUTH_FUNNEL_FACTOR,
    }
  }

  return { update }
}
