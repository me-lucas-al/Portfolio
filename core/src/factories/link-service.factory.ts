import prisma from "@portfolio/database";
import { PrismaLinkRepository } from "../repositories/prisma/prisma-link-repository";
import { LinkService } from "../services/link";

export function makeLinkService() {
  const linkRepository = new PrismaLinkRepository(prisma);
  return new LinkService(linkRepository);
}
