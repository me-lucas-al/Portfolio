import { z } from "zod"

export const TimelineMilestoneKindEnum = z.enum(["MILESTONE", "GAP"])
export type TimelineMilestoneKindType = z.infer<typeof TimelineMilestoneKindEnum>

export const TimelineSequenceStepSchema = z.object({
  datePt: z.string().min(1).max(100),
  dateEn: z.string().max(100).optional().nullable(),
  labelPt: z.string().min(1).max(500),
  labelEn: z.string().max(500).optional().nullable(),
})
export type TimelineSequenceStepType = z.infer<typeof TimelineSequenceStepSchema>

export const TimelineGraveyardIdeaSchema = z.object({
  titlePt: z.string().min(1).max(200),
  titleEn: z.string().max(200).optional().nullable(),
  descriptionPt: z.string().min(1).max(1000),
  descriptionEn: z.string().max(1000).optional().nullable(),
})
export type TimelineGraveyardIdeaType = z.infer<typeof TimelineGraveyardIdeaSchema>

export const TimelineMilestoneSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  slug: z.string().min(1).max(150),
  kind: TimelineMilestoneKindEnum.default("MILESTONE"),

  dateLabelPt: z.string().min(1).max(100),
  dateLabelEn: z.string().max(100).optional().nullable(),
  titlePt: z.string().min(1).max(200),
  titleEn: z.string().max(200).optional().nullable(),
  impactPt: z.string().min(1).max(2000),
  impactEn: z.string().max(2000).optional().nullable(),
  narrationPt: z.string().min(1).max(4000),
  narrationEn: z.string().max(4000).optional().nullable(),
  problemPt: z.string().min(1).max(4000),
  problemEn: z.string().max(4000).optional().nullable(),
  inflectionPt: z.string().min(1).max(4000),
  inflectionEn: z.string().max(4000).optional().nullable(),
  solutionPt: z.string().min(1).max(4000),
  solutionEn: z.string().max(4000).optional().nullable(),

  tags: z.array(z.string()).default([]),

  beforeImageUrl: z.string().max(500).optional().nullable(),
  beforeImageAlt: z.string().max(200).optional().nullable(),
  afterImageUrl: z.string().max(500).optional().nullable(),
  afterImageAlt: z.string().max(200).optional().nullable(),

  sequence: z.array(TimelineSequenceStepSchema).default([]),
  graveyard: z.array(TimelineGraveyardIdeaSchema).default([]),

  order: z.number().int().default(0),
})

export type TimelineMilestoneType = z.infer<typeof TimelineMilestoneSchema>
