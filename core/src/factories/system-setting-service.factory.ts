import prisma from "@portfolio/database";
import { PrismaSystemSettingRepository } from "../repositories/prisma/prisma-system-setting-repository";
import { SystemSettingService } from "../services/system-setting";

export function makeSystemSettingService() {
  const repo = new PrismaSystemSettingRepository(prisma);
  return new SystemSettingService(repo);
}
