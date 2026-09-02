import { describe, it, expect } from "vitest";
import { buildCertificatePreviewUrl } from "./certificate-preview-url";

describe("buildCertificatePreviewUrl", () => {
  it("should return empty string if url is empty, null or undefined", () => {
    expect(buildCertificatePreviewUrl("")).toBe("");
    expect(buildCertificatePreviewUrl(null)).toBe("");
    expect(buildCertificatePreviewUrl(undefined)).toBe("");
  });

  it("should transform Cloudinary PDF url into page 1 JPG preview url", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/v123456789/education-certificates/cert.pdf";
    const expected = "https://res.cloudinary.com/demo/image/upload/pg_1,f_jpg,q_auto/v123456789/education-certificates/cert.jpg";
    expect(buildCertificatePreviewUrl(input)).toBe(expected);
  });

  it("should handle uppercase .PDF extension in Cloudinary url", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/v123456789/education-certificates/cert.PDF";
    const expected = "https://res.cloudinary.com/demo/image/upload/pg_1,f_jpg,q_auto/v123456789/education-certificates/cert.jpg";
    expect(buildCertificatePreviewUrl(input)).toBe(expected);
  });

  it("should handle PDF url with query parameters", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/v1234/cert.pdf?version=2";
    const expected = "https://res.cloudinary.com/demo/image/upload/pg_1,f_jpg,q_auto/v1234/cert.jpg?version=2";
    expect(buildCertificatePreviewUrl(input)).toBe(expected);
  });

  it("should return original url for non-PDF Cloudinary image files (e.g. PNG, JPG, WEBP)", () => {
    const pngUrl = "https://res.cloudinary.com/demo/image/upload/v1234/education-certificates/cert.png";
    const jpgUrl = "https://res.cloudinary.com/demo/image/upload/v1234/education-certificates/cert.jpg";
    const webpUrl = "https://res.cloudinary.com/demo/image/upload/v1234/education-certificates/cert.webp";

    expect(buildCertificatePreviewUrl(pngUrl)).toBe(pngUrl);
    expect(buildCertificatePreviewUrl(jpgUrl)).toBe(jpgUrl);
    expect(buildCertificatePreviewUrl(webpUrl)).toBe(webpUrl);
  });

  it("should return original url if PDF is not hosted on Cloudinary (/upload/ missing)", () => {
    const externalUrl = "https://example.com/files/cert.pdf";
    expect(buildCertificatePreviewUrl(externalUrl)).toBe(externalUrl);
  });
});
