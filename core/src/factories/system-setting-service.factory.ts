import { db } from "@portfolio/database/src/client";
import { DrizzleSystemSettingRepository } from "../repositories/drizzle/drizzle-system-setting-repository";
import { SystemSettingService } from "../services/system-setting";

export function makeSystemSettingService() {
  const repo = new DrizzleSystemSettingRepository(db);
  return new SystemSettingService(repo);
}
