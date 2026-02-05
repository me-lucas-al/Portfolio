import z from "zod"
import { AdminSchema } from "./base"

export const CreateAdminSchema = AdminSchema.pick({
    username: true, 
    password: true,
})

export type CreateAdminType = z.infer<typeof CreateAdminSchema>