import { PrismaClient } from "@portfolio/database/prisma/generated/client";
import { CreateSpeechCacheInput, ISpeechCacheRepository, SpeechCacheEntry } from "../speech-cache-repository.interface";

export class PrismaSpeechCacheRepository implements ISpeechCacheRepository {
  constructor(private prisma: PrismaClient) {}

  async findByHash(textHash: string): Promise<SpeechCacheEntry | null> {
    return this.prisma.assistantSpeech.findUnique({ where: { textHash } });
  }

  async create(input: CreateSpeechCacheInput): Promise<void> {
    await this.prisma.assistantSpeech.upsert({
      where: { textHash: input.textHash },
      update: {},
      create: input,
    });
  }
}
