import { PrismaClient } from "@portfolio/database/prisma/generated/client";
import {
  IAssistantAnswerRepository,
  CreateAssistantAnswerInput,
  AssistantAnswerMatch,
} from "../assistant-answer-repository.interface";

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export class PrismaAssistantAnswerRepository implements IAssistantAnswerRepository {
  constructor(private prisma: PrismaClient) {}

  async findMostSimilar(embedding: number[], locale: string): Promise<AssistantAnswerMatch | null> {
    const vector = toVectorLiteral(embedding);
    const rows = await this.prisma.$queryRaw<AssistantAnswerMatch[]>`
      SELECT
        "id",
        "question",
        "answer",
        1 - ("embedding" <=> ${vector}::vector) AS similarity
      FROM "assistant_answers"
      WHERE "embedding" IS NOT NULL AND "locale" = ${locale}
      ORDER BY "embedding" <=> ${vector}::vector
      LIMIT 1
    `;

    return rows[0] ?? null;
  }

  async create(input: CreateAssistantAnswerInput): Promise<void> {
    const vector = toVectorLiteral(input.embedding);
    await this.prisma.$executeRaw`
      INSERT INTO "assistant_answers" ("locale", "question", "answer", "embedding", "updatedAt")
      VALUES (${input.locale}, ${input.question}, ${input.answer}, ${vector}::vector, now())
    `;
  }

  async incrementHitCount(id: string): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE "assistant_answers" SET "hitCount" = "hitCount" + 1, "updatedAt" = now() WHERE "id" = ${id}::uuid
    `;
  }

  async deleteAll(): Promise<number> {
    return this.prisma.$executeRaw`DELETE FROM "assistant_answers"`;
  }
}
