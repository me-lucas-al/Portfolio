import { NextRequest } from "next/server";

// Vercel's edge network sets `x-real-ip` to the actual client IP and cannot
// have that value spoofed by the client; `x-forwarded-for` is used only as a
// fallback for local dev, where neither header may be trustworthy anyway.
export function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  const first = forwardedFor?.split(",")[0]?.trim();
  return first || "unknown";
}

// Defense-in-depth against browser-based CSRF, not an anti-abuse control:
// a non-browser client can simply omit Origin or forge it, which the actual
// cost controls (rate limit + daily budget) are responsible for stopping.
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}
