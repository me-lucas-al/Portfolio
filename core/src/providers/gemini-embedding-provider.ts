import { GoogleGenAI, ApiError } from "@google/genai";
import { IEmbeddingProvider } from "../@types/embedding-provider";

const EMBEDDING_MODEL = "gemini-embedding-001";
const OUTPUT_DIMENSIONALITY = 1536;
const BATCH_SIZE = 32;
const MAX_CONCURRENT_BATCHES = 2;
const MAX_RETRIES = 5;
const RETRYABLE_STATUS_CODES = new Set([429, 503]);

type EmbeddingTaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

function normalizeL2(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (norm === 0) return vector;
  return vector.map((value) => value / norm);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown): boolean {
  return error instanceof ApiError && RETRYABLE_STATUS_CODES.has(error.status);
}

export class GeminiEmbeddingProvider implements IEmbeddingProvider {
  private readonly client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const batches = chunk(texts, BATCH_SIZE);
    const results: number[][][] = new Array(batches.length);

    for (let start = 0; start < batches.length; start += MAX_CONCURRENT_BATCHES) {
      const window = batches.slice(start, start + MAX_CONCURRENT_BATCHES);
      const windowResults = await Promise.all(
        window.map((batch) => this.embedBatchWithRetry(batch, "RETRIEVAL_DOCUMENT")),
      );
      windowResults.forEach((embeddings, index) => {
        results[start + index] = embeddings;
      });
    }

    return results.flat();
  }

  async embedQuery(text: string): Promise<number[]> {
    const [embedding] = await this.embedBatchWithRetry([text], "RETRIEVAL_QUERY");
    if (!embedding) {
      throw new Error("Gemini embedding response did not contain any embedding");
    }
    return embedding;
  }

  private async embedBatchWithRetry(texts: string[], taskType: EmbeddingTaskType): Promise<number[][]> {
    let attempt = 0;
    for (;;) {
      try {
        return await this.embedBatch(texts, taskType);
      } catch (error) {
        attempt += 1;
        if (attempt >= MAX_RETRIES || !isRetryable(error)) throw error;
        const backoffMs = 2 ** attempt * 250 + Math.random() * 250;
        await sleep(backoffMs);
      }
    }
  }

  private async embedBatch(texts: string[], taskType: string): Promise<number[][]> {
    const response = await this.client.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: texts,
      config: { taskType, outputDimensionality: OUTPUT_DIMENSIONALITY },
    });

    const embeddings = response.embeddings ?? [];
    if (embeddings.length !== texts.length) {
      throw new Error(
        `Gemini embedding count mismatch: expected ${texts.length}, got ${embeddings.length}`,
      );
    }

    return embeddings.map((embedding) => {
      const values = embedding.values ?? [];
      if (values.length !== OUTPUT_DIMENSIONALITY) {
        throw new Error(
          `Gemini embedding dimensionality mismatch: expected ${OUTPUT_DIMENSIONALITY}, got ${values.length}`,
        );
      }
      return normalizeL2(values);
    });
  }
}
