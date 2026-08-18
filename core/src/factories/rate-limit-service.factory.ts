import prisma from "@portfolio/database";
import { PrismaChatUsageRepository } from "../repositories/prisma/prisma-chat-usage-repository";
import { RateLimitService } from "../services/rate-limit";

export function makeRateLimitService() {
  const chatUsageRepository = new PrismaChatUsageRepository(prisma);
  return new RateLimitService(chatUsageRepository);
}
