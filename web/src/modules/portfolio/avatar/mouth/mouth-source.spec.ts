import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../state/avatar-signal-bus", () => ({
  setMouthOpen: vi.fn(),
}))

import { setMouthOpen } from "../state/avatar-signal-bus"
import { activateMouthSource, deactivateMouthSource, getActiveMouthSource, writeMouthOpen } from "./mouth-source"

describe("mouth-source", () => {
  beforeEach(() => {
    // Reset module-scope state between tests by deactivating whatever might be active,
    // THEN clear the mock's call history - otherwise these cleanup calls themselves
    // would count toward the assertions inside the test that follows.
    deactivateMouthSource("typing")
    deactivateMouthSource("audio")
    vi.clearAllMocks()
  })

  it("writes from an inactive source are discarded", () => {
    writeMouthOpen("typing", 0.5)
    expect(setMouthOpen).not.toHaveBeenCalled()
  })

  it("writes from the active source pass through", () => {
    activateMouthSource("typing")
    writeMouthOpen("typing", 0.7)
    expect(setMouthOpen).toHaveBeenCalledWith(0.7)
  })

  it("audio takes priority over typing", () => {
    activateMouthSource("typing")
    activateMouthSource("audio")
    expect(getActiveMouthSource()).toBe("audio")

    writeMouthOpen("typing", 0.9)
    expect(setMouthOpen).not.toHaveBeenCalled()

    writeMouthOpen("audio", 0.3)
    expect(setMouthOpen).toHaveBeenCalledWith(0.3)
  })

  it("typing cannot preempt an active audio source", () => {
    activateMouthSource("audio")
    activateMouthSource("typing")
    expect(getActiveMouthSource()).toBe("audio")
  })

  it("deactivating the active source forces mouthOpen to 0", () => {
    activateMouthSource("typing")
    deactivateMouthSource("typing")
    expect(setMouthOpen).toHaveBeenCalledWith(0)
    expect(getActiveMouthSource()).toBeNull()
  })

  it("deactivating an inactive source is a no-op", () => {
    activateMouthSource("audio")
    deactivateMouthSource("typing")
    expect(getActiveMouthSource()).toBe("audio")
    expect(setMouthOpen).not.toHaveBeenCalled()
  })
})
