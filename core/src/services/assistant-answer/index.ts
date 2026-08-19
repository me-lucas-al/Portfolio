import { IAssistantAnswerRepository } from "../../repositories/assistant-answer-repository.interface";
import { IEmbeddingProvider } from "../../@types/embedding-provider";

// Above this cosine similarity, a new question is treated as a rephrasing of
// one already answered, so the cached answer is reused instead of calling the model again.
const SIMILARITY_THRESHOLD = 0.93;

export class AssistantAnswerService {
  constructor(
    private assistantAnswerRepository: IAssistantAnswerRepository,
    private embeddingProvider: IEmbeddingProvider,
  ) {}

  async findCachedAnswer(
    question: string,
    locale: string,
    abortSignal?: AbortSignal,
  ): Promise<{ answer: string | null; embedding: number[] }> {
    const embedding = await this.embeddingProvider.embedQuery(question, abortSignal);
    const match = await this.assistantAnswerRepository.findMostSimilar(embedding, locale);
    if (!match || match.similarity < SIMILARITY_THRESHOLD) return { answer: null, embedding };

    await this.assistantAnswerRepository.incrementHitCount(match.id);
    return { answer: match.answer, embedding };
  }

  async saveAnswer(question: string, answer: string, locale: string, embedding?: number[]): Promise<void> {
    const questionEmbedding = embedding ?? (await this.embeddingProvider.embedQuery(question));
    await this.assistantAnswerRepository.create({ locale, question, answer, embedding: questionEmbedding });
  }

  // Called after an ingest run changes the index: cached answers recorded
  // before new content was indexed may be stale "I don't know that" answers
  // that would otherwise be served forever (no TTL on this cache).
  async clearCache(): Promise<number> {
    return this.assistantAnswerRepository.deleteAll();
  }
}
