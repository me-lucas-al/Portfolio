import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { cosineDistance, sql, eq, and, isNotNull, like, or, isNull, asc, lt } from "drizzle-orm";
import { chunks } from "@portfolio/database/src/schema";
import {
  IChunkRepository,
  UpsertChunkInput,
  ChunkSearchResult,
  ChunkHash,
} from "../chunk-repository.interface";

const GET_BY_SOURCE_CHUNK_LIMIT = 60;
const GET_BY_SOURCE_MAX_CHARS = 24_000;

export class DrizzleChunkRepository implements IChunkRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async upsertWithEmbedding(input: UpsertChunkInput): Promise<void> {
    await this.db
      .insert(chunks)
      .values({
        source: input.source,
        sourceType: input.sourceType,
        chunkIndex: input.chunkIndex,
        locale: input.locale ?? null,
        title: input.title ?? null,
        content: input.content,
        contentHash: input.contentHash,
        embedding: input.embedding,
        lastSeenAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [chunks.source, chunks.chunkIndex],
        set: {
          sourceType: input.sourceType,
          locale: input.locale ?? null,
          title: input.title ?? null,
          content: input.content,
          contentHash: input.contentHash,
          embedding: input.embedding,
          lastSeenAt: new Date(),
          updatedAt: new Date(),
        },
      });
  }

  async upsertManyWithEmbedding(inputs: UpsertChunkInput[]): Promise<void> {
    if (inputs.length === 0) return;

    await this.db.transaction(async (tx) => {
      for (const input of inputs) {
        await tx
          .insert(chunks)
          .values({
            source: input.source,
            sourceType: input.sourceType,
            chunkIndex: input.chunkIndex,
            locale: input.locale ?? null,
            title: input.title ?? null,
            content: input.content,
            contentHash: input.contentHash,
            embedding: input.embedding,
            lastSeenAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [chunks.source, chunks.chunkIndex],
            set: {
              sourceType: input.sourceType,
              locale: input.locale ?? null,
              title: input.title ?? null,
              content: input.content,
              contentHash: input.contentHash,
              embedding: input.embedding,
              lastSeenAt: new Date(),
              updatedAt: new Date(),
            },
          });
      }
    });
  }

  async search(embedding: number[], limit: number, locale?: string | null): Promise<ChunkSearchResult[]> {
    const similarity = sql<number>`1 - (${cosineDistance(chunks.embedding, embedding)})`;

    const rows = await this.db
      .select({
        id: chunks.id,
        source: chunks.source,
        sourceType: chunks.sourceType,
        chunkIndex: chunks.chunkIndex,
        locale: chunks.locale,
        title: chunks.title,
        content: chunks.content,
        similarity: similarity,
      })
      .from(chunks)
      .where(
        and(
          isNotNull(chunks.embedding),
          locale ? or(eq(chunks.locale, locale), isNull(chunks.locale)) : undefined
        )
      )
      .orderBy(sql`${cosineDistance(chunks.embedding, embedding)} ASC`)
      .limit(limit);

    return rows;
  }

  async listSources(prefix?: string): Promise<string[]> {
    const rows = await this.db
      .selectDistinct({ source: chunks.source })
      .from(chunks)
      .where(prefix ? like(chunks.source, `${prefix}%`) : undefined)
      .orderBy(asc(chunks.source));

    return rows.map((r) => r.source);
  }

  async getBySource(source: string): Promise<string> {
    const rows = await this.db
      .select({ content: chunks.content })
      .from(chunks)
      .where(eq(chunks.source, source))
      .orderBy(asc(chunks.chunkIndex))
      .limit(GET_BY_SOURCE_CHUNK_LIMIT);

    const joined = rows.map((row) => row.content).join("\n\n");
    return joined.length > GET_BY_SOURCE_MAX_CHARS
      ? `${joined.slice(0, GET_BY_SOURCE_MAX_CHARS)}\n\n[conteúdo truncado]`
      : joined;
  }

  async listHashes(namespacePrefix: string): Promise<ChunkHash[]> {
    return this.db
      .select({
        source: chunks.source,
        chunkIndex: chunks.chunkIndex,
        contentHash: chunks.contentHash,
      })
      .from(chunks)
      .where(like(chunks.source, `${namespacePrefix}%`));
  }

  async touchLastSeen(source: string, chunkIndex: number): Promise<void> {
    await this.db
      .update(chunks)
      .set({ lastSeenAt: new Date() })
      .where(and(eq(chunks.source, source), eq(chunks.chunkIndex, chunkIndex)));
  }

  async deleteStale(namespacePrefix: string, runStartedAt: Date): Promise<number> {
    const result = await this.db
      .delete(chunks)
      .where(and(like(chunks.source, `${namespacePrefix}%`), lt(chunks.lastSeenAt, runStartedAt)));
    return (result as any).rowCount ?? 0;
  }
}
