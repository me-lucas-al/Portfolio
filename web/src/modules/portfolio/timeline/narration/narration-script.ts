import type { Locale } from "@/i18n"
import type { TimelineMilestone } from "../timeline-data"

export type NarrationBeatKind = "title" | "impact" | "problem" | "inflection" | "solution" | "sequence" | "graveyard"

export interface NarrationBeat {
  id: string
  milestoneSlug: string
  kind: NarrationBeatKind
  text: string
}

type StoryBeatKind = "title" | "impact" | "problem" | "inflection" | "solution"

const STORY_BEAT_ORDER: StoryBeatKind[] = ["title", "impact", "problem", "inflection", "solution"]

function pickStoryBeatText(milestone: TimelineMilestone, kind: StoryBeatKind, locale: Locale): string {
  const isEn = locale === "en"

  switch (kind) {
    case "title": {
      const dateLabel = isEn ? milestone.dateLabelEn : milestone.dateLabelPt
      const title = isEn ? milestone.titleEn : milestone.titlePt
      return `${dateLabel} — ${title}`
    }
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

function buildStoryBeats(milestone: TimelineMilestone, locale: Locale): NarrationBeat[] {
  return STORY_BEAT_ORDER.map((kind) => ({ kind, text: pickStoryBeatText(milestone, kind, locale).trim() }))
    .filter((beat) => beat.text.length > 0)
    .map((beat) => ({ id: `${milestone.slug}-${beat.kind}`, milestoneSlug: milestone.slug, ...beat }))
}

function buildSequenceBeats(milestone: TimelineMilestone, locale: Locale): NarrationBeat[] {
  const isEn = locale === "en"

  return (milestone.sequence ?? []).map((step, index) => ({
    id: `${milestone.slug}-sequence-${index}`,
    milestoneSlug: milestone.slug,
    kind: "sequence" as const,
    text: `${isEn ? step.dateEn : step.datePt} — ${isEn ? step.labelEn : step.labelPt}`,
  }))
}

function buildGraveyardBeats(milestone: TimelineMilestone, locale: Locale): NarrationBeat[] {
  const isEn = locale === "en"

  return (milestone.graveyard ?? []).map((idea, index) => ({
    id: `${milestone.slug}-graveyard-${index}`,
    milestoneSlug: milestone.slug,
    kind: "graveyard" as const,
    text: `${isEn ? idea.titleEn : idea.titlePt} — ${isEn ? idea.descriptionEn : idea.descriptionPt}`,
  }))
}

function buildMilestoneDetailText(milestone: TimelineMilestone, locale: Locale): string {
  const isEn = locale === "en"

  const sequenceText = (milestone.sequence ?? [])
    .map((step) => `${isEn ? step.dateEn : step.datePt} — ${isEn ? step.labelEn : step.labelPt}`)
    .join("\n")

  const graveyardText = (milestone.graveyard ?? [])
    .map((idea) => `${isEn ? idea.titleEn : idea.titlePt} — ${isEn ? idea.descriptionEn : idea.descriptionPt}`)
    .join("\n")

  return [sequenceText, graveyardText].filter((text) => text.length > 0).join("\n\n")
}

const PHASE_CONTEXT_STORY_KINDS: StoryBeatKind[] = ["impact", "problem", "inflection", "solution"]

export function buildMilestonePhaseContext(milestone: TimelineMilestone, locale: Locale): string {
  const storyText = PHASE_CONTEXT_STORY_KINDS.map((kind) => pickStoryBeatText(milestone, kind, locale).trim()).filter(
    (text) => text.length > 0
  )

  const detailText = buildMilestoneDetailText(milestone, locale)

  return [...storyText, detailText].filter((text) => text.length > 0).join("\n\n")
}

export function buildNarrationScript(milestones: TimelineMilestone[], locale: Locale): NarrationBeat[] {
  return milestones.flatMap((milestone) => [
    ...buildStoryBeats(milestone, locale),
    ...buildSequenceBeats(milestone, locale),
    ...buildGraveyardBeats(milestone, locale),
  ])
}
