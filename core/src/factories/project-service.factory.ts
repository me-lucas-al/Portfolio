import { db } from "@portfolio/database/src/client";
import { DrizzleProjectRepository } from "../repositories/drizzle/drizzle-project-repository";
import { ProjectService } from "../services/project";

export function makeProjectService() {
  const projectRepository = new DrizzleProjectRepository(db);
  return new ProjectService(projectRepository);
}
