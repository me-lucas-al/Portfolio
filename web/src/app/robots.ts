import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/control-painel", "/api/"],
    },
    sitemap: "https://www.lucasalmeidasouza.com/sitemap.xml",
  };
}