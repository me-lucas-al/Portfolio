
function getStatusFromApiErrorShape(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

export function getUpstreamStatus(error: unknown): number | undefined {
  return getStatusFromApiErrorShape(error);
}

export function isUpstreamOverloaded(error: unknown): boolean {
  const status = getUpstreamStatus(error);
  return status === 500 || status === 502 || status === 503 || status === 504;
}

export function isUpstreamQuotaExceeded(error: unknown): boolean {
  return getUpstreamStatus(error) === 429;
}

export function isAbortError(error: unknown): boolean {
  if (!(error instanceof DOMException)) return false;
  return error.name === "AbortError" || error.name === "TimeoutError";
}
