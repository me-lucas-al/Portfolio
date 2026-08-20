import { IChatUsageRepository } from "../../repositories/chat-usage-repository.interface";

const PER_MINUTE_LIMIT = 5;
const PER_DAY_LIMIT = 30;

export interface RateLimitResult {
  allowed: boolean;
  reason?: "minute" | "day";
}

export class RateLimitService {
  constructor(private chatUsageRepository: IChatUsageRepository) {}

  async checkAndRecord(ipHash: string): Promise<RateLimitResult> {
    const now = Date.now();
    const oneMinuteAgo = new Date(now - 60_000);
    const oneDayAgo = new Date(now - 24 * 60 * 60_000);

    const [perMinute, perDay] = await Promise.all([
      this.chatUsageRepository.countSince(ipHash, oneMinuteAgo),
      this.chatUsageRepository.countSince(ipHash, oneDayAgo),
    ]);

    if (perMinute >= PER_MINUTE_LIMIT) return { allowed: false, reason: "minute" };
    if (perDay >= PER_DAY_LIMIT) return { allowed: false, reason: "day" };

    await this.chatUsageRepository.record(ipHash);
    return { allowed: true };
  }

  async isDailyBudgetExceeded(dailyBudget: number): Promise<boolean> {
    if (!Number.isFinite(dailyBudget) || dailyBudget <= 0) return false;

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60_000);
    const count = await this.chatUsageRepository.countAllSince(oneDayAgo);
    return count >= dailyBudget;
  }
}
