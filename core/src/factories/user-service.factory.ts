import prisma from "@portfolio/database";
import { PrismaUserRepository } from "../repositories/prisma/prisma-user-repository";
import { UserService } from "../services/user";

export function makeUserService() {
  const userRepository = new PrismaUserRepository(prisma);
  return new UserService(userRepository);
}
