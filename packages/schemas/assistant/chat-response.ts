import { z } from "zod";

export const ChatSpeechSchema = z.object({
  url: z.string(),
  text: z.string(),
  expiresAt: z.number(),
});

export const ChatResponseSchema = z.object({
  text: z.string(),
  speech: ChatSpeechSchema.optional(),
});

export type ChatSpeechType = z.infer<typeof ChatSpeechSchema>;
export type ChatResponseType = z.infer<typeof ChatResponseSchema>;
