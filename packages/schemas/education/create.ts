import { z } from "zod"
import { EducationSchema } from "./base";

export const CreateEducationSchema = EducationSchema.omit({
    id: true,
})

export type CreateEducationType = z.infer<typeof CreateEducationSchema>