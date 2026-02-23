import { z } from "zod"
import { ExperienceSchema } from "./base";

export const CreateExperienceSchema = ExperienceSchema.omit({
    id: true,
})

export type CreateExperienceType = z.infer<typeof CreateExperienceSchema>