import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/mcp/search-context/index.ts" },
  outDir: "dist/mcp/search-context",
  format: ["esm"],
  platform: "node",
  bundle: true,
  clean: true,
  external: ["pg", "@prisma/client", "@prisma/adapter-pg", "dotenv", "@google/genai"],
  noExternal: [/^@portfolio\//],
});
