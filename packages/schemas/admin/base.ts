import { z } from "zod"

export const AdminSchema = z.object({
    id: z.coerce.number().int().positive().min(1),
    username: z.string().min(3).max(255),
})

export type AdminType = z.infer<typeof AdminSchema>