import { z } from "zod"
import { EducationCategoryEnum, EducationSchema } from "./base";

export const UpdateEducationSchema = EducationSchema.pick({
    id: true,
    course: true,
    courseEn: true,
    institution: true,
    startDate: true,
    endDate: true,
    type: true,
}).extend({
    category: EducationCategoryEnum.optional(),
    certificateUrl: z.string().max(500).optional().nullable(),
    order: z.number().optional()
})

export type UpdateEducationType = z.infer<typeof UpdateEducationSchema>
