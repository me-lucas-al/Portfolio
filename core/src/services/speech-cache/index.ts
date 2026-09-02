import { CreateSpeechCacheInput, ISpeechCacheRepository, SpeechCacheEntry } from "../../repositories/speech-cache-repository.interface";

export class SpeechCacheService {
  constructor(private speechCacheRepository: ISpeechCacheRepository) {}

  async findByHash(textHash: string): Promise<SpeechCacheEntry | null> {
    return this.speechCacheRepository.findByHash(textHash);
  }

  async save(input: CreateSpeechCacheInput): Promise<void> {
    await this.speechCacheRepository.create(input);
  }
}
