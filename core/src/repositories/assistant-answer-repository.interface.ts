export interface CreateAssistantAnswerInput {
  locale: string;
  question: string;
  answer: string;
  embedding: number[];
}

export interface AssistantAnswerMatch {
  id: string;
  question: string;
  answer: string;
  similarity: number;
}

export interface IAssistantAnswerRepository {
  findMostSimilar(embedding: number[], locale: string): Promise<AssistantAnswerMatch | null>;
  create(input: CreateAssistantAnswerInput): Promise<void>;
  incrementHitCount(id: string): Promise<void>;
}
