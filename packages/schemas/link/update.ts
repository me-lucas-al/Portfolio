import { z } from "zod";
import { DefaultLinkSchema } from "./base";

export const UpdateLinkSchema = DefaultLinkSchema.extend({
  id: z.number().int().positive(),
  order: z.number().int().optional(),
});

export type UpdateLinkType = z.infer<typeof UpdateLinkSchema>;
