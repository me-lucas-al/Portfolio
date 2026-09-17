import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { cosineDistance, sql, eq, and, isNotNull } from "drizzle-orm";
import { assistantAnswers } from "@portfolio/database/src/schema";
import {
  IAssistantAnswerRepository,
  CreateAssistantAnswerInput,
  AssistantAnswerMatch,
} from "../assistant-answer-repository.interface";

export class DrizzleAssistantAnswerRepository implements IAssistantAnswerRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async findMostSimilar(embedding: number[], locale: string): Promise<AssistantAnswerMatch | null> {
    const similarity = sql<number>`1 - (${cosineDistance(assistantAnswers.embedding, embedding)})`;

    const [row] = await this.db
      .select({
        id: assistantAnswers.id,
        question: assistantAnswers.question,
        answer: assistantAnswers.answer,
        similarity: similarity,
      })
      .from(assistantAnswers)
      .where(
        and(
          isNotNull(assistantAnswers.embedding),
          eq(assistantAnswers.locale, locale)
        )
      )
      .orderBy(sql`${cosineDistance(assistantAnswers.embedding, embedding)} ASC`)
      .limit(1);

    return row ?? null;
  }

  async create(input: CreateAssistantAnswerInput): Promise<void> {
    await this.db.insert(assistantAnswers).values({
      locale: input.locale,
      question: input.question,
      answer: input.answer,
      embedding: input.embedding,
      updatedAt: new Date(),
    });
  }

  async incrementHitCount(id: string): Promise<void> {
    await this.db
      .update(assistantAnswers)
      .set({
        hitCount: sql`${assistantAnswers.hitCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(assistantAnswers.id, id));
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.delete(assistantAnswers);
    return (result as any).rowCount ?? 0;
  }
}
