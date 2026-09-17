import { db } from "@portfolio/database/src/client";
import { DrizzleLinkRepository } from "../repositories/drizzle/drizzle-link-repository";
import { LinkService } from "../services/link";

export function makeLinkService() {
  const linkRepository = new DrizzleLinkRepository(db);
  return new LinkService(linkRepository);
}
