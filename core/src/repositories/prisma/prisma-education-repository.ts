import { PrismaClient, Education } from "@portfolio/database/prisma/generated/client";
import { IEducationRepository } from "../education-repository.interface";
import { CreateEducationType, UpdateEducationType } from "@portfolio/packages/index";

export class PrismaEducationRepository implements IEducationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateEducationType): Promise<Education> {
    return this.prisma.education.create({ data });
  }

  async findAll(): Promise<Education[]> {
    return this.prisma.education.findMany({ orderBy: { order: "asc" } });
  }

  async delete(id: number): Promise<Education> {
    return this.prisma.education.delete({ where: { id } });
  }

  async update(data: UpdateEducationType): Promise<Education> {
    const { id, ...educationData } = data;
    return this.prisma.education.update({ where: { id }, data: { ...educationData } });
  }
}
