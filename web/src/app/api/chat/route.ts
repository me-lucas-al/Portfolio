import { NextRequest, after } from "next/server";
import { ChatRequestSchema } from "@portfolio/packages/schemas/assistant";
import type { ChatErrorBody, ChatErrorReason } from "@portfolio/packages/schemas/assistant/chat-error";
import type { ChatSpeechType } from "@portfolio/packages/schemas/assistant/chat-response";
import { makeAssistantAnswerService } from "@portfolio/core/src/factories/_index";
import { checkRateLimit, hashIp, isDailyBudgetExceeded, isTtsDailyBudgetExceeded } from "@/lib/assistant/rate-limit";
import { runAssistant } from "@/lib/assistant/agent";
import { createDeadline } from "@/lib/assistant/deadline";
import { toChatErrorResponse } from "@/lib/assistant/chat-error-response";
import { getClientIp, isSameOrigin } from "@/lib/assistant/http-guards";
import { signSpeechToken } from "@/lib/assistant/speech-token";
import { findCachedSpeech, synthesizeAndCacheSpeech } from "@/lib/assistant/speech-cache";
import { truncateForSpeech } from "@/lib/assistant/tts-text";

export const runtime = "nodejs";
// Not the full 300s Vercel allows: this is an unauthenticated public endpoint,
// and pinning a visitor's function for 5 minutes is a cost/abuse vector on
// its own. TOTAL_BUDGET_MS below leaves ~10s of headroom under this ceiling
// for Response.json to run and for the after() callback to get a head start
// (it isn't itself bounded by TOTAL_BUDGET_MS, so on a cache miss it can still
// run past this ceiling - a lost cache write in that case is harmless).
export const maxDuration = 60;
export const preferredRegion = "gru1";

const TOTAL_BUDGET_MS = 50_000;
const SPEECH_TOKEN_TTL_MS = 10 * 60_000;
// Only pre-warm a fresh generation that finished comfortably under this
// route's own budget: a generation that already took most of TOTAL_BUDGET_MS
// is close to maxDuration, and shouldn't also try to run a 30-40s TTS
// synthesis in its after() tail. The client's own later /api/tts request
// still synthesizes live in that case - same as before this cache existed.
const PREWARM_MAX_GENERATION_MS = 15_000;
// Generous budget for the prewarm's own synthesis call: it runs in an
// after() tail, detached from this request's own TOTAL_BUDGET_MS ceiling.
const PREWARM_SYNTHESIS_BUDGET_MS = 60_000;

// Voice is gated independently from ASSISTANT_ENABLED so it can be killed
// (e.g. cost spike, bad synthesis output) without taking down text chat.
// Included on the cache-hit branch too: that's the fastest, cheapest path
// (~500ms) and must not be the one path that never gets to speak.
function buildSpeechField(text: string): ChatSpeechType | undefined {
  if (process.env.ASSISTANT_VOICE_ENABLED !== "true") return undefined;

  const speechText = truncateForSpeech(text);
  const token = signSpeechToken(speechText, SPEECH_TOKEN_TTL_MS);
  return {
    url: `/api/tts?k=${token}`,
    text: speechText,
    expiresAt: Date.now() + SPEECH_TOKEN_TTL_MS,
  };
}

// Proactively populates /api/tts's cache from the server side, so the
// client's own later /api/tts request (fired right after this response
// lands) has a good chance of finding a cache hit instead of triggering a
// live 30-40s synthesis. Never required for correctness - a miss here just
// means the client synthesizes live, same as before this cache existed - so
// every failure mode here only logs and never throws out of this function.
async function prewarmSpeech(apiKey: string, text: string): Promise<void> {
  if (process.env.ASSISTANT_VOICE_ENABLED !== "true") return;

  const speechText = truncateForSpeech(text);

  // Don't synthesize+upload for something a previous prewarm or another
  // visitor's own /api/tts request already cached.
  const cached = await findCachedSpeech(speechText);
  if (cached) return;

  // A background optimization must never push the daily synthesis budget
  // over on its own account - it deliberately does NOT go through the
  // per-IP rate limiter (there's no client IP context for a server-initiated
  // warm); this daily budget check is the correct backstop instead.
  if (await isTtsDailyBudgetExceeded()) return;

  const deadline = createDeadline(PREWARM_SYNTHESIS_BUDGET_MS);
  await synthesizeAndCacheSpeech(apiKey, speechText, deadline.signal);
}

