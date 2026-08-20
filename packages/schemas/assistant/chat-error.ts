export type ChatErrorReason =
  | "disabled"
  | "not_configured"
  | "invalid_origin"
  | "invalid_request"
  | "rate_limited"
  | "daily_budget"
  | "upstream_quota"
  | "upstream_overloaded"
  | "timeout"
  | "unknown";

export interface ChatErrorBody {
  error: string;
  reason: ChatErrorReason;
}
