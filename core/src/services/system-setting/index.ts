import { ISystemSettingRepository } from "../../repositories/system-setting-repository.interface"
import { UpsertSystemSettingType } from "@portfolio/packages/schemas/system-setting"

export class SystemSettingService {
  constructor(private repo: ISystemSettingRepository) {}

  async getByKey(key: string) {
    return this.repo.findByKey(key)
  }

  async upsert(data: UpsertSystemSettingType) {
    return this.repo.upsert(data)
  }

  async getAll() {
    return this.repo.findAll()
  }
}
