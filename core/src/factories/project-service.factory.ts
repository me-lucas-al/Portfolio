import prisma from "@portfolio/database";
import { PrismaProjectRepository } from "../repositories/prisma/prisma-project-repository";
import { ProjectService } from "../services/project";

export function makeProjectService() {
  const projectRepository = new PrismaProjectRepository(prisma);
  return new ProjectService(projectRepository);
}
