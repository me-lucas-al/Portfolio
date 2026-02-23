import { CreateExperienceType, DeleteExperienceType, UpdateExperienceType } from "@portfolio/packages/schemas/experience/index";
import prisma from "@portfolio/database/prisma";

export class ExperienceService {
  static async createExperience(data: CreateExperienceType) {
    const newExperience = await prisma.experience.create({
      data: data,
    });
    return newExperience;
  }

  static async getAllExperiences() {
    const experiences = await prisma.experience.findMany();
    return experiences;
  }
  
  static async deleteExperienceById(data: DeleteExperienceType) {
    const deletedExperience = await prisma.experience.delete({
      where: { id: data.id },
    });
    return deletedExperience;
  }

  static async updateExperienceById(data: UpdateExperienceType) {
    const { id, ...experienceData } = data;
    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: { ...experienceData },
    });
    return updatedExperience;
  }
}
