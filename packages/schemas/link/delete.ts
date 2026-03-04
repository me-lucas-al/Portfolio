import { z } from "zod";

export const DeleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

export type DeleteLinkType = z.infer<typeof DeleteLinkSchema>;
