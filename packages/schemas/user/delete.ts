import { z } from "zod"
import { UserSchema } from "./base";

export const DeleteUserSchema = UserSchema.pick({
    id: true,
})

export type DeleteUserType = z.infer<typeof DeleteUserSchema>