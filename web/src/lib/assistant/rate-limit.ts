import { createHash } from "node:crypto";
import { makeRateLimitService } from "@portfolio/core/src/factories/_index";
import type { RateLimitResult } from "@portfolio/core/src/services/rate-limit";

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "";
  return createHash("sha256").update(`${ip}${salt}`).digest("hex");
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const ipHash = hashIp(ip);
  return makeRateLimitService().checkAndRecord(ipHash);
}

export async function isDailyBudgetExceeded(): Promise<boolean> {
  const dailyBudget = Number(process.env.ASSISTANT_DAILY_BUDGET ?? "0");
  return makeRateLimitService().isDailyBudgetExceeded(dailyBudget);
}
