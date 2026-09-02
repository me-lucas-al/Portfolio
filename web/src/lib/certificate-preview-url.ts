export function buildCertificatePreviewUrl(url: string | null | undefined): string {
  if (!url) return "";

  const trimmed = url.trim();
  const isPdf = /\.pdf(\?.*)?$/i.test(trimmed);

  if (!isPdf || !trimmed.includes("/upload/")) {
    return trimmed;
  }

  const withTransformation = trimmed.replace("/upload/", "/upload/pg_1,f_jpg,q_auto/");
  return withTransformation.replace(/\.pdf(\?.*)?$/i, (match, query) => `.jpg${query || ""}`);
}
