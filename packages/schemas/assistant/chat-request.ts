import { z } from "zod";

export const ChatHistoryMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().min(1).max(600),
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
