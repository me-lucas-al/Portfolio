import { z } from "zod"
import { ProjectSchema } from "./base";

export const CreateProjectSchema = ProjectSchema.pick({
    title: true,
    deployUrl: true,
    githubUrl: true,
    description: true
})

export type CreateProjectType = z.infer<typeof ProjectSchema>