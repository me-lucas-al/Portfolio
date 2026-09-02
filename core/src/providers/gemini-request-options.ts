import { HttpOptions } from "@google/genai";

const RETRYABLE_STATUS_CODES = [408, 500, 502, 503, 504];

export interface GeminiRequestBudget {
  attempts: number;
  perAttemptTimeoutMs: number;
  initialDelaySeconds?: number;
  maxDelaySeconds?: number;
}

export function buildGeminiHttpOptions(budget: GeminiRequestBudget): HttpOptions {
  const baseUrl = process.env.GEMINI_BASE_URL;

  return {
    ...(baseUrl ? { baseUrl } : {}),
    timeout: budget.perAttemptTimeoutMs,
    retryOptions: {
      attempts: budget.attempts,
      initialDelay: budget.initialDelaySeconds,
      maxDelay: budget.maxDelaySeconds,
      httpStatusCodes: RETRYABLE_STATUS_CODES,
    },
  };
}
