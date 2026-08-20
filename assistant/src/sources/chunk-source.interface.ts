import type { RawChunkInput } from "@portfolio/core/src/services/knowledge";

export type RawChunk = RawChunkInput;

export interface ChunkSource {
  namespace: string;
  collect(): AsyncIterable<RawChunk>;
}
