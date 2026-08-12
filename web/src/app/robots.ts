import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/control-painel", "/api/"],
    },
    sitemap: "https://portfolio-lucas-almeida.vercel.app/sitemap.xml",
  };
}