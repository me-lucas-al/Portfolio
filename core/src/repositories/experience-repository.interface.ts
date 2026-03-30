import { Experience } from "@portfolio/database/prisma/generated/client";
import { CreateExperienceType, UpdateExperienceType } from "@portfolio/packages/index";

export interface IExperienceRepository {
  create(data: CreateExperienceType): Promise<Experience>;
  findAll(): Promise<Experience[]>;
  delete(id: number): Promise<Experience>;
  update(data: UpdateExperienceType): Promise<Experience>;
}
