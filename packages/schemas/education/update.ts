import { z } from "zod"
import { EducationSchema } from "./base";

export const UpdateEducationSchema = EducationSchema.pick({
    id: true,
    course: true,
    institution: true,
    startDate: true,
    endDate: true,
    type: true,
})

export type UpdateEducationType = z.infer<typeof UpdateEducationSchema>