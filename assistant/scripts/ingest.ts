import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Loaded via dynamic import below so this runs before @portfolio/database
// (imported transitively) reads process.env.DATABASE_URL at module load time.
config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const { DbSource } = await import("../src/sources/db-source");
const { MarkdownSource } = await import("../src/sources/markdown-source");
const { CodeSource } = await import("../src/sources/code-source");
const { runIngestPipeline } = await import("../src/ingest/pipeline");

const arg = process.argv.slice(2).find((value) => value.startsWith("--source="));
const sourceName = arg?.split("=")[1] ?? "all";

type AnySource = InstanceType<typeof DbSource> | InstanceType<typeof MarkdownSource> | InstanceType<typeof CodeSource>;
type SourceFactory = () => AnySource[];

const sourcesByName: Record<string, SourceFactory> = {
  db: () => [new DbSource()],
  md: () => [new MarkdownSource()],
  code: () => [new CodeSource()],
  all: () => [new DbSource(), new MarkdownSource(), new CodeSource()],
};

const factory = sourcesByName[sourceName];
if (!factory) {
  console.error(`Unknown --source value "${sourceName}". Expected one of: ${Object.keys(sourcesByName).join(", ")}`);
  process.exit(1);
}

for (const source of factory()) {
  const report = await runIngestPipeline(source);
  console.log(
    `[ingest] namespace=${report.namespace} chunks=${report.chunks} skipped=${report.skipped} embedded=${report.embedded} deleted=${report.deleted} hadErrors=${report.hadErrors}`,
  );
}
