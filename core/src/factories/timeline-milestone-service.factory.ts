import { db } from "@portfolio/database/src/client";
import { DrizzleTimelineMilestoneRepository } from "../repositories/drizzle/drizzle-timeline-milestone-repository";
import { TimelineMilestoneService } from "../services/timeline-milestone";

export function makeTimelineMilestoneService() {
  const timelineMilestoneRepository = new DrizzleTimelineMilestoneRepository(db);
  return new TimelineMilestoneService(timelineMilestoneRepository);
}
