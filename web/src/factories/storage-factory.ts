import { IStorageProvider } from "@portfolio/core/src/@types/storage-service";
import { CloudinaryStorageProvider } from "@/lib/storage/cloudinary-storage-provider";

export function getStorageProvider(): IStorageProvider {
  return new CloudinaryStorageProvider();
}
