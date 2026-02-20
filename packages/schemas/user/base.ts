import { z } from "zod"

enum Roles {
    ADMIN = "ADMIN",
    USER = "USER"
}

export const UserSchema = z.object({
    id: z.coerce.number().int().positive().min(1),
    username: z.string().min(3).max(255),
    password: z.string().min(1).max(255),
    role: z.enum(Roles),
})

export type UserType = z.infer<typeof UserSchema>