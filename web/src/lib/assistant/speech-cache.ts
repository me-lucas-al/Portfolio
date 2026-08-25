import { createHash } from "node:crypto";
import { makeSpeechCacheService } from "@portfolio/core/src/factories/_index";
import { getStorageProvider } from "@/factories/storage-factory";
import { synthesizeSpeech, pcmToWav, resolveModel, resolveVoice } from "@/lib/assistant/tts-provider";

// The cache key intentionally excludes locale: the client never sends one to
// /api/tts, and the text itself (already translated) is the actual target
// language. It DOES include voice+model so that changing either env var
// naturally produces fresh cache entries instead of serving audio recorded
// under a different voice. Text is only whitespace-trimmed before hashing -
// it already went through truncateForSpeech's sentence-boundary truncation
// upstream, so no further normalization is needed for a consistent key
// between the write path (cache-miss synthesis) and every read path
// (/api/tts's lookup, /api/chat's prewarm lookup).
export function computeSpeechCacheHash(text: string, voice: string, model: string): string {
  const normalized = text.trim();
  return createHash("sha256").update(`${normalized}|${voice}|${model}`).digest("hex");
}

export interface SpeechCacheHit {
  audioUrl: string;
}

export async function findCachedSpeech(text: string): Promise<SpeechCacheHit | null> {
  const hash = computeSpeechCacheHash(text, resolveVoice(), resolveModel());
  const entry = await makeSpeechCacheService().findByHash(hash);
  return entry ? { audioUrl: entry.audioUrl } : null;
}

export interface SynthesizeAndCacheResult {
  wav: Buffer;
  audioUrl: string;
}

// Shared by /api/tts's cache-miss path and /api/chat's prewarm path so the
// synthesize -> upload -> cache-row pipeline exists in exactly one place.
// The cache row is only written after synthesis AND upload have both fully
// succeeded - a partial or failed attempt never gets cached (nothing here
// writes to the DB before `uploadRaw` has returned a real URL).
export async function synthesizeAndCacheSpeech(apiKey: string, text: string, signal: AbortSignal): Promise<SynthesizeAndCacheResult> {
  const voice = resolveVoice();
  const model = resolveModel();
  const hash = computeSpeechCacheHash(text, voice, model);

  const { pcm, sampleRate } = await synthesizeSpeech(apiKey, text, signal);
  const wav = pcmToWav(pcm, sampleRate, 1);

  const storage = getStorageProvider();
  const audioUrl = await storage.uploadRaw(wav, hash, "portfolio/speech");

  await makeSpeechCacheService().save({
    textHash: hash,
    audioUrl,
    voice,
    model,
    byteLength: wav.length,
  });

  return { wav, audioUrl };
}
