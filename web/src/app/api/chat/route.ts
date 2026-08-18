import { NextRequest } from "next/server";
import { ApiError } from "@google/genai";
import { ChatRequestSchema } from "@portfolio/packages/schemas/assistant";
import { makeAssistantAnswerService } from "@portfolio/core/src/factories/_index";
import { checkRateLimit, hashIp, isDailyBudgetExceeded } from "@/lib/assistant/rate-limit";
import { runAssistant } from "@/lib/assistant/agent";

export const runtime = "nodejs";
export const maxDuration = 30;
export const preferredRegion = "gru1";

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

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  if (process.env.ASSISTANT_ENABLED === "false") {
    return Response.json({ error: "Assistant is temporarily disabled" }, { status: 503 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.split(";")[0]?.trim().toLowerCase().includes("application/json")) {
    return Response.json({ error: "Unsupported content type" }, { status: 400 });
  }

  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Assistant is not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const ip = getClientIp(request);
  const ipHashPrefix = hashIp(ip).slice(0, 8);

  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.allowed) {
    logMetric({ ip: ipHashPrefix, status: 429, reason: rateLimit.reason ?? "unknown" });
    return Response.json({ error: "Rate limit exceeded", reason: rateLimit.reason }, { status: 429 });
  }

  const answerCache = makeAssistantAnswerService();

  try {
    const cachedAnswer = await answerCache.findCachedAnswer(parsed.data.message, parsed.data.locale);
    if (cachedAnswer) {
      logMetric({
        ip: ipHashPrefix,
        locale: parsed.data.locale,
        status: 200,
        cacheHit: 1,
        durationMs: Date.now() - startedAt,
      });
      return Response.json({ text: cachedAnswer });
    }
  } catch (error) {
    console.error("[assistant] cache lookup failed:", error);
  }

  if (await isDailyBudgetExceeded()) {
    logMetric({ ip: ipHashPrefix, status: 503, reason: "daily_budget" });
    return Response.json({ error: "Assistant daily budget exceeded, please try again tomorrow" }, { status: 503 });
  }

  try {
    const { text, toolCallRounds } = await runAssistant({
      apiKey,
      message: parsed.data.message,
      history: parsed.data.history,
      locale: parsed.data.locale,
      abortSignal: request.signal,
    });

    logMetric({
      ip: ipHashPrefix,
      locale: parsed.data.locale,
      status: 200,
      cacheHit: 0,
      toolCallRounds,
      durationMs: Date.now() - startedAt,
    });

    answerCache
      .saveAnswer(parsed.data.message, text, parsed.data.locale)
      .catch((error) => console.error("[assistant] failed to persist answer:", error));

    return Response.json({ text });
  } catch (error) {
    console.error("[assistant] generation failed:", error);

    // Gemini's own daily/per-minute quota exhausted (RESOURCE_EXHAUSTED) — distinct
    // from our own rate limit and daily budget, but the same "try again later" shape.
    if (error instanceof ApiError && error.status === 429) {
      logMetric({ ip: ipHashPrefix, status: 503, reason: "upstream_quota", durationMs: Date.now() - startedAt });
      return Response.json({ error: "Upstream quota exceeded", reason: "upstream_quota" }, { status: 503 });
    }

    logMetric({ ip: ipHashPrefix, status: 502, durationMs: Date.now() - startedAt });
    return Response.json({ error: "Failed to generate a response" }, { status: 502 });
  }
}
