import prisma from "@portfolio/database";
import { PrismaAssistantAnswerRepository } from "../repositories/prisma/prisma-assistant-answer-repository";
import { GeminiEmbeddingProvider } from "../providers/gemini-embedding-provider";
import { AssistantAnswerService } from "../services/assistant-answer";

export function makeAssistantAnswerService() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const assistantAnswerRepository = new PrismaAssistantAnswerRepository(prisma);
  const embeddingProvider = new GeminiEmbeddingProvider(apiKey);
  return new AssistantAnswerService(assistantAnswerRepository, embeddingProvider);
}
