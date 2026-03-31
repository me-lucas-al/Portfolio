import { PrismaClient, Project } from "@portfolio/database/prisma/generated/client";
import { IProjectRepository } from "../project-repository.interface";
import { CreateProjectType, UpdateProjectType } from "@portfolio/packages/index";

export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProjectType): Promise<Project> {
    return this.prisma.project.create({ data });
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({ orderBy: { order: 'asc' } });
  }

  async delete(id: number): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }

  async update(data: UpdateProjectType): Promise<Project> {
    const { id, ...projectData } = data;
    return this.prisma.project.update({ where: { id }, data: { ...projectData } });
  }
}
