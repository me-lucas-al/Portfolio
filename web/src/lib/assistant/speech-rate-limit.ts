import { hashIp } from "./rate-limit";
import { makeSpeechRateLimitService } from "@portfolio/core/src/factories/_index";
import type { RateLimitResult } from "@portfolio/core/src/services/rate-limit";

export async function checkSpeechRateLimit(ip: string): Promise<RateLimitResult> {
  const ipHash = hashIp(ip);
  return makeSpeechRateLimitService().checkAndRecord(ipHash);
}

export async function isSpeechDailyBudgetExceeded(): Promise<boolean> {
  const dailyBudget = Number(process.env.SPEECH_DAILY_BUDGET ?? "0");
  return makeSpeechRateLimitService().isDailyBudgetExceeded(dailyBudget);
}
