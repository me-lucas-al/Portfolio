import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Uses the REAL `mouth-source.ts` (unlike `typing-engine.spec.ts`, which
// mocks it) - this test is specifically about the interaction between the
// two modules: does the typing engine reclaim the mouth on its own once a
// higher-priority "audio" source that preempted it goes away mid-typing.
vi.mock("./typing-surface-registry", () => ({
  writeTypingSurfaces: vi.fn(),
}))

import { setMouthOpen } from "../state/avatar-signal-bus"
import { activateMouthSource, deactivateMouthSource } from "../mouth/mouth-source"
import { startTyping, stopTyping } from "./typing-engine"

vi.mock("../state/avatar-signal-bus", () => ({
  setMouthOpen: vi.fn(),
}))

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
    step(nowMs: number) {
      const cb = pending
      pending = null
      cb?.(nowMs)
    },
  }
}

describe("typing-engine / mouth-source arbitration", () => {
  let raf: ReturnType<typeof installManualRaf>

  beforeEach(() => {
    vi.clearAllMocks()
    deactivateMouthSource("typing")
    deactivateMouthSource("audio")
    raf = installManualRaf()
  })

  afterEach(() => {
    stopTyping()
    vi.unstubAllGlobals()
  })

  it("reclaims the mouth automatically once a preempting audio source deactivates", () => {
    startTyping("hello world", { onBlip: vi.fn() })
    raf.step(0) // reveals "h" - typing owns the mouth, writes a nonzero target

    // Real TTS audio starts mid-typing and preempts (audio > typing priority).
    activateMouthSource("audio")
    vi.mocked(setMouthOpen).mockClear()

    raf.step(32)
    // While audio owns the mouth, the typing engine's writes must be discarded.
    expect(setMouthOpen).not.toHaveBeenCalled()

    // Audio playback ends.
    deactivateMouthSource("audio")
    vi.mocked(setMouthOpen).mockClear()

    raf.step(64)
    // Typing reclaims the mouth on its very next frame - no permanent lockout.
    expect(setMouthOpen).toHaveBeenCalled()
  })
})
