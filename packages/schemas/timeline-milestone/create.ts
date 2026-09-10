import { z } from "zod"
import { TimelineMilestoneSchema } from "./base";

export const CreateTimelineMilestoneSchema = TimelineMilestoneSchema.omit({
    id: true,
})

export type CreateTimelineMilestoneType = z.infer<typeof CreateTimelineMilestoneSchema>
