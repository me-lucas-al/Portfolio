import prisma from "@portfolio/database";
import { PrismaExperienceRepository } from "../repositories/prisma/prisma-experience-repository";
import { ExperienceService } from "../services/experience";

export function makeExperienceService() {
  const experienceRepository = new PrismaExperienceRepository(prisma);
  return new ExperienceService(experienceRepository);
}
