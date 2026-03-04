import { z } from "zod";
import { DefaultLinkSchema } from "./base";

export const CreateLinkSchema = DefaultLinkSchema;

export type CreateLinkType = z.infer<typeof CreateLinkSchema>;
