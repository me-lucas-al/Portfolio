import { z } from "zod"

export const EducationSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  course: z.string().min(1).max(255),
  institution: z.string().min(1).max(255),
  period: z.string().min(1).max(100),
  type: z.string().min(1).max(100),
})

export type EducationType = z.infer<typeof EducationSchema>