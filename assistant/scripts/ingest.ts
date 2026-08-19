import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Loaded via dynamic import below so this runs before @portfolio/database
// (imported transitively) reads process.env.DATABASE_URL at module load time.
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
  // DocsSource last: a throw from a missing documentos/ directory must not
  // prevent db/md/code from having already run and printed their reports.
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
// A source can throw outright (docs-source.ts does this on purpose for a
// missing directory or a detected PII pattern, mirroring code-source.ts's
// ENV_PATH_GUARD). That must still abort the run loudly, but it must NOT
// skip the cache invalidation below for sources that already changed the
// index earlier in this same loop - otherwise a successful md/code
// reindex followed by a docs-source abort would leave stale cached answers
// in place indefinitely (no TTL on that cache).
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
