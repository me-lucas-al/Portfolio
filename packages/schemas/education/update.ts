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
    description: z.string().max(2000).optional().nullable(),
    descriptionEn: z.string().max(2000).optional().nullable(),
    order: z.number().optional()
})

export type UpdateEducationType = z.infer<typeof UpdateEducationSchema>
