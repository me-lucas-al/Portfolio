import { NextRequest, after } from "next/server";
import { SpeechRequestSchema } from "@portfolio/packages/schemas/assistant/speech-request";
import { makeSpeechProvider } from "@portfolio/core/src/factories/_index";
import { checkSpeechRateLimit, hashIp, isSpeechDailyBudgetExceeded } from "@/lib/assistant/speech-rate-limit";
import { createDeadline } from "@/lib/assistant/deadline";
import { toChatErrorResponse } from "@/lib/assistant/chat-error-response";

export const runtime = "nodejs";
export const maxDuration = 60;
export const preferredRegion = "gru1";

const TOTAL_BUDGET_MS = 50_000;

function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  const first = forwardedFor?.split(",")[0]?.trim();
  return first || "unknown";
}

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}

function logMetric(fields: Record<string, string | number>): void {
  const line = Object.entries(fields)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
  console.log(`[speech][metrics] ${line}`);
}

function errorBody(error: string, reason: string) {
  return { error, reason };
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  if (process.env.SPEECH_ENABLED === "false") {
    return Response.json(errorBody("Speech is temporarily disabled", "disabled"), { status: 503 });
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
    return Response.json(errorBody("Speech is not configured", "not_configured"), { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(errorBody("Invalid JSON body", "invalid_request"), { status: 400 });
  }

  const parsed = SpeechRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ...errorBody("Invalid request", "invalid_request"), details: parsed.error.flatten() }, { status: 400 });
  }

  const ip = getClientIp(request);
  const ipHashPrefix = hashIp(ip).slice(0, 8);

  const rateLimit = await checkSpeechRateLimit(ip);
  if (!rateLimit.allowed) {
    logMetric({ ip: ipHashPrefix, status: 429, reason: rateLimit.reason ?? "unknown" });
    return Response.json(errorBody("Rate limit exceeded", "rate_limited"), { status: 429 });
  }

  if (await isSpeechDailyBudgetExceeded()) {
    logMetric({ ip: ipHashPrefix, status: 503, reason: "daily_budget" });
    return Response.json(errorBody("Speech daily budget exceeded", "daily_budget"), { status: 503 });
  }

  const deadline = createDeadline(TOTAL_BUDGET_MS, request.signal);
  
  try {
    const provider = makeSpeechProvider();
    const voice = process.env.SPEECH_VOICE || "Zubenelgenubi";
    
    const streamIter = await provider.synthesizeStreaming(parsed.data.text, { 
        voice, 
        styleTags: parsed.data.styleTags, 
        signal: deadline.signal 
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamIter) {
            controller.enqueue(chunk);
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
      cancel() {
        // Abort handled by deadline signal
      }
    });

    logMetric({
      ip: ipHashPrefix,
      locale: parsed.data.locale,
      status: 200,
      durationMs: Date.now() - startedAt,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "audio/pcm;rate=24000",
        "Cache-Control": "no-cache",
      }
    });
  } catch (error) {
    console.error("[speech] generation failed:", error);
    const response = toChatErrorResponse(error, deadline);
    logMetric({ ip: ipHashPrefix, status: response.status, durationMs: Date.now() - startedAt });
    return response;
  }
}
