import { getMouthOpen, getThinking } from "../../state/avatar-signal-bus"
import { EMOTION_MANAGED_KEYS, TONE_TARGETS, type Tone } from "../../tone/tone"
import type { CanonicalBlendshapeName } from "../blendshape-names"

export type EmotionWeights = Partial<Record<CanonicalBlendshapeName, number>>

export interface EmotionLayer {
  /** Redirects the damped chase toward a new tone's target weights - see `../../tone/tone.ts`. */
  setTone: (tone: Tone) => void
  update: (deltaSeconds: number) => EmotionWeights
}

// Same exponential-damping rate `camera-rig.ts`/`viewport-rig.ts`/
// `look-at-layer.ts` already use (`current += (target - current) * (1 - exp(-rate * dt))`),
// kept consistent so every damped system in this engine settles at roughly
// the same pace.
const DAMPING_RATE = 6

// The "thinking" state machine (Fase 7) is deliberately minimal: rather than
// a whole new layer, this layer also owns a small `browInnerUp` bump while
// `thinking` has been true for a little while. The 1200ms delay exists
// specifically so a fast cache-hit response (loading flips true then false
// again within a few hundred ms) never shows a "thinking" animation that
// then gets abruptly cut off mid-transition - the fast path is the common
// path and must stay visually silent.
const THINKING_VISIBLE_DELAY_MS = 1200
const THINKING_BROW_BUMP = 0.12

// Mitigates the one real interaction bug between this layer and
// `viseme-layer.ts`: `mouthSmileLeft/Right` and `jawOpen` move overlapping
// geometry and are additive, so a big smile plus a wide-open jaw can push
// combined weights outside a sane range. Scaling this layer's entire
// contribution down while the mouth is open (rather than special-casing just
// the smile keys) is the mitigation this plan already settled on.
const MOUTH_OPEN_SUPPRESSION = 0.45

/**
 * Idle-mixer layer, same shape as `blink-layer.ts`/`look-at-layer.ts`/
 * `viseme-layer.ts`: holds a *target* tone's weight record and damps every
 * key it manages toward it every frame, writing zeros for any key the
 * current tone doesn't mention (per the module's mixer convention - see the
 * README). `setTone` is the only way the target changes; nothing in here
 * reads the signal bus's `tone` field directly - that's `avatar-engine.ts`'s
 * job (mirrors `look-at-layer.ts`'s `setTarget` + `update` split), keeping
 * this layer a plain, externally-driven damped state machine.
 *
 * `thinking` and `mouthOpen`, by contrast, ARE read directly from the bus
 * inside `update()`, the same way `viseme-layer.ts` reads `mouthOpen` - both
 * are frame-timed signals this layer needs on every tick regardless of
 * whether a caller remembered to push them in.
 */
export function createEmotionLayer(): EmotionLayer {
  let targetTone: Tone = "neutral"
  const current: EmotionWeights = {}
  for (const key of EMOTION_MANAGED_KEYS) current[key] = 0

  let thinkingElapsedMs = 0

  function setTone(tone: Tone): void {
    targetTone = tone
  }

  function update(deltaSeconds: number): EmotionWeights {
    const thinking = getThinking()
    thinkingElapsedMs = thinking ? thinkingElapsedMs + deltaSeconds * 1000 : 0
    const showThinkingBump = thinking && thinkingElapsedMs >= THINKING_VISIBLE_DELAY_MS

    const toneWeights = TONE_TARGETS[targetTone]
    const damping = 1 - Math.exp(-DAMPING_RATE * deltaSeconds)
    const mouthOpenScale = 1 - MOUTH_OPEN_SUPPRESSION * getMouthOpen()

    const output: EmotionWeights = {}

    for (const key of EMOTION_MANAGED_KEYS) {
      const target = (toneWeights[key] ?? 0) + (showThinkingBump && key === "browInnerUp" ? THINKING_BROW_BUMP : 0)
      const previous = current[key] ?? 0
      const next = previous + (target - previous) * damping
      current[key] = next
      output[key] = next * mouthOpenScale
    }

    return output
  }

  return { setTone, update }
}
