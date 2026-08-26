import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../mouth/mouth-source", () => ({
  activateMouthSource: vi.fn(),
  deactivateMouthSource: vi.fn(),
  writeMouthOpen: vi.fn(),
}))

vi.mock("./typing-surface-registry", () => ({
  writeTypingSurfaces: vi.fn(),
}))

import { deactivateMouthSource } from "../mouth/mouth-source"
import { writeTypingSurfaces } from "./typing-surface-registry"
import { skipTyping, startTyping, stopTyping } from "./typing-engine"

/** Captures the single pending rAF callback instead of auto-scheduling, so tests drive frames with exact timestamps. */
function installManualRaf() {
  let pending: FrameRequestCallback | null = null
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    pending = cb
    return 1
  })
  vi.stubGlobal("cancelAnimationFrame", () => {
    pending = null
  })
  return {
    /** Invokes the pending callback (if any) with `nowMs`, capturing whatever it schedules next. */
    step(nowMs: number) {
      const cb = pending
      pending = null
      cb?.(nowMs)
    },
    hasPending: () => pending !== null,
  }
}

describe("typing-engine", () => {
  let raf: ReturnType<typeof installManualRaf>

  beforeEach(() => {
    vi.clearAllMocks()
    raf = installManualRaf()
  })

  afterEach(() => {
    stopTyping()
    vi.unstubAllGlobals()
  })

  it("reveals characters deterministically as time crosses the per-character delay", () => {
    const onBlip = vi.fn()
    startTyping("ab", { onBlip })

    // The first character reveals on the very first frame (no delay to wait out yet).
    raf.step(0)
    expect(writeTypingSurfaces).toHaveBeenLastCalledWith("a")

    // 32ms elapses - exactly one character's worth of budget (BASE_CHAR_MS) - reveals the next.
    raf.step(32)
    expect(writeTypingSurfaces).toHaveBeenLastCalledWith("ab")
  })

  it("throttles blips to MIN_BLIP_INTERVAL_MS apart", () => {
    const onBlip = vi.fn()
    startTyping("abc", { onBlip })

    raf.step(0)
    raf.step(32) // reveals "a" - first blip, allowed (msSinceLastBlip starts at Infinity)
    raf.step(64) // reveals "b" - only 32ms since last blip (< 60ms) - throttled
    raf.step(96) // reveals "c" - 64ms since last blip (>= 60ms) - allowed

    expect(onBlip).toHaveBeenCalledTimes(2)
  })

  it("does not blip on whitespace", () => {
    const onBlip = vi.fn()
    startTyping("a b", { onBlip })

    raf.step(0)
    raf.step(32) // "a"
    raf.step(64) // " "
    raf.step(96) // "b"

    expect(onBlip).toHaveBeenCalledTimes(2)
  })

  it("clamps a large delta instead of dumping a burst of characters in one frame", () => {
    const onBlip = vi.fn()
    startTyping("abcdefghij", { onBlip })

    raf.step(0) // reveals "a" immediately
    // A huge gap (tab was backgrounded) - clamped to MAX_DELTA_MS=50, so at
    // most one extra character's worth of budget (32ms of the 50ms) is
    // actually consumed, not all ten characters at once.
    raf.step(5000)

    expect(writeTypingSurfaces).toHaveBeenLastCalledWith("ab")
  })

  it("stopTyping aborts without revealing the rest and deactivates the mouth source", () => {
    startTyping("hello", { onBlip: vi.fn() })
    raf.step(0)
    raf.step(32)

    stopTyping()

    expect(raf.hasPending()).toBe(false)
    expect(deactivateMouthSource).toHaveBeenCalledWith("typing")
  })

  it("skipTyping reveals the full text immediately and fires onDone", () => {
    const onDone = vi.fn()
    startTyping("hello world", { onBlip: vi.fn(), onDone })
    raf.step(0)
    raf.step(32)

    skipTyping()

    expect(writeTypingSurfaces).toHaveBeenLastCalledWith("hello world")
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(raf.hasPending()).toBe(false)
  })
})
