import prisma from "@portfolio/database";
import { PrismaUserRepository } from "../repositories/prisma/prisma-user-repository";
import { AuthService } from "../services/_auth";

export function makeAuthService() {
  const userRepository = new PrismaUserRepository(prisma);
  return new AuthService(userRepository);
}
