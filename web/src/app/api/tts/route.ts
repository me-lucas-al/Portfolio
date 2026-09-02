import { NextRequest } from "next/server";
import { isAbortError } from "@portfolio/core/src/providers/gemini-error";
import { getClientIp } from "@/lib/assistant/http-guards";
import { hashIp, checkTtsRateLimit, isTtsDailyBudgetExceeded } from "@/lib/assistant/rate-limit";
import { verifySpeechToken } from "@/lib/assistant/speech-token";
import { createDeadline } from "@/lib/assistant/deadline";
import { findCachedSpeech, synthesizeAndCacheSpeech } from "@/lib/assistant/speech-cache";

export const runtime = "nodejs";

export const maxDuration = 75;
export const preferredRegion = "gru1";

const TOTAL_BUDGET_MS = 60_000;

type TtsErrorReason =
  | "disabled"
  | "not_configured"
  | "invalid_request"
  | "bad_signature"
  | "expired_token"
  | "rate_limited"
  | "daily_budget"
  | "upstream_error"
  | "timeout"
  | "unknown";

function errorBody(error: string, reason: TtsErrorReason): { error: string; reason: TtsErrorReason } {
  return { error, reason };
}

function logMetric(fields: Record<string, string | number>): void {
  const line = Object.entries(fields)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
  console.log(`[tts][metrics] ${line}`);
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();

  if (process.env.ASSISTANT_VOICE_ENABLED !== "true") {
    return Response.json(errorBody("Voice is temporarily disabled", "disabled"), { status: 503 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(errorBody("Voice is not configured", "not_configured"), { status: 503 });
  }

  const token = new URL(request.url).searchParams.get("k");
  if (!token) {
    return Response.json(errorBody("Missing token", "invalid_request"), { status: 400 });
  }

  const verified = verifySpeechToken(token);
  if (!verified.ok) {
    if (verified.reason === "malformed") {
      return Response.json(errorBody("Malformed token", "invalid_request"), { status: 400 });
    }
    if (verified.reason === "expired") {
      return Response.json(errorBody("Token expired", "expired_token"), { status: 403 });
    }
    return Response.json(errorBody("Invalid token signature", "bad_signature"), { status: 403 });
  }

  const ip = getClientIp(request);
  const ipHashPrefix = hashIp(ip).slice(0, 8);

  const rateLimit = await checkTtsRateLimit(ip);
  if (!rateLimit.allowed) {
    logMetric({ ip: ipHashPrefix, status: 429, reason: rateLimit.reason ?? "unknown" });
    return Response.json(errorBody("Rate limit exceeded", "rate_limited"), { status: 429 });
  }

  try {
    const cached = await findCachedSpeech(verified.text);
    if (cached) {
      logMetric({ ip: ipHashPrefix, status: 302, cacheHit: 1, durationMs: Date.now() - startedAt });
      return Response.redirect(cached.audioUrl, 302);
    }
  } catch (error) {
    console.error("[tts] cache lookup failed:", error);
  }

  if (await isTtsDailyBudgetExceeded()) {
    logMetric({ ip: ipHashPrefix, status: 503, reason: "daily_budget" });
    return Response.json(errorBody("Voice daily budget exceeded, please try again tomorrow", "daily_budget"), { status: 503 });
  }

  const deadline = createDeadline(TOTAL_BUDGET_MS, request.signal);

  try {

    const { wav } = await synthesizeAndCacheSpeech(apiKey, verified.text, deadline.signal);

    logMetric({ ip: ipHashPrefix, status: 200, cacheHit: 0, bytes: wav.length, durationMs: Date.now() - startedAt });

    return new Response(new Uint8Array(wav), {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(wav.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[tts] synthesis failed:", error);

    if (isAbortError(error) && deadline.remainingMs() <= 0) {
      logMetric({ ip: ipHashPrefix, status: 504, durationMs: Date.now() - startedAt });
      return Response.json(errorBody("Request timed out", "timeout"), { status: 504 });
    }

    logMetric({ ip: ipHashPrefix, status: 502, durationMs: Date.now() - startedAt });
    return Response.json(errorBody("Failed to synthesize speech", "unknown"), { status: 502 });
  }
}
