import { Education } from "@portfolio/database/prisma/generated/client";
import { CreateEducationType, UpdateEducationType } from "@portfolio/packages/index";

export interface IEducationRepository {
  create(data: CreateEducationType): Promise<Education>;
  findAll(): Promise<Education[]>;
  delete(id: number): Promise<Education>;
  update(data: UpdateEducationType): Promise<Education>;
}
