import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, asc } from "drizzle-orm";
import { Experience } from "@portfolio/database/prisma/generated/client";
import { IExperienceRepository } from "../experience-repository.interface";
import { CreateExperienceType, UpdateExperienceType } from "@portfolio/packages/index";
import { experiences } from "@portfolio/database/src/schema";

export class DrizzleExperienceRepository implements IExperienceRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async create(data: CreateExperienceType): Promise<Experience> {
    const [result] = await this.db.insert(experiences).values({
      ...data,
      updatedAt: new Date(),
    }).returning();
    return result as any;
  }

  async findAll(): Promise<Experience[]> {
    const results = await this.db.select().from(experiences).orderBy(asc(experiences.order));
    return results as any;
  }

  async delete(id: number): Promise<Experience> {
    const [result] = await this.db.delete(experiences).where(eq(experiences.id, id)).returning();
    return result as any;
  }

  async update(data: UpdateExperienceType): Promise<Experience> {
    const { id, ...experienceData } = data;
    const [result] = await this.db.update(experiences).set({
      ...experienceData,
      updatedAt: new Date(),
    }).where(eq(experiences.id, id)).returning();
    return result as any;
  }
}
