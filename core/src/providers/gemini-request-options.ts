import { HttpOptions } from "@google/genai";

// The 503s observed against Gemini 3.x models are exactly the codes the SDK
// retries by default (408, 429, 500, 502, 503, 504) — the SDK just never
// enables its own retry loop unless `retryOptions` is passed explicitly.
// 429 (quota exceeded) is deliberately excluded here: a quota doesn't reset
// within a retry's backoff window, so retrying it only burns the shared
// request deadline for no chance of success — the model-fallback chain
// doesn't escalate on 429 either, for the same reason.
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
