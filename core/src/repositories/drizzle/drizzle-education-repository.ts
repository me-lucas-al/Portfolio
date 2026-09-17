import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, asc } from "drizzle-orm";
import { Education } from "@portfolio/database/prisma/generated/client";
import { IEducationRepository } from "../education-repository.interface";
import { CreateEducationType, UpdateEducationType } from "@portfolio/packages/index";
import { educations } from "@portfolio/database/src/schema";

export class DrizzleEducationRepository implements IEducationRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async create(data: CreateEducationType): Promise<Education> {
    const [result] = await this.db.insert(educations).values({
      ...data,
      updatedAt: new Date(),
    } as any).returning(); // casting as any to avoid enum type strictness issues temporarily
    return result as any;
  }

  async findAll(): Promise<Education[]> {
    const results = await this.db.select().from(educations).orderBy(asc(educations.order));
    return results as any;
  }

  async delete(id: number): Promise<Education> {
    const [result] = await this.db.delete(educations).where(eq(educations.id, id)).returning();
    return result as any;
  }

  async update(data: UpdateEducationType): Promise<Education> {
    const { id, ...educationData } = data;
    const [result] = await this.db.update(educations).set({
      ...educationData,
      updatedAt: new Date(),
    } as any).where(eq(educations.id, id)).returning();
    return result as any;
  }
}
