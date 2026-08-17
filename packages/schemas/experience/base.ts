import { z } from 'zod'

export const ExperienceSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  role: z.string().min(1).max(255),
  roleEn: z.string().min(1).max(255).optional().nullable(),
  company: z.string().min(1).max(255),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  description: z.string().min(1).max(500),
  descriptionEn: z.string().min(1).max(500).optional().nullable(),
  techs: z.array(z.string().min(1).max(100)),
  order: z.number().int().default(0),
})

export type ExperienceType = z.infer<typeof ExperienceSchema>