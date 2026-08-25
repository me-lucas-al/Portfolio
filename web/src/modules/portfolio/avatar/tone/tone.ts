import type { CanonicalBlendshapeName } from "../engine/blendshape-names"

/**
 * Fase 7 tone taxonomy. Purely data - no DOM, no `three`, safe to import from
 * anywhere (including a plain `vitest` unit test, see `classify-tone.spec.ts`).
 *
 * Each tone maps to a *target* blendshape-weight record that
 * `engine/layers/emotion-layer.ts` damps toward every frame, following the
 * exact same mixer convention as every other layer in this module (see the
 * README's "Layering / mixer convention" section) - the layer, not this
 * file, is responsible for writing zeros for any managed key a given tone
 * doesn't mention.
 *
 * Hard rule, deliberately enforced by never putting these keys in any tone
 * below: no tone drives anger/frown-that-reads-as-angry, and neither
 * `jawOpen` nor `mouthFunnel` ever appears in a tone's target weights - those
 * two blendshapes are exclusively owned by `engine/layers/viseme-layer.ts`
 * (lip sync). `surprised` looks like the obvious place to reach for a
 * jaw-drop; it deliberately doesn't get one here.
 */
export type Tone = "neutral" | "positive" | "enthusiastic" | "explanatory" | "apologetic" | "surprised"

export type ToneWeights = Partial<Record<CanonicalBlendshapeName, number>>

export const TONE_TARGETS: Record<Tone, ToneWeights> = {
  neutral: {},
  positive: {
    mouthSmileLeft: 0.5,
    mouthSmileRight: 0.5,
    cheekSquintLeft: 0.25,
    cheekSquintRight: 0.25,
    browInnerUp: 0.1,
  },
  enthusiastic: {
    mouthSmileLeft: 0.8,
    mouthSmileRight: 0.8,
    browOuterUpLeft: 0.35,
    browOuterUpRight: 0.35,
    eyeWideLeft: 0.15,
    eyeWideRight: 0.15,
  },
  explanatory: {
    browInnerUp: 0.2,
    mouthPressLeft: 0.15,
    mouthPressRight: 0.15,
  },
  apologetic: {
    browInnerUp: 0.45,
    mouthFrownLeft: 0.35,
    mouthFrownRight: 0.35,
    eyeLookDownLeft: 0.15,
    eyeLookDownRight: 0.15,
  },
  surprised: {
    browInnerUp: 0.5,
    browOuterUpLeft: 0.5,
    browOuterUpRight: 0.5,
    eyeWideLeft: 0.45,
    eyeWideRight: 0.45,
  },
}

/**
 * Every canonical blendshape name any tone target above can reach. Used by
 * `emotion-layer.ts` to know which keys it owns end-to-end (so it can write
 * zeros for keys the *current* tone doesn't mention, per the mixer
 * convention) without hardcoding the list twice.
 */
export const EMOTION_MANAGED_KEYS: CanonicalBlendshapeName[] = Array.from(
  new Set(Object.values(TONE_TARGETS).flatMap((weights) => Object.keys(weights)))
) as CanonicalBlendshapeName[]
