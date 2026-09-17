import { db } from "@portfolio/database/src/client";
import { DrizzleExperienceRepository } from "../repositories/drizzle/drizzle-experience-repository";
import { ExperienceService } from "../services/experience";

export function makeExperienceService() {
  const experienceRepository = new DrizzleExperienceRepository(db);
  return new ExperienceService(experienceRepository);
}
