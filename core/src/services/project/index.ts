import { CreateProjectType, DeleteProjectType, UpdateProjectType } from "@portfolio/packages/schemas/project/index";
import { IProjectRepository } from "../../repositories/project-repository.interface";

export class ProjectService {
  constructor(private projectRepository: IProjectRepository) {}

  async createProject(data: CreateProjectType) {
    return this.projectRepository.create(data);
  }

  async getAllProjects() {
    return this.projectRepository.findAll();
  }

  async deleteProjectById(data: DeleteProjectType) {
    return this.projectRepository.delete(data.id);
  }

  async updateProjectById(data: UpdateProjectType) {
    return this.projectRepository.update(data);
  }
}

