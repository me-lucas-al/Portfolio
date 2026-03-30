import { Project } from "@portfolio/database/prisma/generated/client";
import { CreateProjectType, UpdateProjectType } from "@portfolio/packages/index";

export interface IProjectRepository {
  create(data: CreateProjectType): Promise<Project>;
  findAll(): Promise<Project[]>;
  delete(id: number): Promise<Project>;
  update(data: UpdateProjectType): Promise<Project>;
}
