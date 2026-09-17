import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, asc } from "drizzle-orm";
import { User } from "@portfolio/database/prisma/generated/client";
import { IUserRepository } from "../user-repository.interface";
import { CreateUserType, UpdateUserType } from "@portfolio/packages/index";
import { users } from "@portfolio/database/src/schema";

export class DrizzleUserRepository implements IUserRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async findByUsername(username: string): Promise<User | null> {
    const [result] = await this.db.select().from(users).where(eq(users.username, username));
    return (result as any) || null;
  }

  async findById(id: number): Promise<User | null> {
    const [result] = await this.db.select().from(users).where(eq(users.id, id));
    return (result as any) || null;
  }

  async create(data: CreateUserType): Promise<User> {
    const [result] = await this.db.insert(users).values({
      username: data.username,
      password: data.password,
      role: 'USER',
    }).returning();
    return result as any;
  }

  async findAll(): Promise<User[]> {
    const results = await this.db.select().from(users);
    return results as any;
  }

  async delete(id: number): Promise<User> {
    const [result] = await this.db.delete(users).where(eq(users.id, id)).returning();
    return result as any;
  }

  async update(data: UpdateUserType): Promise<User> {
    const { id, ...userData } = data;
    const [result] = await this.db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result as any;
  }
}
