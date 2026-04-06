import { v2 as cloudinary } from "cloudinary";
import { IStorageProvider, IUploadFileDTO } from "@portfolio/core/src/@types/storage-service";

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("Cloudinary configuration is missing. Uploads might fail.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorageProvider implements IStorageProvider {
  async uploadMultipleFiles(files: IUploadFileDTO[], pathPrefix = ""): Promise<string[]> {
    return Promise.all(
      files.map(async (file) => {
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: pathPrefix || "portfolio",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(new Error("No result from Cloudinary"));
              }
            }
          );

          uploadStream.end(file.buffer);
        });
      })
    );
  }
}
