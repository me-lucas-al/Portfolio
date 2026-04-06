import { z } from "zod"
import { EducationSchema } from "./base";

export const UpdateEducationSchema = EducationSchema.pick({
    id: true,
    course: true,
    institution: true,
    startDate: true,
    endDate: true,
    type: true,
}).extend({
    order: z.number().optional()
})

export type UpdateEducationType = z.infer<typeof UpdateEducationSchema>