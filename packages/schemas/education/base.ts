import { z } from "zod"

export const EducationCategoryEnum = z.enum(["ACADEMIC", "COURSE"])
export type EducationCategoryType = z.infer<typeof EducationCategoryEnum>

export const EducationSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  course: z.string().min(1).max(255),
  courseEn: z.string().min(1).max(255).optional().nullable(),
  institution: z.string().min(1).max(255),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  type: z.string().min(1).max(100),
  category: EducationCategoryEnum.default("ACADEMIC"),
  certificateUrl: z.string().max(500).optional().nullable(),
  order: z.number().int().default(0),
})

export type EducationType = z.infer<typeof EducationSchema>
