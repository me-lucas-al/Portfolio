import { NextRequest } from "next/server";
import { ChatRequestSchema } from "@portfolio/packages/schemas/assistant";
import { checkRateLimit, hashIp, isDailyBudgetExceeded } from "@/lib/assistant/rate-limit";
import { runAssistant } from "@/lib/assistant/agent";

export const runtime = "nodejs";
export const maxDuration = 30;
export const preferredRegion = "gru1";

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
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

  const ip = getClientIp(request);
  const ipHashPrefix = hashIp(ip).slice(0, 8);

  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.allowed) {
    logMetric({ ip: ipHashPrefix, status: 429, reason: rateLimit.reason ?? "unknown" });
    return Response.json({ error: "Rate limit exceeded", reason: rateLimit.reason }, { status: 429 });
  }

  if (await isDailyBudgetExceeded()) {
    logMetric({ ip: ipHashPrefix, status: 503, reason: "daily_budget" });
    return Response.json({ error: "Assistant daily budget exceeded, please try again tomorrow" }, { status: 503 });
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
      toolCallRounds,
      durationMs: Date.now() - startedAt,
    });

    return Response.json({ text });
  } catch (error) {
    console.error("[assistant] generation failed:", error);
    logMetric({ ip: ipHashPrefix, status: 502, durationMs: Date.now() - startedAt });
    return Response.json({ error: "Failed to generate a response" }, { status: 502 });
  }
}
