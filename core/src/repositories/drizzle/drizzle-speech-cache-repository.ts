import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { CreateSpeechCacheInput, ISpeechCacheRepository, SpeechCacheEntry } from "../speech-cache-repository.interface";
import { assistantSpeech } from "@portfolio/database/src/schema";

export class DrizzleSpeechCacheRepository implements ISpeechCacheRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async findByHash(textHash: string): Promise<SpeechCacheEntry | null> {
    const [result] = await this.db.select().from(assistantSpeech).where(eq(assistantSpeech.textHash, textHash));
    return (result as SpeechCacheEntry) || null;
  }

  async create(input: CreateSpeechCacheInput): Promise<void> {
    await this.db.insert(assistantSpeech).values({
      ...input,
    }).onConflictDoUpdate({
      target: assistantSpeech.textHash,
      set: {
        audioUrl: input.audioUrl,
        voice: input.voice,
        model: input.model,
        byteLength: input.byteLength,
      }
    });
  }
}
