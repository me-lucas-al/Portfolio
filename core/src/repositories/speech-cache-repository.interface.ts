export interface CreateSpeechCacheInput {
  textHash: string;
  audioUrl: string;
  voice: string;
  model: string;
  byteLength: number;
}

export interface SpeechCacheEntry {
  id: string;
  textHash: string;
  audioUrl: string;
  voice: string;
  model: string;
  byteLength: number;
}

export interface ISpeechCacheRepository {
  findByHash(textHash: string): Promise<SpeechCacheEntry | null>;
  create(input: CreateSpeechCacheInput): Promise<void>;
}
