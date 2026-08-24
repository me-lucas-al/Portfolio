import prisma from "@portfolio/database";
import { PrismaChatUsageRepository } from "../repositories/prisma/prisma-chat-usage-repository";
import { PrismaSpeechUsageRepository } from "../repositories/prisma/prisma-speech-usage-repository";
import { RateLimitService } from "../services/rate-limit";

export function makeRateLimitService() {
  const chatUsageRepository = new PrismaChatUsageRepository(prisma);
  return new RateLimitService(chatUsageRepository);
}

export function makeSpeechRateLimitService() {
  const speechUsageRepository = new PrismaSpeechUsageRepository(prisma);
  return new RateLimitService(speechUsageRepository);
}
