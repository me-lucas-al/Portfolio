import type { TimelineMilestoneType } from "@portfolio/packages"

export interface TimelineImage {
  src: string
  alt: string
}

export interface TimelineGraveyardIdea {
  titlePt: string
  titleEn: string
  descriptionPt: string
  descriptionEn: string
}

export interface TimelineSequenceStep {
  datePt: string
  dateEn: string
  labelPt: string
  labelEn: string
}

export interface TimelineMilestone {
  slug: string
  kind: "milestone" | "gap"
  dateLabelPt: string
  dateLabelEn: string
  titlePt: string
  titleEn: string
  impactPt: string
  impactEn: string
  tags: string[]
  narrationPt: string
  narrationEn: string
  problemPt: string
  problemEn: string
  inflectionPt: string
  inflectionEn: string
  solutionPt: string
  solutionEn: string
  beforeImage?: TimelineImage
  afterImage?: TimelineImage
  sequence?: TimelineSequenceStep[]
  graveyard?: TimelineGraveyardIdea[]
}

function fallbackText(value: string | null | undefined, fallbackValue: string): string {
  return value?.trim() || fallbackValue
}

export function toPublicTimelineMilestone(milestone: TimelineMilestoneType): TimelineMilestone {
  return {
    slug: milestone.slug,
    kind: milestone.kind === "GAP" ? "gap" : "milestone",
    dateLabelPt: milestone.dateLabelPt,
    dateLabelEn: fallbackText(milestone.dateLabelEn, milestone.dateLabelPt),
    titlePt: milestone.titlePt,
    titleEn: fallbackText(milestone.titleEn, milestone.titlePt),
    impactPt: milestone.impactPt,
    impactEn: fallbackText(milestone.impactEn, milestone.impactPt),
    tags: milestone.tags,
    narrationPt: milestone.narrationPt,
    narrationEn: fallbackText(milestone.narrationEn, milestone.narrationPt),
    problemPt: milestone.problemPt,
    problemEn: fallbackText(milestone.problemEn, milestone.problemPt),
    inflectionPt: milestone.inflectionPt,
    inflectionEn: fallbackText(milestone.inflectionEn, milestone.inflectionPt),
    solutionPt: milestone.solutionPt,
    solutionEn: fallbackText(milestone.solutionEn, milestone.solutionPt),
    beforeImage: milestone.beforeImageUrl
      ? { src: milestone.beforeImageUrl, alt: milestone.beforeImageAlt ?? "" }
      : undefined,
    afterImage: milestone.afterImageUrl
      ? { src: milestone.afterImageUrl, alt: milestone.afterImageAlt ?? "" }
      : undefined,
    sequence: milestone.sequence.length
      ? milestone.sequence.map((step) => ({
          datePt: step.datePt,
          dateEn: fallbackText(step.dateEn, step.datePt),
          labelPt: step.labelPt,
          labelEn: fallbackText(step.labelEn, step.labelPt),
        }))
      : undefined,
    graveyard: milestone.graveyard.length
      ? milestone.graveyard.map((idea) => ({
          titlePt: idea.titlePt,
          titleEn: fallbackText(idea.titleEn, idea.titlePt),
          descriptionPt: idea.descriptionPt,
          descriptionEn: fallbackText(idea.descriptionEn, idea.descriptionPt),
        }))
      : undefined,
  }
}
