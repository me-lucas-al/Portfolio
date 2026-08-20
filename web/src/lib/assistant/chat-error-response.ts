import { isUpstreamQuotaExceeded, isUpstreamOverloaded, isAbortError } from "@portfolio/core/src/providers/gemini-error";
import type { ChatErrorBody, ChatErrorReason } from "@portfolio/packages/schemas/assistant/chat-error";
import type { Deadline } from "./deadline";

const OVERLOADED_RETRY_AFTER_SECONDS = 5;

function chatError(error: string, reason: ChatErrorReason): ChatErrorBody {
  return { error, reason };
}

export function toChatErrorResponse(error: unknown, deadline: Deadline): Response {
  if (isUpstreamQuotaExceeded(error)) {
    return Response.json(chatError("Upstream quota exceeded", "upstream_quota"), { status: 503 });
  }

  if (isUpstreamOverloaded(error)) {
    return Response.json(chatError("Upstream model overloaded", "upstream_overloaded"), {
      status: 503,
      headers: { "Retry-After": String(OVERLOADED_RETRY_AFTER_SECONDS) },
    });
  }

  // Our own deadline firing looks identical to a client-initiated abort
  // (both surface as AbortError/TimeoutError) — only report "timeout" when the
  // shared budget is actually exhausted, otherwise fall through to "unknown".
  if (isAbortError(error) && deadline.remainingMs() <= 0) {
    return Response.json(chatError("Request timed out", "timeout"), { status: 504 });
  }

  return Response.json(chatError("Failed to generate a response", "unknown"), { status: 502 });
}
