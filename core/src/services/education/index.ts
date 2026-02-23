import { CreateEducationType, DeleteEducationType, UpdateEducationType } from "@portfolio/packages/schemas/education/index";
import prisma from "@portfolio/database/prisma";

export class EducationService {
  static async createEducation(data: CreateEducationType) {
    const newEducation = await prisma.education.create({
      data: data,
    });
    return newEducation;
  }

  static async getAllEducations() {
    const educations = await prisma.education.findMany();
    return educations;
  }
  
  static async deleteEducationById(data: DeleteEducationType) {
    const deletedEducation = await prisma.education.delete({
      where: { id: data.id },
    });
    return deletedEducation;
  }

  static async updateEducationById(data: UpdateEducationType) {
    const { id, ...educationData } = data;
    const updatedEducation = await prisma.education.update({
      where: { id },
      data: { ...educationData },
    });
    return updatedEducation;
  }
}
