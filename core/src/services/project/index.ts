import { CreateProjectType, DeleteProjectType, UpdateProjectType } from "@packages/schemas/project";
import prisma from "@database/prisma";
export class ProjectService {
  static async createProject(data: CreateProjectType) {
    const newProject = await prisma.project.create({
      data: data,
    });
    return newProject;
  }

  static async getAllProjects(query?: string | number) {
    const projects = await prisma.project.findMany({
      where: query
        ? {
            OR: [
                { title: { contains: String(query), mode: "insensitive" } },
                ...(!isNaN(Number(query)) ? [{ id: Number(query) }] : []),
            ],
          }
        : {},
    });
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
