import { describe, expect, it } from "vitest"
import { punctuationHold } from "./punctuation-cadence"

describe("punctuationHold", () => {
  it("holds briefly after a comma/semicolon/colon", () => {
    expect(punctuationHold(",", "")).toBe(180)
    expect(punctuationHold(";", "")).toBe(180)
    expect(punctuationHold(":", "")).toBe(180)
  })

  it("holds longer after sentence-ending punctuation", () => {
    expect(punctuationHold(".", "")).toBe(320)
    expect(punctuationHold("!", "")).toBe(320)
    expect(punctuationHold("?", "")).toBe(320)
  })

  it("holds after a newline", () => {
    expect(punctuationHold("\n", "")).toBe(260)
  })

  it("holds the longest for an ellipsis glyph", () => {
    expect(punctuationHold("…", "")).toBe(420)
  })

  it("treats the third dot of a typed ellipsis as an ellipsis hold", () => {
    expect(punctuationHold(".", "wait")).toBe(320)
    expect(punctuationHold(".", "wait.")).toBe(320)
    expect(punctuationHold(".", "wait..")).toBe(420)
  })

  it("has no extra hold for other characters", () => {
    expect(punctuationHold("a", "")).toBe(0)
    expect(punctuationHold(" ", "")).toBe(0)
  })
})
