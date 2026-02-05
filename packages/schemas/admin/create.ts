import z from "zod"
import { AdminSchema } from "./base"

export const CreateAdminSchema = AdminSchema.pick({
    username: true, 
}).extend({
    password: z.string().min(1).max(255),
})

export type CreateAdminType = z.infer<typeof CreateAdminSchema>