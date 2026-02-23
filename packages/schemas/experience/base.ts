import { z } from 'zod'

export const ExperienceSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  role: z.string().min(1).max(255),
  company: z.string().min(1).max(255),
  period: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  techs: z.array(z.string().min(1).max(100)),
})

export type ExperienceType = z.infer<typeof ExperienceSchema>