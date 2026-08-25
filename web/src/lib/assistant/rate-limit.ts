import { createHmac } from "node:crypto";
import { makeRateLimitService } from "@portfolio/core/src/factories/_index";
import type { RateLimitResult } from "@portfolio/core/src/services/rate-limit";

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) {
    throw new Error("IP_HASH_SALT is not set");
  }
  return createHmac("sha256", salt).update(ip).digest("hex");
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const ipHash = hashIp(ip);
  return makeRateLimitService().checkAndRecord(ipHash, "chat");
}

export async function isDailyBudgetExceeded(): Promise<boolean> {
  const dailyBudget = Number(process.env.ASSISTANT_DAILY_BUDGET ?? "0");
  return makeRateLimitService().isDailyBudgetExceeded(dailyBudget, "chat");
}

// Separate budget from chat generations: one chat answer can now cost one
// chat-generation call AND one tts-synthesis call, so both are tracked (and
// capped) independently in the same chat_usage table via `kind`.
export async function checkTtsRateLimit(ip: string): Promise<RateLimitResult> {
  const ipHash = hashIp(ip);
  return makeRateLimitService().checkAndRecord(ipHash, "tts");
}

export async function isTtsDailyBudgetExceeded(): Promise<boolean> {
  const dailyBudget = Number(process.env.ASSISTANT_TTS_DAILY_BUDGET ?? "0");
  return makeRateLimitService().isDailyBudgetExceeded(dailyBudget, "tts");
}