function logMetric(fields: Record<string, string | number>): void {
  const line = Object.entries(fields)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
  console.log(`[assistant][metrics] ${line}`);
}

function errorBody(error: string, reason: ChatErrorReason): ChatErrorBody {
  return { error, reason };
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  if (process.env.ASSISTANT_ENABLED === "false") {
    return Response.json(errorBody("Assistant is temporarily disabled", "disabled"), { status: 503 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.split(";")[0]?.trim().toLowerCase().includes("application/json")) {
    return Response.json(errorBody("Unsupported content type", "invalid_request"), { status: 400 });
  }

  if (!isSameOrigin(request)) {
    return Response.json(errorBody("Invalid origin", "invalid_origin"), { status: 403 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(errorBody("Assistant is not configured", "not_configured"), { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(errorBody("Invalid JSON body", "invalid_request"), { status: 400 });
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ...errorBody("Invalid request", "invalid_request"), details: parsed.error.flatten() }, { status: 400 });
  }

  const ip = getClientIp(request);
  const ipHashPrefix = hashIp(ip).slice(0, 8);

  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.allowed) {
    logMetric({ ip: ipHashPrefix, status: 429, reason: rateLimit.reason ?? "unknown" });
    return Response.json(errorBody("Rate limit exceeded", "rate_limited"), { status: 429 });
  }

  const deadline = createDeadline(TOTAL_BUDGET_MS, request.signal);
  const answerCache = makeAssistantAnswerService();

  // Checked before the daily generation budget on purpose: a cache hit costs one cheap
  // embedding call, not a generation call, so previously-answered questions should keep
  // working even once the budget for new generations is exhausted. The embedding cost
  // itself is still bounded only by the per-IP rate limit above, not by the daily budget.
  let cacheLookupEmbedding: number[] | undefined;
  try {
    const cached = await answerCache.findCachedAnswer(parsed.data.message, parsed.data.locale, deadline.signal);
    cacheLookupEmbedding = cached.embedding;
    if (cached.answer) {
      const answerText = cached.answer;

      logMetric({
        ip: ipHashPrefix,
        locale: parsed.data.locale,
        status: 200,
        cacheHit: 1,
        durationMs: Date.now() - startedAt,
      });

      // Always pre-warm on the cache-hit branch: it's the ~500ms fast path
      // called out as the one that must not be the path that never gets to
      // speak, and server time is cheapest to spend here.
      after(() => prewarmSpeech(apiKey, answerText).catch((error) => console.error("[assistant] speech prewarm failed:", error)));

      return Response.json({ text: answerText, speech: buildSpeechField(answerText) });
    }
  } catch (error) {
    console.error("[assistant] cache lookup failed:", error);
  }

  if (await isDailyBudgetExceeded()) {
    logMetric({ ip: ipHashPrefix, status: 503, reason: "daily_budget" });
    return Response.json(errorBody("Assistant daily budget exceeded, please try again tomorrow", "daily_budget"), { status: 503 });
  }

  try {
    const { text, toolCallRounds } = await runAssistant({
      apiKey,
      message: parsed.data.message,
      history: parsed.data.history,
      locale: parsed.data.locale,
      deadline,
    });

    const generationDurationMs = Date.now() - startedAt;

    logMetric({
      ip: ipHashPrefix,
      locale: parsed.data.locale,
      status: 200,
      cacheHit: 0,
      toolCallRounds,
      durationMs: generationDurationMs,
    });

    // Runs after the response is sent, but Next keeps the serverless function alive
    // for it (unlike a bare fire-and-forget promise, which Vercel may cut off early).
    after(() =>
      answerCache
        .saveAnswer(parsed.data.message, text, parsed.data.locale, cacheLookupEmbedding)
        .catch((error) => console.error("[assistant] failed to persist answer:", error)),
    );

    // Only pre-warm when the generation itself was cheap: a slow generation
    // is already close to this route's own maxDuration, and shouldn't also
    // spend an after()-tail 30-40s on TTS synthesis.
    if (generationDurationMs < PREWARM_MAX_GENERATION_MS) {
      after(() => prewarmSpeech(apiKey, text).catch((error) => console.error("[assistant] speech prewarm failed:", error)));
    }

    return Response.json({ text, speech: buildSpeechField(text) });
  } catch (error) {
    console.error("[assistant] generation failed:", error);
    const response = toChatErrorResponse(error, deadline);
    logMetric({ ip: ipHashPrefix, status: response.status, durationMs: Date.now() - startedAt });
    return response;
  }
}
