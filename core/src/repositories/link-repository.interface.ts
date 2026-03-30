import { Link } from "@portfolio/database/prisma/generated/client";
import { CreateLinkType, UpdateLinkType } from "@portfolio/packages/index";

export interface ILinkRepository {
  create(data: CreateLinkType): Promise<Link>;
  findAll(): Promise<Link[]>;
  delete(id: number): Promise<Link>;
  update(data: UpdateLinkType): Promise<Link>;
}
