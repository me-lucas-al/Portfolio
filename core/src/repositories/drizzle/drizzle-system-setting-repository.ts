import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { ISystemSettingRepository } from "../system-setting-repository.interface";
import { UpsertSystemSettingType, SystemSettingType } from "@portfolio/packages/schemas/system-setting";
import { systemSettings } from "@portfolio/database/src/schema";

export class DrizzleSystemSettingRepository implements ISystemSettingRepository {
  constructor(private db: NodePgDatabase<any>) {}

  async findByKey(key: string): Promise<SystemSettingType | null> {
    const [result] = await this.db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return (result as SystemSettingType) || null;
  }

  async upsert(data: UpsertSystemSettingType): Promise<SystemSettingType> {
    const [result] = await this.db.insert(systemSettings).values({
      key: data.key,
      value: data.value,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: systemSettings.key,
      set: {
        value: data.value,
        updatedAt: new Date(),
      }
    }).returning();
    return result as SystemSettingType;
  }

  async findAll(): Promise<SystemSettingType[]> {
    const results = await this.db.select().from(systemSettings);
    return results as SystemSettingType[];
  }
}
