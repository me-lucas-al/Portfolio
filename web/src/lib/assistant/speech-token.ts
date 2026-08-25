import { createHmac, timingSafeEqual } from "node:crypto";

// A signed, self-contained token that carries the (already-truncated) speech
// text itself, so /api/tts needs no DB/state lookup on the hot path: the
// text travels in the URL, authenticated by an HMAC keyed with a secret only
// the server knows. Deliberately a *different* secret from IP_HASH_SALT
// (SPEECH_TOKEN_SECRET) - the two have very different blast radii if leaked:
// one hashes IPs, the other authorizes arbitrary text-to-speech generation.
const DEFAULT_TTL_MS = 10 * 60_000;

interface SpeechTokenPayload {
  text: string;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.SPEECH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("SPEECH_TOKEN_SECRET is not set");
  }
  return secret;
}

function sign(payloadB64Url: string): string {
  return createHmac("sha256", getSecret()).update(payloadB64Url).digest("base64url");
}

function isSpeechTokenPayload(value: unknown): value is SpeechTokenPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.text === "string" && typeof candidate.exp === "number";
}

export function signSpeechToken(text: string, ttlMs: number = DEFAULT_TTL_MS): string {
  const payload: SpeechTokenPayload = { text, exp: Date.now() + ttlMs };
  const payloadB64Url = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = sign(payloadB64Url);
  return `${payloadB64Url}.${signature}`;
}

export type SpeechTokenVerifyResult =
  | { ok: true; text: string }
  | { ok: false; reason: "malformed" | "bad_signature" | "expired" };

export function verifySpeechToken(token: string): SpeechTokenVerifyResult {
  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) {
    return { ok: false, reason: "malformed" };
  }

  const payloadB64Url = token.slice(0, separatorIndex);
  const providedSignature = token.slice(separatorIndex + 1);
  const expectedSignature = sign(payloadB64Url);

  const providedBuffer = Buffer.from(providedSignature, "base64url");
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");
  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return { ok: false, reason: "bad_signature" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(payloadB64Url, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (!isSpeechTokenPayload(parsed)) return { ok: false, reason: "malformed" };
  if (Date.now() > parsed.exp) return { ok: false, reason: "expired" };

  return { ok: true, text: parsed.text };
}
