import z from "zod"
import { AdminSchema } from "./base"

export const CreateAdminSchema = AdminSchema.pick({
    email: true,
    username: true, 
}).extend({
    password: z.string().min(1).max(255),
})