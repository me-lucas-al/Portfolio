import { IAssistantAnswerRepository } from "../../repositories/assistant-answer-repository.interface";
import { IEmbeddingProvider } from "../../@types/embedding-provider";

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

  async clearCache(): Promise<number> {
    return this.assistantAnswerRepository.deleteAll();
  }
}
