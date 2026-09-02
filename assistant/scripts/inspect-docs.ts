
import { DocsSource } from "../src/sources/docs-source";

const source = new DocsSource();

for await (const chunk of source.collect()) {
  const preview = chunk.content.slice(0, 200).replace(/\n/g, " ");
  console.log(`${chunk.source} | ${chunk.chunkIndex} | ${chunk.title} | ${chunk.content.length} chars`);
  console.log(`  ${preview}${chunk.content.length > 200 ? "..." : ""}`);
}
