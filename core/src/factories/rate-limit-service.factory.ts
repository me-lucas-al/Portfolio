import { db } from "@portfolio/database/src/client";
import { DrizzleChatUsageRepository } from "../repositories/drizzle/drizzle-chat-usage-repository";
import { RateLimitService } from "../services/rate-limit";

export function makeRateLimitService() {
  const chatUsageRepository = new DrizzleChatUsageRepository(db);
  return new RateLimitService(chatUsageRepository);
}
