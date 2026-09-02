import { z } from "zod"

export const ProjectSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  title: z.string().min(1).max(255),
  titleEn: z.string().min(1).max(255).optional().nullable(),
  description: z.string().min(1).max(500).nullable(),
  descriptionEn: z.string().min(1).max(500).optional().nullable(),
  technologies: z.array(z.string().min(1).max(100)),
  githubUrl: z.string().min(1).max(255),
  deployUrl: z.string().min(1).max(500).nullable(),
  imagesUrl: z.array(z.string().min(1).max(500)),
  order: z.number().int().default(0),
})

export type ProjectType = z.infer<typeof ProjectSchema>
