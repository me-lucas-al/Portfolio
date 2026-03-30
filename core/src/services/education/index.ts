import { CreateEducationType, DeleteEducationType, UpdateEducationType } from "@portfolio/packages/schemas/education/index";
import { IEducationRepository } from "../../repositories/education-repository.interface";

export class EducationService {
  constructor(private educationRepository: IEducationRepository) {}

  async createEducation(data: CreateEducationType) {
    return this.educationRepository.create(data);
  }

  async getAllEducations() {
    return this.educationRepository.findAll();
  }

  async deleteEducationById(data: DeleteEducationType) {
    return this.educationRepository.delete(data.id);
  }

  async updateEducationById(data: UpdateEducationType) {
    return this.educationRepository.update(data);
  }
}

