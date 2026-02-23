import z from "zod"
import { UserSchema } from "./base"

export const CreateUserSchema = UserSchema.pick({
    username: true, 
    password: true,
})

export type CreateUserType = z.infer<typeof CreateUserSchema>