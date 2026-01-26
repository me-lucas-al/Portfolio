import { z } from "zod"

export const ProjectSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(500).optional(),
  githubUrl: z.string().min(1).max(255),
  deployUrl: z.string().min(1).max(500).optional(),
})

export type ProjectType = z.infer<typeof ProjectSchema>