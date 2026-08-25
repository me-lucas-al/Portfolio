import { CreateSpeechCacheInput, ISpeechCacheRepository, SpeechCacheEntry } from "../../repositories/speech-cache-repository.interface";

// Content-addressed cache for synthesized speech audio: unlike
// AssistantAnswerService's semantic (embedding-similarity) lookup, this is a
// plain exact-hash lookup - the hash already encodes text+voice+model, so any
// change to any of the three is a guaranteed miss, never a stale hit.
export class SpeechCacheService {
  constructor(private speechCacheRepository: ISpeechCacheRepository) {}

  async findByHash(textHash: string): Promise<SpeechCacheEntry | null> {
    return this.speechCacheRepository.findByHash(textHash);
  }

  async save(input: CreateSpeechCacheInput): Promise<void> {
    await this.speechCacheRepository.create(input);
  }
}
