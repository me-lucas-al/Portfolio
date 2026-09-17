import { db } from "@portfolio/database/src/client";
import { DrizzleUserRepository } from "../repositories/drizzle/drizzle-user-repository";
import { UserService } from "../services/user";

export function makeUserService() {
  const userRepository = new DrizzleUserRepository(db);
  return new UserService(userRepository);
}
