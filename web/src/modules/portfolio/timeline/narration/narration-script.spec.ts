import { describe, expect, it } from "vitest"
import { timelineMilestones } from "../timeline-data"
import { buildMilestonePhaseContext, buildNarrationScript } from "./narration-script"

describe("buildNarrationScript", () => {
  it("orders beats as impact, problem, inflection, solution within each milestone, without narrating the title", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const firstMilestoneBeats = script.filter((beat) => beat.milestoneSlug === "fundacao-cms")

    expect(firstMilestoneBeats.map((beat) => beat.kind)).toEqual([
      "impact",
      "problem",
      "inflection",
      "solution",
    ])
  })

  it("uses pt fields for locale pt", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const impactBeat = script.find((beat) => beat.id === "fundacao-cms-impact")

    expect(impactBeat?.text).toBe(timelineMilestones[0].impactPt)
  })

  it("uses en fields for locale en", () => {
    const script = buildNarrationScript(timelineMilestones, "en")
    const impactBeat = script.find((beat) => beat.id === "fundacao-cms-impact")

    expect(impactBeat?.text).toBe(timelineMilestones[0].impactEn)
  })

  it("skips empty fields, such as a missing inflection", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const hiatoBeats = script.filter((beat) => beat.milestoneSlug === "hiato")

    expect(hiatoBeats.map((beat) => beat.kind)).toEqual(["impact", "problem", "inflection", "solution"])
  })

  it("still produces beats for gap-kind milestones", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const hiatoBeats = script.filter((beat) => beat.milestoneSlug === "hiato")

    expect(hiatoBeats.length).toBeGreaterThan(0)
  })

  it("produces one flat, ordered list across all milestones", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const slugsInOrder = [...new Set(script.map((beat) => beat.milestoneSlug))]

    expect(slugsInOrder).toEqual(timelineMilestones.map((milestone) => milestone.slug))
  })

  it("narrates sequence steps and graveyard ideas after the core story beats", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const milestone = timelineMilestones.find((item) => item.slug === "era-ia-avatar")!
    const beats = script.filter((beat) => beat.milestoneSlug === "era-ia-avatar")

    const expectedKinds = [
      "impact",
      "problem",
      "inflection",
      "solution",
      ...milestone.sequence!.map(() => "sequence"),
      ...milestone.graveyard!.map(() => "graveyard"),
    ]
    expect(beats.map((beat) => beat.kind)).toEqual(expectedKinds)
  })

  it("narrates a sequence step as its date and label, in the requested locale", () => {
    const script = buildNarrationScript(timelineMilestones, "en")
    const milestone = timelineMilestones.find((item) => item.slug === "era-ia-avatar")!
    const firstSequenceBeat = script.find((beat) => beat.id === "era-ia-avatar-sequence-0")
    const step = milestone.sequence![0]

    expect(firstSequenceBeat?.text).toBe(`${step.dateEn}: ${step.labelEn}`)
  })

  it("narrates a graveyard idea as its title and description", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const milestone = timelineMilestones.find((item) => item.slug === "era-ia-avatar")!
    const firstGraveyardBeat = script.find((beat) => beat.id === "era-ia-avatar-graveyard-0")
    const idea = milestone.graveyard![0]

    expect(firstGraveyardBeat?.text).toBe(`${idea.titlePt}: ${idea.descriptionPt}`)
  })

  it("skips sequence/graveyard beats for milestones that have none", () => {
    const script = buildNarrationScript(timelineMilestones, "pt")
    const fundacaoBeats = script.filter((beat) => beat.milestoneSlug === "fundacao-cms")

    expect(fundacaoBeats.some((beat) => beat.kind === "sequence" || beat.kind === "graveyard")).toBe(false)
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
