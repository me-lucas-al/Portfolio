import { getAudioGraph } from "./audio-graph"
import { setMouthOpen } from "../state/avatar-signal-bus"

// Typical speech RMS (time-domain, `getFloatTimeDomainData`) sits roughly in
// 0.01..0.25 for the kind of audio this pipeline plays. `getByteTimeDomainData`
// would lose exactly the resolution weak consonants need, and
// `getByteFrequencyData` measures the wrong axis entirely (dB magnitude, not
// volume) - hence `getFloatTimeDomainData` here.
const RMS_FLOOR = 0.01
const RMS_CEILING = 0.18
const SHAPE_EXPONENT = 0.6

// Attack ~4.5x faster than release: a decisive open on onset, a gentler
// close so consonant gaps don't make the jaw chatter.
const ATTACK_TAU_SECONDS = 0.02
const RELEASE_TAU_SECONDS = 0.09

const DEADZONE = 0.05
// jawOpen=1.0 distorts most rigs - never actually reach it.
const CEILING = 0.85

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

let rafId: number | null = null
let lastTimeMs: number | null = null
let current = 0

function tick(timeMs: number): void {
  const { analyserNode, timeDomainBuffer } = getAudioGraph()
  analyserNode.getFloatTimeDomainData(timeDomainBuffer)

  let sumSquares = 0
  for (let i = 0; i < timeDomainBuffer.length; i += 1) {
    const sample = timeDomainBuffer[i]
    sumSquares += sample * sample
  }
  const rms = Math.sqrt(sumSquares / timeDomainBuffer.length)

  const norm = clamp01((rms - RMS_FLOOR) / (RMS_CEILING - RMS_FLOOR))
  const shaped = norm ** SHAPE_EXPONENT

  const lastMs = lastTimeMs ?? timeMs
  const deltaSeconds = Math.max(0, (timeMs - lastMs) / 1000)
  lastTimeMs = timeMs

  const tau = shaped > current ? ATTACK_TAU_SECONDS : RELEASE_TAU_SECONDS
  current += (shaped - current) * (1 - Math.exp(-deltaSeconds / tau))

  setMouthOpen(current < DEADZONE ? 0 : current * CEILING)

  rafId = window.requestAnimationFrame(tick)
}

/**
 * Per-frame amplitude -> `mouthOpen` driver, running its own `rAF` loop
 * independent of the three.js render loop (the avatar canvas may be idle-
 * throttled or not even booted yet when speech starts, and this needs to
 * keep sampling regardless). Idempotent - calling `start()` while already
 * running is a no-op.
 *
 * `stop()` immediately cancels the loop AND forces `mouthOpen` back to `0`
 * in `avatar-signal-bus.ts` - never leaves a stale nonzero value hanging
 * after speech ends, per this module's own "always write zeros, never just
 * stop writing" mixer convention (see `engine/layers/viseme-layer.ts`).
 */
export function startLipSyncAnalyser(): void {
  if (rafId !== null) return
  lastTimeMs = null
  rafId = window.requestAnimationFrame(tick)
}

export function stopLipSyncAnalyser(): void {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
  lastTimeMs = null
  current = 0
  setMouthOpen(0)
}
