import { CreateProjectType, DeleteProjectType, UpdateProjectType } from "@portfolio/packages/schemas/project/index";
import prisma from "@portfolio/database/prisma";

export class ProjectService {
  static async createProject(data: CreateProjectType) {
    const newProject = await prisma.project.create({
      data: data,
    });
    return newProject;
  }

  static async getAllProjects() {
    const projects = await prisma.project.findMany();
    return projects;
  }
  
  static async deleteProjectById(data: DeleteProjectType) {
    const deletedProject = await prisma.project.delete({
      where: { id: data.id },
    });
    return deletedProject;
  }

  static async updateProjectById(data: UpdateProjectType) {
    const { id, ...projectData } = data;
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { ...projectData },
    });
    return updatedProject;
  }
}
