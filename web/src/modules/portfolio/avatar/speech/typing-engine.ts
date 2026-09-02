import { activateMouthSource, deactivateMouthSource, writeMouthOpen } from "../mouth/mouth-source"
import { punctuationHold } from "./punctuation-cadence"
import { writeTypingSurfaces } from "./typing-surface-registry"

export interface TypingEngineCallbacks {

  onBlip: () => void

  onDone?: () => void
}

const BASE_CHAR_MS = 32
const TICK_TARGET = 0.95
const TARGET_DECAY_TAU = 0.055
const ATTACK_TAU = 0.02
const RELEASE_TAU = 0.07
const DEADZONE = 0.05
const MIN_BLIP_INTERVAL_MS = 60

const MAX_DELTA_MS = 50

let rafId: number | null = null
let text = ""
let cursor = 0
let budgetMs = 0
let nextDelayMs = 0
let lastFrameTimeMs: number | null = null
let mouthTarget = 0
let mouthCurrent = 0
let msSinceLastBlip = Infinity
let onBlipCallback: (() => void) | null = null
let onDoneCallback: (() => void) | null = null

function isWhitespace(char: string): boolean {
  return /\s/.test(char)
}

function finishTypingAnimation(): void {
  cancelScheduledTypingFrame()
  deactivateMouthSource("typing")
  onDoneCallback?.()
  onDoneCallback = null
  onBlipCallback = null
}

function cancelScheduledTypingFrame(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function processTypingAnimationFrame(nowMs: number): void {
  const lastMs = lastFrameTimeMs ?? nowMs
  const deltaMs = Math.min(Math.max(nowMs - lastMs, 0), MAX_DELTA_MS)
  lastFrameTimeMs = nowMs

  budgetMs += deltaMs
  msSinceLastBlip += deltaMs

  let revealedSomething = false
  while (cursor < text.length && budgetMs >= nextDelayMs) {
    budgetMs -= nextDelayMs
    const char = text[cursor]
    const precedingText = text.slice(0, cursor)
    cursor += 1
    revealedSomething = true

    if (!isWhitespace(char)) {
      mouthTarget = TICK_TARGET
      if (msSinceLastBlip >= MIN_BLIP_INTERVAL_MS) {
        msSinceLastBlip = 0
        onBlipCallback?.()
      }
    }

    nextDelayMs = BASE_CHAR_MS + punctuationHold(char, precedingText)
  }

  if (revealedSomething) writeTypingSurfaces(text.slice(0, cursor))

  const deltaSeconds = deltaMs / 1000
  mouthTarget *= Math.exp(-deltaSeconds / TARGET_DECAY_TAU)
  const tau = mouthTarget > mouthCurrent ? ATTACK_TAU : RELEASE_TAU
  mouthCurrent += (mouthTarget - mouthCurrent) * (1 - Math.exp(-deltaSeconds / tau))

  activateMouthSource("typing")
  writeMouthOpen("typing", mouthCurrent < DEADZONE ? 0 : mouthCurrent)

  if (cursor >= text.length && mouthCurrent < DEADZONE) {
    finishTypingAnimation()
    return
  }

  rafId = requestAnimationFrame(processTypingAnimationFrame)
}

export function startTyping(nextText: string, callbacks: TypingEngineCallbacks): void {
  cancelScheduledTypingFrame()
  text = nextText
  cursor = 0
  budgetMs = 0
  nextDelayMs = 0
  lastFrameTimeMs = null
  mouthTarget = 0
  mouthCurrent = 0
  msSinceLastBlip = Infinity
  onBlipCallback = callbacks.onBlip
  onDoneCallback = callbacks.onDone ?? null

  writeTypingSurfaces("")
  activateMouthSource("typing")
  rafId = requestAnimationFrame(processTypingAnimationFrame)
}

export function stopTyping(): void {
  cancelScheduledTypingFrame()
  deactivateMouthSource("typing")
  onBlipCallback = null
  onDoneCallback = null
}

export function skipTyping(): void {
  if (rafId === null && cursor >= text.length) return
  cancelScheduledTypingFrame()
  writeTypingSurfaces(text)
  deactivateMouthSource("typing")
  const callback = onDoneCallback
  onBlipCallback = null
  onDoneCallback = null
  callback?.()
}

export function isTypingActive(): boolean {
  return rafId !== null
}
