import { z } from "zod"
import { AdminSchema } from "./base";

export const UpdateAdminSchema = AdminSchema.pick({
    id: true,
    username: true,
    password: true,
})

export type UpdateAdminType = z.infer<typeof UpdateAdminSchema>