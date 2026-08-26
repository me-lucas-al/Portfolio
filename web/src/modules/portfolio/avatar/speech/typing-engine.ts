import { activateMouthSource, deactivateMouthSource, writeMouthOpen } from "../mouth/mouth-source"
import { punctuationHold } from "./punctuation-cadence"
import { writeTypingSurfaces } from "./typing-surface-registry"

export interface TypingEngineCallbacks {
  /** Called once per revealed non-whitespace character, throttled by `MIN_BLIP_INTERVAL_MS`. */
  onBlip: () => void
  /** Called once the full text has been revealed (not called if the engine is stopped/superseded first). */
  onDone?: () => void
}

const BASE_CHAR_MS = 32
const TICK_TARGET = 0.95
const TARGET_DECAY_TAU = 0.055
const ATTACK_TAU = 0.02
const RELEASE_TAU = 0.07
const DEADZONE = 0.05
const MIN_BLIP_INTERVAL_MS = 60
// Never dump more than this much sim time in one frame - prevents a burst of
// characters/blips when the tab returns from being backgrounded/throttled.
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

function finish(): void {
  cancelFrame()
  deactivateMouthSource("typing")
  onDoneCallback?.()
  onDoneCallback = null
  onBlipCallback = null
}

function cancelFrame(): void {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
}

function tick(nowMs: number): void {
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
  // Re-asserts "typing" every frame (not just once in `startTyping`) so that
  // if `audio` preempted it and later deactivates mid-typing, this engine
  // reclaims the mouth on its very next frame instead of leaving it stuck
  // closed for the rest of the reveal - `activateMouthSource` is a no-op
  // when `audio` is still active, so this costs nothing today.
  activateMouthSource("typing")
  writeMouthOpen("typing", mouthCurrent < DEADZONE ? 0 : mouthCurrent)

  if (cursor >= text.length && mouthCurrent < DEADZONE) {
    finish()
    return
  }

  rafId = window.requestAnimationFrame(tick)
}

/** Starts revealing `text` one character at a time. Supersedes (aborts) any typing already in progress. */
export function startTyping(nextText: string, callbacks: TypingEngineCallbacks): void {
  cancelFrame()
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
  rafId = window.requestAnimationFrame(tick)
}

/** Aborts typing immediately, wherever it was - does not finish revealing the text. Forces the mouth closed. */
export function stopTyping(): void {
  cancelFrame()
  deactivateMouthSource("typing")
  onBlipCallback = null
  onDoneCallback = null
}

/** Reveals the rest of the text instantly (click-to-skip, or `prefers-reduced-motion`). */
export function skipTyping(): void {
  if (rafId === null && cursor >= text.length) return
  cancelFrame()
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
