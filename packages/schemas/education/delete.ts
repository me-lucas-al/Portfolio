import { z } from "zod"
import { EducationSchema } from "./base";

export const DeleteEducationSchema = EducationSchema.pick({
    id: true,
})

export type DeleteEducationType = z.infer<typeof DeleteEducationSchema>