import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, asc } from "drizzle-orm";
import { TimelineMilestone } from "@portfolio/database/prisma/generated/client";
import { ITimelineMilestoneRepository } from "../timeline-milestone-repository.interface";
import { CreateTimelineMilestoneType, UpdateTimelineMilestoneType } from "@portfolio/packages/index";
import { timelineMilestones } from "@portfolio/database/src/schema";

export class DrizzleTimelineMilestoneRepository implements ITimelineMilestoneRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async create(data: CreateTimelineMilestoneType): Promise<TimelineMilestone> {
    const { sequence, graveyard, ...rest } = data;
    const [result] = await this.db.insert(timelineMilestones).values({
      ...rest,
      sequence: sequence as any,
      graveyard: graveyard as any,
      updatedAt: new Date(),
    }).returning();
    return result as any;
  }

  async findAll(): Promise<TimelineMilestone[]> {
    const results = await this.db.select().from(timelineMilestones).orderBy(asc(timelineMilestones.order));
    return results as any;
  }

  async delete(id: number): Promise<TimelineMilestone> {
    const [result] = await this.db.delete(timelineMilestones).where(eq(timelineMilestones.id, id)).returning();
    return result as any;
  }

  async update(data: UpdateTimelineMilestoneType): Promise<TimelineMilestone> {
    const { id, sequence, graveyard, ...rest } = data;
    
    const updateData: any = {
      ...rest,
      updatedAt: new Date(),
    };
    
    if (sequence !== undefined) {
      updateData.sequence = sequence;
    }
    
    if (graveyard !== undefined) {
      updateData.graveyard = graveyard;
    }

    const [result] = await this.db.update(timelineMilestones)
      .set(updateData)
      .where(eq(timelineMilestones.id, id))
      .returning();
      
    return result as any;
  }
}
