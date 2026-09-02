import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";
import { isUpstreamOverloaded } from "@portfolio/core/src/providers/gemini-error";

const MIN_MS_FOR_ANOTHER_MODEL = 8_000;

export interface GenerateContentWithFallbackDeps {
  ai: GoogleGenAI;
  models: string[];
  remainingMs: () => number;
}

export async function generateContentWithFallback(
  deps: GenerateContentWithFallbackDeps,
  params: Omit<GenerateContentParameters, "model">,
): Promise<GenerateContentResponse> {
  const models = deps.models;
  let lastError: unknown;

  for (let index = 0; index < models.length; index += 1) {
    const model = models[index] as string;
    try {
      return await deps.ai.models.generateContent({ ...params, model });
    } catch (error) {
      lastError = error;

      const hasNextModel = index < models.length - 1;
      const canAffordAnotherModel = deps.remainingMs() >= MIN_MS_FOR_ANOTHER_MODEL;

      if (!hasNextModel || !isUpstreamOverloaded(error) || !canAffordAnotherModel) {
        throw error;
      }
    }
  }

  throw lastError;
}
