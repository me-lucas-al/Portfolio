import { Prisma, PrismaClient, TimelineMilestone } from "@portfolio/database/prisma/generated/client";
import { ITimelineMilestoneRepository } from "../timeline-milestone-repository.interface";
import { CreateTimelineMilestoneType, UpdateTimelineMilestoneType } from "@portfolio/packages/index";

export class PrismaTimelineMilestoneRepository implements ITimelineMilestoneRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateTimelineMilestoneType): Promise<TimelineMilestone> {
    const { sequence, graveyard, ...rest } = data;
    return this.prisma.timelineMilestone.create({
      data: {
        ...rest,
        sequence: sequence as Prisma.InputJsonValue,
        graveyard: graveyard as Prisma.InputJsonValue,
      },
    });
  }

  async findAll(): Promise<TimelineMilestone[]> {
    return this.prisma.timelineMilestone.findMany({ orderBy: { order: "asc" } });
  }

  async delete(id: number): Promise<TimelineMilestone> {
    return this.prisma.timelineMilestone.delete({ where: { id } });
  }

  async update(data: UpdateTimelineMilestoneType): Promise<TimelineMilestone> {
    const { id, sequence, graveyard, ...rest } = data;
    return this.prisma.timelineMilestone.update({
      where: { id },
      data: {
        ...rest,
        ...(sequence !== undefined && { sequence: sequence as Prisma.InputJsonValue }),
        ...(graveyard !== undefined && { graveyard: graveyard as Prisma.InputJsonValue }),
      },
    });
  }
}
