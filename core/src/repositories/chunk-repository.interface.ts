export interface UpsertChunkInput {
  source: string;
  sourceType: string;
  chunkIndex: number;
  locale?: string | null;
  title?: string | null;
  content: string;
  contentHash: string;
  embedding: number[];
}

export interface ChunkSearchResult {
  id: string;
  source: string;
  sourceType: string;
  chunkIndex: number;
  locale: string | null;
  title: string | null;
  content: string;
  similarity: number;
}

export interface ChunkHash {
  source: string;
  chunkIndex: number;
  contentHash: string;
}

export interface IChunkRepository {
  upsertWithEmbedding(input: UpsertChunkInput): Promise<void>;
  upsertManyWithEmbedding(inputs: UpsertChunkInput[]): Promise<void>;
  search(embedding: number[], limit: number, locale?: string | null): Promise<ChunkSearchResult[]>;
  listSources(prefix?: string): Promise<string[]>;
  getBySource(source: string): Promise<string>;
  listHashes(namespacePrefix: string): Promise<ChunkHash[]>;
  touchLastSeen(source: string, chunkIndex: number): Promise<void>;
  deleteStale(namespacePrefix: string, runStartedAt: Date): Promise<number>;
}
