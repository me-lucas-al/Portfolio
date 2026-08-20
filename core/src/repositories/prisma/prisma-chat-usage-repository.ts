import { PrismaClient } from "@portfolio/database/prisma/generated/client";
import { IChatUsageRepository } from "../chat-usage-repository.interface";

export class PrismaChatUsageRepository implements IChatUsageRepository {
  constructor(private prisma: PrismaClient) {}

  async record(ipHash: string): Promise<void> {
    await this.prisma.chatUsage.create({ data: { ipHash } });
  }

  async countSince(ipHash: string, since: Date): Promise<number> {
    return this.prisma.chatUsage.count({ where: { ipHash, createdAt: { gte: since } } });
  }

  async countAllSince(since: Date): Promise<number> {
    return this.prisma.chatUsage.count({ where: { createdAt: { gte: since } } });
  }
}
