import prisma from "@portfolio/database";
import { PrismaSpeechCacheRepository } from "../repositories/prisma/prisma-speech-cache-repository";
import { SpeechCacheService } from "../services/speech-cache";

export function makeSpeechCacheService() {
  const speechCacheRepository = new PrismaSpeechCacheRepository(prisma);
  return new SpeechCacheService(speechCacheRepository);
}
