import { SystemSettingType, UpsertSystemSettingType } from "@portfolio/packages/schemas/system-setting"

export interface ISystemSettingRepository {
  findByKey(key: string): Promise<SystemSettingType | null>
  upsert(data: UpsertSystemSettingType): Promise<SystemSettingType>
  findAll(): Promise<SystemSettingType[]>
}
