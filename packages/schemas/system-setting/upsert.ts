import { z } from "zod"

export const UpsertSystemSettingSchema = z.object({
  key: z.string().min(1).max(255),
  value: z.string(),
})

export type UpsertSystemSettingType = z.infer<typeof UpsertSystemSettingSchema>
