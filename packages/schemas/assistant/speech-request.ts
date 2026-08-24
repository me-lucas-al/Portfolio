import { z } from "zod";

export const SpeechRequestSchema = z.object({
  text: z
    .string()
    .min(1, { message: "O texto não pode ser vazio" })
    .max(1000, { message: "O texto é muito longo para uma única sentença" }),
  locale: z.enum(["pt", "en"]).default("pt"),
  styleTags: z.array(z.string()).optional(),
});

export type SpeechRequestType = z.infer<typeof SpeechRequestSchema>;
