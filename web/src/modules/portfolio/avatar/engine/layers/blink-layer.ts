export interface BlinkWeights {
  eyeBlinkLeft: number
  eyeBlinkRight: number
}

export interface BlinkLayer {
  update: (deltaSeconds: number) => BlinkWeights
}

const CLOSE_MS = 90
const HOLD_MS = 40
const OPEN_MS = 120
const BLINK_TOTAL_MS = CLOSE_MS + HOLD_MS + OPEN_MS
const DOUBLE_BLINK_CHANCE = 0.08
const DOUBLE_BLINK_DELAY_MS = 180

const NORMAL_INTERVAL_MS: [number, number] = [2400, 6500]
const REDUCED_MOTION_INTERVAL_MS: [number, number] = [6000, 12000]

function randomIntervalMs(reducedMotion: boolean): number {
  const [min, max] = reducedMotion ? REDUCED_MOTION_INTERVAL_MS : NORMAL_INTERVAL_MS
  return min + Math.random() * (max - min)
}

function blinkEnvelope(elapsedMs: number): number {
  if (elapsedMs <= CLOSE_MS) return elapsedMs / CLOSE_MS
  if (elapsedMs <= CLOSE_MS + HOLD_MS) return 1
  if (elapsedMs <= BLINK_TOTAL_MS) return 1 - (elapsedMs - CLOSE_MS - HOLD_MS) / OPEN_MS
  return 0
}

/**
 * Next blink at `now + rand(2.4s, 6.5s)`, 8% chance of a follow-up double
 * blink ~180ms after the first one ends. Blinking keeps running (just at a
 * slower cadence) under reduced-motion, since it isn't a vestibular trigger.
 */
export function createBlinkLayer(reducedMotion: boolean): BlinkLayer {
  let elapsedMs = 0
  let nextBlinkAtMs = randomIntervalMs(reducedMotion)
  let blinkStartMs: number | null = null
  let doubleBlinkQueued = false

  function update(deltaSeconds: number): BlinkWeights {
    elapsedMs += deltaSeconds * 1000

    if (blinkStartMs === null && elapsedMs >= nextBlinkAtMs) {
      blinkStartMs = elapsedMs
      doubleBlinkQueued = !doubleBlinkQueued && Math.random() < DOUBLE_BLINK_CHANCE
    }

    let weight = 0

    if (blinkStartMs !== null) {
      const t = elapsedMs - blinkStartMs
      weight = blinkEnvelope(t)

      if (t > BLINK_TOTAL_MS) {
        blinkStartMs = null
        if (doubleBlinkQueued) {
          doubleBlinkQueued = false
          nextBlinkAtMs = elapsedMs + DOUBLE_BLINK_DELAY_MS
        } else {
          nextBlinkAtMs = elapsedMs + randomIntervalMs(reducedMotion)
        }
      }
    }

    weight = Math.max(0, Math.min(1, weight))
    return { eyeBlinkLeft: weight, eyeBlinkRight: weight }
  }

  return { update }
}
