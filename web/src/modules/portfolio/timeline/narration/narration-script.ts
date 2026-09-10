import type { Locale } from "@/i18n"
import type { TimelineMilestone } from "../timeline-data"

export type NarrationBeatKind = "story"

export interface NarrationBeat {
  id: string
  milestoneSlug: string
  kind: NarrationBeatKind
  text: string
}

const MAX_CHUNK_LENGTH = 180

function splitNarrationIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) ?? [text]
  const chunks: string[] = []
  let current = ""

  for (const rawSentence of sentences) {
    const sentence = rawSentence.trim()
    if (!sentence) continue

    const candidate = current ? `${current} ${sentence}` : sentence
    if (current && candidate.length > MAX_CHUNK_LENGTH) {
      chunks.push(current)
      current = sentence
    } else {
      current = candidate
    }
  }
  if (current) chunks.push(current)

  return chunks
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
