import { z } from "zod"
import { TimelineMilestoneSchema } from "./base";

export const UpdateTimelineMilestoneSchema = TimelineMilestoneSchema.partial().extend({
    id: z.coerce.number().int().positive().min(1),
})

export type UpdateTimelineMilestoneType = z.infer<typeof UpdateTimelineMilestoneSchema>
