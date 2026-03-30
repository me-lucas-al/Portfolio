import { User } from "@portfolio/database/prisma/generated/client";
import { CreateUserType, UpdateUserType } from "@portfolio/packages/index";

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: CreateUserType): Promise<User>;
  findAll(): Promise<User[]>;
  delete(id: number): Promise<User>;
  update(data: UpdateUserType): Promise<User>;
}
