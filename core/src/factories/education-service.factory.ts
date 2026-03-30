import prisma from "@portfolio/database";
import { PrismaEducationRepository } from "../repositories/prisma/prisma-education-repository";
import { EducationService } from "../services/education";

export function makeEducationService() {
  const educationRepository = new PrismaEducationRepository(prisma);
  return new EducationService(educationRepository);
}
