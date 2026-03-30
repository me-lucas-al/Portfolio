import { CreateLinkType, DeleteLinkType, UpdateLinkType } from "@portfolio/packages/schemas/link";
import { ILinkRepository } from "../../repositories/link-repository.interface";

export class LinkService {
  constructor(private linkRepository: ILinkRepository) {}

  async createLink(data: CreateLinkType) {
    return this.linkRepository.create(data);
  }

  async getAllLinks() {
    return this.linkRepository.findAll();
  }

  async deleteLinkById(data: DeleteLinkType) {
    return this.linkRepository.delete(data.id);
  }

  async updateLinkById(data: UpdateLinkType) {
    return this.linkRepository.update(data);
  }
}

