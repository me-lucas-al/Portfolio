import { describe, expect, it } from "vitest"
import { timelineMilestones } from "../timeline-data"
import { buildMilestonePhaseContext, buildNarrationScript } from "./narration-script"

describe("buildNarrationScript", () => {
  it("produces exactly one story beat per milestone, in order", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")

    expect(script.map((beat) => beat.milestoneSlug)).toEqual(
      timelineMilestones.map((milestone) => milestone.slug)
    )
    expect(script.every((beat) => beat.kind === "story")).toBe(true)
  })

  it("uses pt fields for locale pt", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const beat = script.find((item) => item.id === "fundacao-cms-story")

    expect(beat?.text).toBe(timelineMilestones[0].narrationPt)
  })

  it("uses en fields for locale en", () => {
    const script = buildNarrationScript(timelineMilestones, "en")
    const beat = script.find((item) => item.id === "fundacao-cms-story")

    expect(beat?.text).toBe(timelineMilestones[0].narrationEn)
  })

  it("skips a milestone entirely if it has no narration text", () => {
    const withoutNarration = timelineMilestones.map((milestone, index) =>
      index === 1 ? { ...milestone, narrationPt: "", narrationEn: "" } : milestone
    )
    const script = buildNarrationScript(withoutNarration, "pt")

    expect(script.some((beat) => beat.milestoneSlug === withoutNarration[1].slug)).toBe(false)
    expect(script.length).toBe(timelineMilestones.length - 1)
  })
})

describe("buildMilestonePhaseContext", () => {
  it("includes the sequence and graveyard detail for milestones that have them", () => {
    const milestone = timelineMilestones.find((item) => item.slug === "era-ia-avatar")!
    const context = buildMilestonePhaseContext(milestone, "pt")

    expect(context).toContain("VRM descartado → Three.js tentado e também descartado")
    expect(context).toContain("Avatar 3D (VRM)")
  })

  it("does not blow up for milestones without sequence or graveyard data", () => {
    const milestone = timelineMilestones.find((item) => item.slug === "fundacao-cms")!
    const context = buildMilestonePhaseContext(milestone, "pt")

    expect(context.length).toBeGreaterThan(0)
  })
})
