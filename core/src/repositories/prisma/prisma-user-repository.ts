import { PrismaClient, User } from "@portfolio/database/prisma/generated/client";
import { IUserRepository } from "../user-repository.interface";
import { CreateUserType, UpdateUserType } from "@portfolio/packages/index";

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserType): Promise<User> {
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        role: 'USER',
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async update(data: UpdateUserType): Promise<User> {
    const { id, ...userData } = data;
    return this.prisma.user.update({ where: { id }, data: userData });
  }
}
