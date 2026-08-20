import prisma from "@portfolio/database";
import { PrismaChunkRepository } from "../repositories/prisma/prisma-chunk-repository";
import { GeminiEmbeddingProvider } from "../providers/gemini-embedding-provider";
import { GeminiRequestBudget } from "../providers/gemini-request-options";
import { KnowledgeService } from "../services/knowledge";

export function makeKnowledgeService(embeddingBudget?: GeminiRequestBudget) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const chunkRepository = new PrismaChunkRepository(prisma);
  const embeddingProvider = embeddingBudget
    ? new GeminiEmbeddingProvider(apiKey, embeddingBudget)
    : new GeminiEmbeddingProvider(apiKey);
  return new KnowledgeService(chunkRepository, embeddingProvider);
}
