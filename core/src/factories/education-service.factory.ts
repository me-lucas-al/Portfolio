import { db } from "@portfolio/database/src/client";
import { DrizzleEducationRepository } from "../repositories/drizzle/drizzle-education-repository";
import { EducationService } from "../services/education";

export function makeEducationService() {
  const educationRepository = new DrizzleEducationRepository(db);
  return new EducationService(educationRepository);
}
