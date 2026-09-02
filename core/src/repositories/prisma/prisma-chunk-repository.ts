import { PrismaClient, Prisma } from "@portfolio/database/prisma/generated/client";
import {
  IChunkRepository,
  UpsertChunkInput,
  ChunkSearchResult,
  ChunkHash,
} from "../chunk-repository.interface";

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

const GET_BY_SOURCE_CHUNK_LIMIT = 60;
const GET_BY_SOURCE_MAX_CHARS = 24_000;

export class PrismaChunkRepository implements IChunkRepository {
  constructor(private prisma: PrismaClient) {}

  async upsertWithEmbedding(input: UpsertChunkInput): Promise<void> {
    const vector = toVectorLiteral(input.embedding);
    await this.prisma.$executeRaw`
      INSERT INTO "chunks"
        ("source", "sourceType", "chunkIndex", "locale", "title", "content", "contentHash", "embedding", "lastSeenAt", "updatedAt")
      VALUES
        (${input.source}, ${input.sourceType}, ${input.chunkIndex}, ${input.locale ?? null}, ${input.title ?? null}, ${input.content}, ${input.contentHash}, ${vector}::vector, now(), now())
      ON CONFLICT ("source", "chunkIndex") DO UPDATE SET
        "sourceType" = EXCLUDED."sourceType",
        "locale" = EXCLUDED."locale",
        "title" = EXCLUDED."title",
        "content" = EXCLUDED."content",
        "contentHash" = EXCLUDED."contentHash",
        "embedding" = EXCLUDED."embedding",
        "lastSeenAt" = now(),
        "updatedAt" = now()
    `;
  }

  async upsertManyWithEmbedding(inputs: UpsertChunkInput[]): Promise<void> {
    if (inputs.length === 0) return;

    await this.prisma.$transaction(async (tx) => {
      for (const input of inputs) {
        const vector = toVectorLiteral(input.embedding);
        await tx.$executeRaw`
          INSERT INTO "chunks"
            ("source", "sourceType", "chunkIndex", "locale", "title", "content", "contentHash", "embedding", "lastSeenAt", "updatedAt")
          VALUES
            (${input.source}, ${input.sourceType}, ${input.chunkIndex}, ${input.locale ?? null}, ${input.title ?? null}, ${input.content}, ${input.contentHash}, ${vector}::vector, now(), now())
          ON CONFLICT ("source", "chunkIndex") DO UPDATE SET
            "sourceType" = EXCLUDED."sourceType",
            "locale" = EXCLUDED."locale",
            "title" = EXCLUDED."title",
            "content" = EXCLUDED."content",
            "contentHash" = EXCLUDED."contentHash",
            "embedding" = EXCLUDED."embedding",
            "lastSeenAt" = now(),
            "updatedAt" = now()
        `;
      }
    });
  }

  async search(embedding: number[], limit: number, locale?: string | null): Promise<ChunkSearchResult[]> {
    const vector = toVectorLiteral(embedding);
    const localeFilter = locale
      ? Prisma.sql`AND ("locale" = ${locale} OR "locale" IS NULL)`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<ChunkSearchResult[]>`
      SELECT
        "id",
        "source",
        "sourceType",
        "chunkIndex",
        "locale",
        "title",
        "content",
        1 - ("embedding" <=> ${vector}::vector) AS similarity
      FROM "chunks"
      WHERE "embedding" IS NOT NULL
      ${localeFilter}
      ORDER BY "embedding" <=> ${vector}::vector
      LIMIT ${limit}
    `;

    return rows;
  }

  async listSources(prefix?: string): Promise<string[]> {
    const rows = prefix
      ? await this.prisma.$queryRaw<{ source: string }[]>`
          SELECT DISTINCT "source" FROM "chunks" WHERE "source" LIKE ${`${prefix}%`} ORDER BY "source"
        `
      : await this.prisma.$queryRaw<{ source: string }[]>`
          SELECT DISTINCT "source" FROM "chunks" ORDER BY "source"
        `;

    return rows.map((row) => row.source);
  }

  async getBySource(source: string): Promise<string> {
    const rows = await this.prisma.$queryRaw<{ content: string }[]>`
      SELECT "content" FROM "chunks" WHERE "source" = ${source} ORDER BY "chunkIndex" ASC LIMIT ${GET_BY_SOURCE_CHUNK_LIMIT}
    `;

    const joined = rows.map((row) => row.content).join("\n\n");
    return joined.length > GET_BY_SOURCE_MAX_CHARS
      ? `${joined.slice(0, GET_BY_SOURCE_MAX_CHARS)}\n\n[conteúdo truncado]`
      : joined;
  }

  async listHashes(namespacePrefix: string): Promise<ChunkHash[]> {
    return this.prisma.$queryRaw<ChunkHash[]>`
      SELECT "source", "chunkIndex", "contentHash"
      FROM "chunks"
      WHERE "source" LIKE ${`${namespacePrefix}%`}
    `;
  }

  async touchLastSeen(source: string, chunkIndex: number): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE "chunks" SET "lastSeenAt" = now() WHERE "source" = ${source} AND "chunkIndex" = ${chunkIndex}
    `;
  }

  async deleteStale(namespacePrefix: string, runStartedAt: Date): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE FROM "chunks" WHERE "source" LIKE ${`${namespacePrefix}%`} AND "lastSeenAt" < ${runStartedAt}
    `;
  }
}
