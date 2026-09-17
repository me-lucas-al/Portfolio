import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, asc } from "drizzle-orm";
import { Project } from "@portfolio/database/prisma/generated/client";
import { IProjectRepository } from "../project-repository.interface";
import { CreateProjectType, UpdateProjectType } from "@portfolio/packages/index";
import { projects } from "@portfolio/database/src/schema";

export class DrizzleProjectRepository implements IProjectRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async create(data: CreateProjectType): Promise<Project> {
    const [result] = await this.db.insert(projects).values({
      ...data,
      updatedAt: new Date(),
    }).returning();
    return result as any;
  }

  async findAll(): Promise<Project[]> {
    const results = await this.db.select().from(projects).orderBy(asc(projects.order));
    return results as any;
  }

  async delete(id: number): Promise<Project> {
    const [result] = await this.db.delete(projects).where(eq(projects.id, id)).returning();
    return result as any;
  }

  async update(data: UpdateProjectType): Promise<Project> {
    const { id, ...projectData } = data;
    const [result] = await this.db.update(projects).set({
      ...projectData,
      updatedAt: new Date(),
    }).where(eq(projects.id, id!)).returning();
    return result as any;
  }
}
