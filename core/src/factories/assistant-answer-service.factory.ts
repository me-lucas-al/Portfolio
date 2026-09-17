import { db } from "@portfolio/database/src/client";
import { DrizzleAssistantAnswerRepository } from "../repositories/drizzle/drizzle-assistant-answer-repository";
import { GeminiEmbeddingProvider } from "../providers/gemini-embedding-provider";
import { AssistantAnswerService } from "../services/assistant-answer";

export function makeAssistantAnswerService() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const assistantAnswerRepository = new DrizzleAssistantAnswerRepository(db);
  const embeddingProvider = new GeminiEmbeddingProvider(apiKey);
  return new AssistantAnswerService(assistantAnswerRepository, embeddingProvider);
}
