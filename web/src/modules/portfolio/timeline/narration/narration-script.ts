import type { Locale } from "@/i18n"
import type { TimelineMilestone } from "../timeline-data"

export type NarrationBeatKind = "story"

export interface NarrationBeat {
  id: string
  milestoneSlug: string
  kind: NarrationBeatKind
  text: string
}

// A speech balloon only has room for a couple of sentences, but too many balloons per
// phase makes the journey feel tedious to click through. So a milestone's narration is
// split into at most MAX_BEATS_PER_MILESTONE chunks, sized as evenly as possible, never
// cutting a sentence in half.
const MAX_BEATS_PER_MILESTONE = 3

function splitNarrationIntoChunks(text: string): string[] {
  const sentences = (text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) ?? [text]).map((s) => s.trim()).filter(Boolean)
  if (sentences.length <= 1) return [text]

  const groupCount = Math.min(MAX_BEATS_PER_MILESTONE, sentences.length)
  const totalLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0)
  const targetLength = totalLength / groupCount

  const groups: string[] = []
  let current = ""

  for (const sentence of sentences) {
    const remainingGroups = groupCount - groups.length
    if (current && remainingGroups > 1 && current.length >= targetLength) {
      groups.push(current)
      current = sentence
    } else {
      current = current ? `${current} ${sentence}` : sentence
    }
  }
  if (current) groups.push(current)

  return groups
}

function buildStoryBeats(milestone: TimelineMilestone, locale: Locale): NarrationBeat[] {
  const text = (locale === "en" ? milestone.narrationEn : milestone.narrationPt).trim()
  if (!text) return []

  return splitNarrationIntoChunks(text).map((chunk, index) => ({
    id: `${milestone.slug}-story-${index}`,
    milestoneSlug: milestone.slug,
    kind: "story",
    text: chunk,
  }))
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
  return milestones.flatMap((milestone) => buildStoryBeats(milestone, locale))
}
