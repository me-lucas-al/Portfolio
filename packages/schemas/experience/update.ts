import { z } from "zod"
import { ExperienceSchema } from "./base";

export const UpdateExperienceSchema = ExperienceSchema.pick({
    id: true,
    role: true,
    roleEn: true,
    description: true,
    descriptionEn: true,
    company: true,
    startDate: true,
    endDate: true,
    techs: true,
}).extend({
    order: z.number().optional()
})

export type UpdateExperienceType = z.infer<typeof UpdateExperienceSchema>