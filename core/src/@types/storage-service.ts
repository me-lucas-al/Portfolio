export interface IUploadFileDTO {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface IStorageProvider {
  uploadMultipleFiles(files: IUploadFileDTO[], pathPrefix?: string): Promise<string[]>;
  uploadRaw(buffer: Buffer, publicId: string, folder?: string): Promise<string>;
}
