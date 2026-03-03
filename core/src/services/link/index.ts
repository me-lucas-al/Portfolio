import { CreateLinkType, DeleteLinkType, UpdateLinkType } from "@portfolio/packages/schemas/link";
import prisma from "@portfolio/database/prisma";

export class LinkService {
  static async createLink(data: CreateLinkType) {
    const newLink = await prisma.link.create({
      data: data,
    });
    return newLink;
  }

  static async getAllLinks() {
    const links = await prisma.link.findMany();
    return links;
  }
  
  static async deleteLinkById(data: DeleteLinkType) {
    const deletedLink = await prisma.link.delete({
      where: { id: data.id },
    });
    return deletedLink;
  }

  static async updateLinkById(data: UpdateLinkType) {
    const { id, ...linkData } = data;
    const updatedLink = await prisma.link.update({
      where: { id },
      data: { ...linkData },
    });
    return updatedLink;
  }
}
