import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chunkMarkdown } from "../ingest/markdown-chunker";
import { hashContent } from "../ingest/hash";
import { ChunkSource, RawChunk } from "./chunk-source.interface";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DADOS_PESSOAIS_DIR = path.resolve(__dirname, "../../../dados-pessoais");

export class MarkdownSource implements ChunkSource {
  namespace = "md:";

  async *collect(): AsyncIterable<RawChunk> {
    const entries = await readdir(DADOS_PESSOAIS_DIR, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
      .map((entry) => entry.name)
      .sort();

    for (const fileName of files) {
      const filePath = path.join(DADOS_PESSOAIS_DIR, fileName);
      const raw = await readFile(filePath, "utf-8");
      const source = `md:${fileName}`;
      const chunks = chunkMarkdown(fileName, raw);

      for (let index = 0; index < chunks.length; index += 1) {
        const chunk = chunks[index];
        if (!chunk) continue;
        yield {
          source,
          sourceType: "markdown",
          chunkIndex: index,
          locale: null,
          title: chunk.title,
          content: chunk.content,
          contentHash: hashContent(chunk.content),
        };
      }
    }
  }
}
