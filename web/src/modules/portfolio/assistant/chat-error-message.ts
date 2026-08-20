import type { ChatErrorReason } from "@portfolio/packages/schemas/assistant/chat-error";
import type { Dictionary } from "@/i18n";

type AssistantDictionary = Dictionary["assistant"];

const REASON_TO_MESSAGE_KEY: Record<ChatErrorReason, keyof AssistantDictionary> = {
  disabled: "error",
  not_configured: "error",
  invalid_origin: "error",
  invalid_request: "error",
  rate_limited: "rateLimited",
  daily_budget: "quotaExceeded",
  upstream_quota: "quotaExceeded",
  upstream_overloaded: "overloaded",
  timeout: "timeout",
  unknown: "error",
};

function isChatErrorReason(reason: string | undefined): reason is ChatErrorReason {
  return !!reason && Object.prototype.hasOwnProperty.call(REASON_TO_MESSAGE_KEY, reason);
}

export function resolveChatErrorMessage(dict: AssistantDictionary, reason: string | undefined): string {
  if (!isChatErrorReason(reason)) return dict.error;

  const message = dict[REASON_TO_MESSAGE_KEY[reason]];
  return typeof message === "string" ? message : dict.error;
}
