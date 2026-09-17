import prisma from "@portfolio/database";
import { PrismaTimelineMilestoneRepository } from "../repositories/prisma/prisma-timeline-milestone-repository";
import { TimelineMilestoneService } from "../services/timeline-milestone";

export function makeTimelineMilestoneService() {
  const timelineMilestoneRepository = new PrismaTimelineMilestoneRepository(prisma);
  return new TimelineMilestoneService(timelineMilestoneRepository);
}
