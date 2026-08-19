import { makeKnowledgeService } from "@portfolio/core/src/factories/_index";
import { ChunkSource, RawChunk } from "../sources/chunk-source.interface";

const EMBED_BATCH_SIZE = 32;

export interface IngestReport {
  namespace: string;
  chunks: number;
  skipped: number;
  embedded: number;
  deleted: number;
  hadErrors: boolean;
}

export interface IngestOptions {
  // Escape hatch for the legitimate case of clearing a namespace entirely
  // (all files moved/removed). Without it, a source that collects zero
  // chunks while the index still holds entries for it is treated as a
  // probable misconfiguration (empty checkout, missing REPOS_TO_INDEX, etc.)
  // rather than an intentional wipe.
  allowEmpty?: boolean;
}

export async function runIngestPipeline(source: ChunkSource, options: IngestOptions = {}): Promise<IngestReport> {
  const knowledgeService = makeKnowledgeService();
  const runStartedAt = new Date();

  const existingHashes = await knowledgeService.listHashes(source.namespace);
  const existingHashByKey = new Map(existingHashes.map((hash) => [`${hash.source}::${hash.chunkIndex}`, hash.contentHash]));

  let chunks = 0;
  let skipped = 0;
  let embedded = 0;
  let hadErrors = false;
  const pending: RawChunk[] = [];

  for await (const raw of source.collect()) {
    chunks += 1;
    const key = `${raw.source}::${raw.chunkIndex}`;
    const existingHash = existingHashByKey.get(key);

    if (existingHash === raw.contentHash) {
      try {
        await knowledgeService.touchLastSeen(raw.source, raw.chunkIndex);
        skipped += 1;
      } catch (error) {
        hadErrors = true;
        console.error(`[ingest] failed to touch ${key}:`, error);
      }
      continue;
    }

    pending.push(raw);
  }

  for (let i = 0; i < pending.length; i += EMBED_BATCH_SIZE) {
    const batch = pending.slice(i, i + EMBED_BATCH_SIZE);
    try {
      await knowledgeService.upsertChunks(batch);
      embedded += batch.length;
    } catch (error) {
      hadErrors = true;
      console.error(`[ingest] failed to embed/upsert batch at offset ${i}:`, error);
    }
  }

  let deleted = 0;
  const suspiciouslyEmpty = chunks === 0 && existingHashes.length > 0 && !options.allowEmpty;
  if (!hadErrors && !suspiciouslyEmpty) {
    deleted = await knowledgeService.deleteStale(source.namespace, runStartedAt);
  } else if (suspiciouslyEmpty) {
    console.error(
      `[ingest] refusing to delete ${existingHashes.length} indexed chunk(s) for namespace "${source.namespace}": the source produced 0 chunks this run, which usually means missing config or an empty folder rather than an intentional wipe. Pass --allow-empty to force the deletion.`,
    );
    hadErrors = true;
  }

  return { namespace: source.namespace, chunks, skipped, embedded, deleted, hadErrors };
}
