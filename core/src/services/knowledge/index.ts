import { IChunkRepository, ChunkSearchResult, ChunkHash } from "../../repositories/chunk-repository.interface";
import { IEmbeddingProvider } from "../../@types/embedding-provider";

export interface RawChunkInput {
  source: string;
  sourceType: string;
  chunkIndex: number;
  locale?: string | null;
  title?: string | null;
  content: string;
  contentHash: string;
}

export class KnowledgeService {
  constructor(
    private chunkRepository: IChunkRepository,
    private embeddingProvider: IEmbeddingProvider,
  ) {}

  async search(query: string, limit = 8, locale?: string | null): Promise<ChunkSearchResult[]> {
    const embedding = await this.embeddingProvider.embedQuery(query);
    return this.chunkRepository.search(embedding, limit, locale ?? null);
  }

  async listIndexedSources(prefix?: string): Promise<string[]> {
    return this.chunkRepository.listSources(prefix);
  }

  async getSource(source: string): Promise<string> {
    return this.chunkRepository.getBySource(source);
  }

  async listHashes(namespacePrefix: string): Promise<ChunkHash[]> {
    return this.chunkRepository.listHashes(namespacePrefix);
  }

  async touchLastSeen(source: string, chunkIndex: number): Promise<void> {
    return this.chunkRepository.touchLastSeen(source, chunkIndex);
  }

  async deleteStale(namespacePrefix: string, runStartedAt: Date): Promise<number> {
    return this.chunkRepository.deleteStale(namespacePrefix, runStartedAt);
  }

  async upsertChunks(inputs: RawChunkInput[]): Promise<void> {
    if (inputs.length === 0) return;

    const embeddings = await this.embeddingProvider.embedDocuments(inputs.map((input) => input.content));

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const embedding = embeddings[i];
      if (!input || !embedding) {
        throw new Error(`Missing embedding for chunk at index ${i}`);
      }
      await this.chunkRepository.upsertWithEmbedding({ ...input, embedding });
    }
  }
}
