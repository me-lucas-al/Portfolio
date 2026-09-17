import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, asc } from "drizzle-orm";
import { Link } from "@portfolio/database/prisma/generated/client";
import { ILinkRepository } from "../link-repository.interface";
import { CreateLinkType, UpdateLinkType } from "@portfolio/packages/index";
import { links } from "@portfolio/database/src/schema";

export class DrizzleLinkRepository implements ILinkRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async create(data: CreateLinkType): Promise<Link> {
    const [result] = await this.db.insert(links).values({
      ...data,
      updatedAt: new Date(),
    }).returning();
    return result as any;
  }

  async findAll(): Promise<Link[]> {
    const results = await this.db.select().from(links).orderBy(asc(links.order));
    return results as any;
  }

  async delete(id: number): Promise<Link> {
    const [result] = await this.db.delete(links).where(eq(links.id, id)).returning();
    return result as any;
  }

  async update(data: UpdateLinkType): Promise<Link> {
    const { id, ...linkData } = data;
    const [result] = await this.db.update(links).set({
      ...linkData,
      updatedAt: new Date(),
    }).where(eq(links.id, id)).returning();
    return result as any;
  }
}
