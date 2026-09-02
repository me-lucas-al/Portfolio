import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const { DbSource } = await import("../src/sources/db-source");
const { MarkdownSource } = await import("../src/sources/markdown-source");
const { CodeSource } = await import("../src/sources/code-source");
const { DocsSource } = await import("../src/sources/docs-source");
const { runIngestPipeline } = await import("../src/ingest/pipeline");
const { makeAssistantAnswerService } = await import("@portfolio/core/src/factories/_index");

const args = process.argv.slice(2);
const sourceArg = args.find((value) => value.startsWith("--source="));
const sourceName = sourceArg?.split("=")[1] ?? "all";
const allowEmpty = args.includes("--allow-empty");

type AnySource =
  | InstanceType<typeof DbSource>
  | InstanceType<typeof MarkdownSource>
  | InstanceType<typeof CodeSource>
  | InstanceType<typeof DocsSource>;
type SourceFactory = () => AnySource[];

const sourcesByName: Record<string, SourceFactory> = {
  db: () => [new DbSource()],
  md: () => [new MarkdownSource()],
  code: () => [new CodeSource()],
  docs: () => [new DocsSource()],

  all: () => [new DbSource(), new MarkdownSource(), new CodeSource(), new DocsSource()],
};

const factory = sourcesByName[sourceName];
if (!factory) {
  console.error(`Unknown --source value "${sourceName}". Expected one of: ${Object.keys(sourcesByName).join(", ")}`);
  process.exit(1);
}

let hadAnyErrors = false;
let changedAnything = false;
const failedNamespaces: string[] = [];

let fatalError: unknown = null;

for (const source of factory()) {
  try {
    const report = await runIngestPipeline(source, { allowEmpty });
    console.log(
      `[ingest] namespace=${report.namespace} chunks=${report.chunks} skipped=${report.skipped} embedded=${report.embedded} deleted=${report.deleted} hadErrors=${report.hadErrors}`,
    );

    if (report.hadErrors) {
      hadAnyErrors = true;
      failedNamespaces.push(report.namespace);
    }
    if (report.embedded > 0 || report.deleted > 0) {
      changedAnything = true;
    }
  } catch (error) {
    fatalError = error;
    break;
  }
}

if (changedAnything) {
  const cleared = await makeAssistantAnswerService().clearCache();
  console.log(`[ingest] cleared ${cleared} cached assistant answer(s) after index change`);
}

if (fatalError) {
  console.error("[ingest] aborted:", fatalError instanceof Error ? fatalError.message : fatalError);
  process.exit(1);
}

if (hadAnyErrors) {
  console.error(`[ingest] run finished with errors in: ${failedNamespaces.join(", ")}`);
  process.exit(1);
}
