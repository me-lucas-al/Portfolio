import { z } from "zod"
import { ProjectSchema } from "./base";

export const UpdateProjectSchema = ProjectSchema.pick({
    id: true,
    title: true,
    description: true,
    githubUrl: true,
    technologies: true,
    deployUrl: true,
    imagesUrl: true,
})

export type UpdateProjectType = z.infer<typeof UpdateProjectSchema>