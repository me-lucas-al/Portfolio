import { db } from "@portfolio/database/src/client";
import { DrizzleUserRepository } from "../repositories/drizzle/drizzle-user-repository";
import { AuthService } from "../services/_auth";

export function makeAuthService() {
  const userRepository = new DrizzleUserRepository(db);
  return new AuthService(userRepository);
}
