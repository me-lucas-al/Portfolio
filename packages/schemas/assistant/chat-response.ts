import { z } from "zod";

// Additive, optional field: when ASSISTANT_VOICE_ENABLED is off (or a client
// predates this field), `speech` is simply absent and the response shape is
// identical to what existing client code already expects.
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
