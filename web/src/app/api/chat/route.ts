import { NextRequest, after } from "next/server";
import { ChatRequestSchema } from "@portfolio/packages/schemas/assistant";
import type { ChatErrorBody, ChatErrorReason } from "@portfolio/packages/schemas/assistant/chat-error";
import { makeAssistantAnswerService } from "@portfolio/core/src/factories/_index";
import { checkRateLimit, hashIp, isDailyBudgetExceeded } from "@/lib/assistant/rate-limit";
import { runAssistant } from "@/lib/assistant/agent";
import { createDeadline } from "@/lib/assistant/deadline";
import { toChatErrorResponse } from "@/lib/assistant/chat-error-response";

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

// Vercel's edge network sets `x-real-ip` to the actual client IP and cannot
// have that value spoofed by the client; `x-forwarded-for` is used only as a
// fallback for local dev, where neither header may be trustworthy anyway.
function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  const first = forwardedFor?.split(",")[0]?.trim();
  return first || "unknown";
}

// Defense-in-depth against browser-based CSRF, not an anti-abuse control:
// a non-browser client can simply omit Origin or forge it, which the actual
// cost controls (rate limit + daily budget) are responsible for stopping.
function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return origin === new URL(request.url).origin;
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
      logMetric({
        ip: ipHashPrefix,
        locale: parsed.data.locale,
        status: 200,
        cacheHit: 1,
        durationMs: Date.now() - startedAt,
      });
      return Response.json({ text: cached.answer });
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

    logMetric({
      ip: ipHashPrefix,
      locale: parsed.data.locale,
      status: 200,
      cacheHit: 0,
      toolCallRounds,
      durationMs: Date.now() - startedAt,
    });

    // Runs after the response is sent, but Next keeps the serverless function alive
    // for it (unlike a bare fire-and-forget promise, which Vercel may cut off early).
    after(() =>
      answerCache
        .saveAnswer(parsed.data.message, text, parsed.data.locale, cacheLookupEmbedding)
        .catch((error) => console.error("[assistant] failed to persist answer:", error)),
    );

    return Response.json({ text });
  } catch (error) {
    console.error("[assistant] generation failed:", error);
    const response = toChatErrorResponse(error, deadline);
    logMetric({ ip: ipHashPrefix, status: response.status, durationMs: Date.now() - startedAt });
    return response;
  }
}
