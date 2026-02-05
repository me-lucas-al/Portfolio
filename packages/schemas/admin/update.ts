import { z } from "zod"
import { AdminSchema } from "./base";

export const UpdateAdminSchema = AdminSchema.pick({
    id: true,
    username: true,
}).extend({
    password: z.string().min(1).max(255),
})

export type UpdateAdminType = z.infer<typeof UpdateAdminSchema>