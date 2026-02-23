import { z } from "zod"
import { ExperienceSchema } from "./base";

export const DeleteExperienceSchema = ExperienceSchema.pick({
    id: true,
})

export type DeleteExperienceType = z.infer<typeof DeleteExperienceSchema>