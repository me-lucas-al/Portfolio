import { TimelineMilestone } from "@portfolio/database/prisma/generated/client";
import { CreateTimelineMilestoneType, UpdateTimelineMilestoneType } from "@portfolio/packages/index";

export interface ITimelineMilestoneRepository {
  create(data: CreateTimelineMilestoneType): Promise<TimelineMilestone>;
  findAll(): Promise<TimelineMilestone[]>;
  delete(id: number): Promise<TimelineMilestone>;
  update(data: UpdateTimelineMilestoneType): Promise<TimelineMilestone>;
}
