// Zero-cost feedback loop for calibrating PDF/DOCX/CSV extraction: no dotenv,
// no database, no Gemini calls. chunk-source.interface.ts imports RawChunkInput
// as `import type`, so nothing from @portfolio/core's runtime dependency graph
// (which needs env vars) is pulled in here.
import { DocsSource } from "../src/sources/docs-source";

const source = new DocsSource();

for await (const chunk of source.collect()) {
  const preview = chunk.content.slice(0, 200).replace(/\n/g, " ");
  console.log(`${chunk.source} | ${chunk.chunkIndex} | ${chunk.title} | ${chunk.content.length} chars`);
  console.log(`  ${preview}${chunk.content.length > 200 ? "..." : ""}`);
}
