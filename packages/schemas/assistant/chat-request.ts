import { z } from "zod";

// The model's own turns are stored back into history and can run up to
// MAX_OUTPUT_TOKENS of generated text (~4 chars/token in pt/en), well beyond
// the 600-char cap that applies to the user's own input message.
const MAX_HISTORY_CONTENT_CHARS = 6000;

export const ChatHistoryMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().min(1).max(MAX_HISTORY_CONTENT_CHARS),
});

export const ChatRequestSchema = z.object({
  message: z
    .string()
    .min(2, { message: "A mensagem é muito curta" })
    .max(600, { message: "A mensagem é muito longa" }),
  history: z.array(ChatHistoryMessageSchema).max(6, { message: "Histórico muito longo" }).default([]),
  locale: z.enum(["pt", "en"]),
});

export type ChatHistoryMessageType = z.infer<typeof ChatHistoryMessageSchema>;
export type ChatRequestType = z.infer<typeof ChatRequestSchema>;
