import { PrismaClient, Link } from "@portfolio/database/prisma/generated/client";
import { ILinkRepository } from "../link-repository.interface";
import { CreateLinkType, UpdateLinkType } from "@portfolio/packages/index";

export class PrismaLinkRepository implements ILinkRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateLinkType): Promise<Link> {
    return this.prisma.link.create({ data });
  }

  async findAll(): Promise<Link[]> {
    return this.prisma.link.findMany({ orderBy: { order: "asc" } });
  }

  async delete(id: number): Promise<Link> {
    return this.prisma.link.delete({ where: { id } });
  }

  async update(data: UpdateLinkType): Promise<Link> {
    const { id, ...linkData } = data;
    return this.prisma.link.update({ where: { id }, data: { ...linkData } });
  }
}
