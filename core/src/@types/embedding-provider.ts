export interface IEmbeddingProvider {
  embedDocuments(texts: string[]): Promise<number[][]>;
  embedQuery(text: string, abortSignal?: AbortSignal): Promise<number[]>;
}
