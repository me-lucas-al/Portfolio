import { z } from "zod"
import { TimelineMilestoneSchema } from "./base";

export const DeleteTimelineMilestoneSchema = TimelineMilestoneSchema.pick({
    id: true,
})

export type DeleteTimelineMilestoneType = z.infer<typeof DeleteTimelineMilestoneSchema>
