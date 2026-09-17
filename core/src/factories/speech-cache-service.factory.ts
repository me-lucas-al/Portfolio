import { db } from "@portfolio/database/src/client";
import { DrizzleSpeechCacheRepository } from "../repositories/drizzle/drizzle-speech-cache-repository";
import { SpeechCacheService } from "../services/speech-cache";

export function makeSpeechCacheService() {
  const speechCacheRepository = new DrizzleSpeechCacheRepository(db);
  return new SpeechCacheService(speechCacheRepository);
}
