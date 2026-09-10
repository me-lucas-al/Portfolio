import { describe, expect, it } from "vitest"
import { timelineMilestonesFixture as timelineMilestones } from "./timeline-milestones.fixture"
import { buildMilestonePhaseContext, buildNarrationScript } from "./narration-script"

const MAX_BEATS_PER_MILESTONE = 3

describe("buildNarrationScript", () => {
  it("produces at most 3 story beats per milestone, in order", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")

    const orderedSlugs = [...new Set(script.map((beat) => beat.milestoneSlug))]
    expect(orderedSlugs).toEqual(timelineMilestones.map((milestone) => milestone.slug))
    expect(script.every((beat) => beat.kind === "story")).toBe(true)

    for (const slug of orderedSlugs) {
      const beatCount = script.filter((beat) => beat.milestoneSlug === slug).length
      expect(beatCount).toBeLessThanOrEqual(MAX_BEATS_PER_MILESTONE)
    }
  })

  it("reassembles a milestone's beats back into the original narration text", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")

    for (const milestone of timelineMilestones) {
      const expectedText = milestone.narrationPt.trim()
      if (!expectedText) continue

      const beats = script.filter((beat) => beat.milestoneSlug === milestone.slug)
      expect(beats.map((beat) => beat.text).join(" ")).toBe(expectedText)
    }
  })

  it("never splits a chunk mid-sentence, even when a single sentence is long", () => {
    const longSentence = `Uma frase única e bem longa que ${"passa".repeat(20)} do limite de tamanho de um balão.`
    const milestone = { ...timelineMilestones[0], narrationPt: longSentence, narrationEn: longSentence }
    const script = buildNarrationScript([milestone], "pt")

    expect(script).toHaveLength(1)
    expect(script[0].text).toBe(longSentence)
  })

  it("splits many short sentences into at most 3 balanced beats", () => {
    const shortSentences = Array.from(
      { length: 10 },
      (_, index) => `Esta é a frase número ${index}, com um pouco mais de texto para ocupar espaço.`
    ).join(" ")
    const milestone = { ...timelineMilestones[0], narrationPt: shortSentences, narrationEn: shortSentences }
    const script = buildNarrationScript([milestone], "pt")

    expect(script.length).toBeGreaterThan(1)
    expect(script.length).toBeLessThanOrEqual(MAX_BEATS_PER_MILESTONE)
    expect(script.map((beat) => beat.text).join(" ")).toBe(shortSentences)
  })

  it("uses pt fields for locale pt", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const beats = script.filter((beat) => beat.milestoneSlug === timelineMilestones[0].slug)

    expect(beats[0]?.id).toBe("fundacao-cms-story-0")
    expect(beats.map((beat) => beat.text).join(" ")).toBe(timelineMilestones[0].narrationPt)
  })

  it("uses en fields for locale en", () => {
    const script = buildNarrationScript(timelineMilestones, "en")
    const beats = script.filter((beat) => beat.milestoneSlug === timelineMilestones[0].slug)

    expect(beats[0]?.id).toBe("fundacao-cms-story-0")
    expect(beats.map((beat) => beat.text).join(" ")).toBe(timelineMilestones[0].narrationEn)
  })

  it("skips a milestone entirely if it has no narration text", () => {
    const removedSlug = timelineMilestones[1].slug
    const withoutNarration = timelineMilestones.map((milestone, index) =>
      index === 1 ? { ...milestone, narrationPt: "", narrationEn: "" } : milestone
    )
    const fullScript = buildNarrationScript(timelineMilestones, "pt")
    const script = buildNarrationScript(withoutNarration, "pt")
    const removedBeatCount = fullScript.filter((beat) => beat.milestoneSlug === removedSlug).length

    expect(script.some((beat) => beat.milestoneSlug === removedSlug)).toBe(false)
    expect(script.length).toBe(fullScript.length - removedBeatCount)
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
