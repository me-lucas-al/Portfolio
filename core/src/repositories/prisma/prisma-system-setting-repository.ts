import { PrismaClient } from "@portfolio/database/prisma/generated/client";
import { ISystemSettingRepository } from "../system-setting-repository.interface";
import { UpsertSystemSettingType } from "@portfolio/packages/schemas/system-setting";
import { SystemSettingType } from "@portfolio/packages/schemas/system-setting";

export class PrismaSystemSettingRepository implements ISystemSettingRepository {
  constructor(private prisma: PrismaClient) {}

  async findByKey(key: string): Promise<SystemSettingType | null> {
    return this.prisma.systemSetting.findUnique({ where: { key } }) as Promise<SystemSettingType | null>;
  }

  async upsert(data: UpsertSystemSettingType): Promise<SystemSettingType> {
    return this.prisma.systemSetting.upsert({
      where: { key: data.key },
      update: { value: data.value },
      create: { key: data.key, value: data.value },
    }) as Promise<SystemSettingType>;
  }

  async findAll(): Promise<SystemSettingType[]> {
    return this.prisma.systemSetting.findMany() as Promise<SystemSettingType[]>;
  }
}
