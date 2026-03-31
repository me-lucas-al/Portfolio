import { PrismaClient, Experience } from "@portfolio/database/prisma/generated/client";
import { IExperienceRepository } from "../experience-repository.interface";
import { CreateExperienceType, UpdateExperienceType } from "@portfolio/packages/index";

export class PrismaExperienceRepository implements IExperienceRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateExperienceType): Promise<Experience> {
    return this.prisma.experience.create({ data });
  }

  async findAll(): Promise<Experience[]> {
    return this.prisma.experience.findMany({ orderBy: { order: "asc" } });
  }

  async delete(id: number): Promise<Experience> {
    return this.prisma.experience.delete({ where: { id } });
  }

  async update(data: UpdateExperienceType): Promise<Experience> {
    const { id, ...experienceData } = data;
    return this.prisma.experience.update({ where: { id }, data: { ...experienceData } });
  }
}
