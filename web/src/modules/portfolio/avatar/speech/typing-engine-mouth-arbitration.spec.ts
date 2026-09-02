import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

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
    raf.step(0)

    activateMouthSource("audio")
    vi.mocked(setMouthOpen).mockClear()

    raf.step(32)

    expect(setMouthOpen).not.toHaveBeenCalled()

    deactivateMouthSource("audio")
    vi.mocked(setMouthOpen).mockClear()

    raf.step(64)

    expect(setMouthOpen).toHaveBeenCalled()
  })
})
