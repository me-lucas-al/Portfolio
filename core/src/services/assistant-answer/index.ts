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

  async findCachedAnswer(question: string, locale: string): Promise<string | null> {
    const embedding = await this.embeddingProvider.embedQuery(question);
    const match = await this.assistantAnswerRepository.findMostSimilar(embedding, locale);
    if (!match || match.similarity < SIMILARITY_THRESHOLD) return null;

    await this.assistantAnswerRepository.incrementHitCount(match.id);
    return match.answer;
  }

  async saveAnswer(question: string, answer: string, locale: string): Promise<void> {
    const embedding = await this.embeddingProvider.embedQuery(question);
    await this.assistantAnswerRepository.create({ locale, question, answer, embedding });
  }
}
