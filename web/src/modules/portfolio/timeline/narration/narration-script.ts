import type { Locale } from "@/i18n"
import type { TimelineMilestone } from "../timeline-data"

export type NarrationBeatKind = "story"

export interface NarrationBeat {
  id: string
  milestoneSlug: string
  kind: NarrationBeatKind
  text: string
}

// One flowing, non-technical beat per milestone, so the assistant tells the journey as a
// single continuous story from start to finish instead of reading out separate technical
// fragments. The richer problem/inflection/solution fields stay written-only, for the
// detail panel and for buildMilestonePhaseContext below.
function buildStoryBeat(milestone: TimelineMilestone, locale: Locale): NarrationBeat | null {
  const text = (locale === "en" ? milestone.narrationEn : milestone.narrationPt).trim()
  if (!text) return null

  return { id: `${milestone.slug}-story`, milestoneSlug: milestone.slug, kind: "story", text }
}

type PhaseContextKind = "impact" | "problem" | "inflection" | "solution"

const PHASE_CONTEXT_STORY_KINDS: PhaseContextKind[] = ["impact", "problem", "inflection", "solution"]

function pickPhaseContextText(milestone: TimelineMilestone, kind: PhaseContextKind, locale: Locale): string {
  const isEn = locale === "en"

  switch (kind) {
    case "impact":
      return isEn ? milestone.impactEn : milestone.impactPt
    case "problem":
      return isEn ? milestone.problemEn : milestone.problemPt
    case "inflection":
      return isEn ? milestone.inflectionEn : milestone.inflectionPt
    case "solution":
      return isEn ? milestone.solutionEn : milestone.solutionPt
  }
}

function buildMilestoneDetailText(milestone: TimelineMilestone, locale: Locale): string {
  const isEn = locale === "en"

  const sequenceText = (milestone.sequence ?? [])
    .map((step) => `${isEn ? step.dateEn : step.datePt}: ${isEn ? step.labelEn : step.labelPt}`)
    .join("\n")

  const graveyardText = (milestone.graveyard ?? [])
    .map((idea) => `${isEn ? idea.titleEn : idea.titlePt}: ${isEn ? idea.descriptionEn : idea.descriptionPt}`)
    .join("\n")

  return [sequenceText, graveyardText].filter((text) => text.length > 0).join("\n\n")
}

export function buildMilestonePhaseContext(milestone: TimelineMilestone, locale: Locale): string {
  const storyText = PHASE_CONTEXT_STORY_KINDS.map((kind) =>
    pickPhaseContextText(milestone, kind, locale).trim()
  ).filter((text) => text.length > 0)

  const detailText = buildMilestoneDetailText(milestone, locale)

  return [...storyText, detailText].filter((text) => text.length > 0).join("\n\n")
}

export function buildNarrationScript(milestones: TimelineMilestone[], locale: Locale): NarrationBeat[] {
  return milestones
    .map((milestone) => buildStoryBeat(milestone, locale))
    .filter((beat): beat is NarrationBeat => beat !== null)
}
