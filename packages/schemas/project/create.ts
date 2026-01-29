import { z } from "zod"
import { ProjectSchema } from "./base";

export const CreateProjectSchema = ProjectSchema.omit({
    id: true,
})

export type CreateProjectType = z.infer<typeof CreateProjectSchema>