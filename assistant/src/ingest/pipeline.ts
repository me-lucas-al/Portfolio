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

export async function runIngestPipeline(source: ChunkSource): Promise<IngestReport> {
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
  if (!hadErrors) {
    deleted = await knowledgeService.deleteStale(source.namespace, runStartedAt);
  }

  return { namespace: source.namespace, chunks, skipped, embedded, deleted, hadErrors };
}
