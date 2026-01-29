import { z } from "zod"
import { AdminSchema } from "./base";

export const DeleteAdminSchema = AdminSchema.pick({
    id: true,
})

export type DeleteAdminType = z.infer<typeof DeleteAdminSchema>