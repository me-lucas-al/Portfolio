import { PrismaClient } from "@portfolio/database/prisma/generated/client";
import { ISpeechUsageRepository } from "../speech-usage-repository.interface";

export class PrismaSpeechUsageRepository implements ISpeechUsageRepository {
  constructor(private prisma: PrismaClient) {}

  async record(ipHash: string): Promise<void> {
    await this.prisma.speechUsage.create({ data: { ipHash } });
  }

  async countSince(ipHash: string, since: Date): Promise<number> {
    return this.prisma.speechUsage.count({ where: { ipHash, createdAt: { gte: since } } });
  }

  async countAllSince(since: Date): Promise<number> {
    return this.prisma.speechUsage.count({ where: { createdAt: { gte: since } } });
  }
}
