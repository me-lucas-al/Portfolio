import { z } from "zod"
import { ProjectSchema } from "./base";

export const DeleteProjectSchema = ProjectSchema.pick({
    id: true,
})

export type DeleteProjectType = z.infer<typeof DeleteProjectSchema>