import { z } from "zod"
import { ExperienceSchema } from "./base";

export const UpdateExperienceSchema = ExperienceSchema.pick({
    id: true,
    role: true,
    description: true,
    company: true,
    period: true,
    techs: true,
})

export type UpdateExperienceType = z.infer<typeof UpdateExperienceSchema>