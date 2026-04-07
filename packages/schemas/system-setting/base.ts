import { z } from "zod"

export const SystemSettingSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
  key: z.string().min(1).max(255),
  value: z.string(),
})

export type SystemSettingType = z.infer<typeof SystemSettingSchema>
