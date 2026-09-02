import { getAudioGraph } from "./audio-graph"
import { activateMouthSource, deactivateMouthSource, writeMouthOpen } from "../mouth/mouth-source"

const RMS_FLOOR = 0.01
const RMS_CEILING = 0.18
const SHAPE_EXPONENT = 0.6

const ATTACK_TAU_SECONDS = 0.02
const RELEASE_TAU_SECONDS = 0.09

const DEADZONE = 0.05

const CEILING = 0.85

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

let rafId: number | null = null
let lastTimeMs: number | null = null
let current = 0

function analyzeAudioLipSyncFrame(timeMs: number): void {
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

  writeMouthOpen("audio", current < DEADZONE ? 0 : current * CEILING)

  rafId = window.requestAnimationFrame(analyzeAudioLipSyncFrame)
}

export function startLipSyncAnalyser(): void {
  if (rafId !== null) return
  activateMouthSource("audio")
  lastTimeMs = null
  rafId = window.requestAnimationFrame(analyzeAudioLipSyncFrame)
}

export function stopLipSyncAnalyser(): void {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
  lastTimeMs = null
  current = 0
  deactivateMouthSource("audio")
}
