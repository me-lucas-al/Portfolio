import { z } from "zod"
import { UserSchema } from "./base";

export const UpdateUserSchema = UserSchema.pick({
    id: true,
    username: true,
    password: true,
    role: true
})

export type UpdateUserType = z.infer<typeof UpdateUserSchema>