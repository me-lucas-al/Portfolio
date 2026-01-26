import { z } from "zod"

export const AdminSchema = z.object({
    id: z.coerce.number().int().positive().min(1),
    email: z.email().min(5).max(255),
    username: z.string().min(3).max(255),
})

export type AdminType = z.infer<typeof AdminSchema>