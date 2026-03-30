import { CreateExperienceType, DeleteExperienceType, UpdateExperienceType } from "@portfolio/packages/schemas/experience/index";
import { IExperienceRepository } from "../../repositories/experience-repository.interface";

export class ExperienceService {
  constructor(private experienceRepository: IExperienceRepository) {}

  async createExperience(data: CreateExperienceType) {
    return this.experienceRepository.create(data);
  }

  async getAllExperiences() {
    return this.experienceRepository.findAll();
  }

  async deleteExperienceById(data: DeleteExperienceType) {
    return this.experienceRepository.delete(data.id);
  }

  async updateExperienceById(data: UpdateExperienceType) {
    return this.experienceRepository.update(data);
  }
}

