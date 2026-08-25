import { PrismaClient } from "@portfolio/database/prisma/generated/client";
import { CreateSpeechCacheInput, ISpeechCacheRepository, SpeechCacheEntry } from "../speech-cache-repository.interface";

export class PrismaSpeechCacheRepository implements ISpeechCacheRepository {
  constructor(private prisma: PrismaClient) {}

  async findByHash(textHash: string): Promise<SpeechCacheEntry | null> {
    return this.prisma.assistantSpeech.findUnique({ where: { textHash } });
  }

  // Upsert rather than a plain insert: two requests can race a cache miss for
  // the same text (a live visitor plus /api/chat's own prewarm, say), each
  // synthesizing and uploading independently. `textHash` is unique, so a bare
  // create would throw on the loser; upserting keeps exactly one row per hash
  // without surfacing that race as an error.
  async create(input: CreateSpeechCacheInput): Promise<void> {
    await this.prisma.assistantSpeech.upsert({
      where: { textHash: input.textHash },
      update: {},
      create: input,
    });
  }
}
