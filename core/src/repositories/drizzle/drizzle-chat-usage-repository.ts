import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, and, gte, count } from "drizzle-orm";
import { ChatUsageKind, IChatUsageRepository } from "../chat-usage-repository.interface";
import { chatUsage } from "@portfolio/database/src/schema";

export class DrizzleChatUsageRepository implements IChatUsageRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async record(ipHash: string, kind: ChatUsageKind): Promise<void> {
    await this.db.insert(chatUsage).values({
      ipHash,
      kind,
    });
  }

  async countSince(ipHash: string, since: Date, kind: ChatUsageKind): Promise<number> {
    const [result] = await this.db.select({ value: count() })
      .from(chatUsage)
      .where(
        and(
          eq(chatUsage.ipHash, ipHash),
          eq(chatUsage.kind, kind),
          gte(chatUsage.createdAt, since)
        )
      );
    return result?.value ?? 0;
  }

  async countAllSince(since: Date, kind: ChatUsageKind): Promise<number> {
    const [result] = await this.db.select({ value: count() })
      .from(chatUsage)
      .where(
        and(
          eq(chatUsage.kind, kind),
          gte(chatUsage.createdAt, since)
        )
      );
    return result?.value ?? 0;
  }
}
