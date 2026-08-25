import { PrismaClient } from "@portfolio/database/prisma/generated/client";
import { ChatUsageKind, IChatUsageRepository } from "../chat-usage-repository.interface";

export class PrismaChatUsageRepository implements IChatUsageRepository {
  constructor(private prisma: PrismaClient) {}

  async record(ipHash: string, kind: ChatUsageKind): Promise<void> {
    await this.prisma.chatUsage.create({ data: { ipHash, kind } });
  }

  async countSince(ipHash: string, since: Date, kind: ChatUsageKind): Promise<number> {
    return this.prisma.chatUsage.count({ where: { ipHash, kind, createdAt: { gte: since } } });
  }

  async countAllSince(since: Date, kind: ChatUsageKind): Promise<number> {
    return this.prisma.chatUsage.count({ where: { kind, createdAt: { gte: since } } });
  }
}
